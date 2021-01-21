import { AffineExpression, solveLinearSystem } from './linearsystem'

// Todo:
// [x] Write tests for basic circuit components and circuits
//   [x] getNodes functions
//   [x] finding voltage in circuits with connected and unconnected pieces
//     [x] basic 1 vs 1 resistor circuit
//     [x] unconnected element(s)
//     [x] series resistors
//     [x] parallel resistors
//     [x] leads on incomplete circuit
// [x] Remove as much visual code as possible and tidy file
// [] Write and test function to convert hash of positions to components and connections to list of circuit elements (not including leads)
//   [] Tests for conversion of each element into components (batteries, wires (straight, turns and junctions), and resistors) in various rotations
//   [] Tests for different combinations of components
// [] Write and test code for find voltage at relevant locations
//   [] Factor out old leadsconnected code
//   [] Update previous function to to account for gauges (new type of element that creates wires but updates hash of nodes to test for voltage)
//   [] Write and test function to get voltage at all gauges and return them
//   [] (Optional) Refactor to not have to recalculate circuit for each gauge

// Meter leads ----------------------------------------------------------------
export function Lead(node, black) {
  this.black = black;
  this.node = node
}
function lead_getType() {
  return 'lead';
}
function lead_getNodes() {
  return [this.node];
}
function lead_getBlack() {
  return this.black
}
Lead.prototype.getType = lead_getType;
Lead.prototype.getNodes = lead_getNodes;
Lead.prototype.getBlack = lead_getBlack;
Lead.prototype.isLead = true;

// Resistor -------------------------------------------------------------------
export function Resistor(value, nodes) {
  this.value = value;
  this.nodes = nodes
}
function resistor_getType() {
  return 'resistor';
}
function resistor_getValue() {
  return this.value;
}
function resistor_getNodes() {
  return this.nodes
}
Resistor.prototype.getType = resistor_getType;
Resistor.prototype.getValue = resistor_getValue;
Resistor.prototype.getNodes = resistor_getNodes;

// VoltageSource --------------------------------------------------------------
export function VoltageSource(value, nodes) {
  this.value = value;
  this.nodes = nodes
}
function vs_getType() {
  return 'voltagesource';
}
function vs_getValue() {
  return this.value;
}
function vs_getNodes() {
  return this.nodes
}
VoltageSource.prototype.getType = vs_getType;
VoltageSource.prototype.getValue = vs_getValue;
VoltageSource.prototype.getNodes = vs_getNodes;

// Wire -----------------------------------------------------------------------
export function Wire(nodes) {
  this.nodes = nodes
}
function w_getType() {
  return 'wire';
}
function w_getNodes() {
  return this.nodes;
}
function w_getOtherNode(n) {
  for (var nodeIndex in this.getNodes()) {
    var m = this.getNodes[nodeIndex];
    if (nodeToStr(m) != n) {
      return nodeToStr(m);
    }
  }
  return null;
}
Wire.prototype.getType = w_getType;
Wire.prototype.getNodes = w_getNodes;
Wire.prototype.getOtherNode = w_getOtherNode;
Wire.prototype.isWire = true;

function nodeToStr(n) {
  return n[0] + ',' + n[1];
}

// ----------------------------------------------------------------------------

// Return the name of the variable associated with the voltage at NODE.
function voltageVariable(node) {
  return 'v[' + nodeToStr(node) + ']';
}

// Simulation-related logic ---------------------------------------------------

export function simulateCircuit(components) {
  // find the leads in components
  let blackLeadObj
  let redLeadObj
  let componentIndex = 0
  while (!(blackLeadObj && redLeadObj)) {
    if (components[componentIndex].getType() === 'lead') {
      if (components[componentIndex].getBlack()) {
        blackLeadObj = components[componentIndex]
      } else {
        redLeadObj = components[componentIndex]
      }
    }
    componentIndex++
  }

  // Process the drawing data to associate x-y coordinates with nodes of
  // circuit elements.

  // Determine which nodes are adjacent to which elements.

  // This will be an associative array mapping a node-string to an array of
  // elements that touch that node.
  var nodes = [];
  // We'll add all the real circuit elements to this array.
  var placedObjects = [];

  for (var objIndex in components) {
    var obj = components[objIndex];
    if (obj.isLead) {
      continue;
    }
    placedObjects.push(obj);
    for (var nodeIndex in obj.getNodes()) {
      var node = obj.getNodes()[nodeIndex];
      // Put all the distinct nodes in a hashtable.
      var nodeStr = nodeToStr(node);
      if (!nodes[nodeStr]) {
        nodes[nodeStr] = [];
      }
      nodes[nodeStr].push(obj);
    }
  }

  // Determine whether the scope leads are connected to nodes.
  var redLeadConnected = false;
  var blackLeadConnected = false;
  for (var nodeStr in nodes) {
    if (nodeStr == nodeToStr(redLeadObj.getNodes()[0])) {
      redLeadConnected = true;
    }
    if (nodeStr == nodeToStr(blackLeadObj.getNodes()[0])) {
      blackLeadConnected = true;
    }
  }
  const bBothLeadsConnected = (redLeadConnected && blackLeadConnected) ||
    nodeToStr(redLeadObj.getNodes()[0]) == nodeToStr(blackLeadObj.getNodes()[0]);

  // If both leads are connected, formulate and solve a system of linear
  // equations to find the red lead voltage.
  if (bBothLeadsConnected) {
    var system = [];

    // Write an equation for KCL on each node.
    for (var nstr in nodes) {
      var orientations = [];
      var currents = [];
      // Enumerate all placed objects that touch the node.
      for (var objIndex in nodes[nstr]) {
        var obj = nodes[nstr][objIndex];
        // Use the index of the object in placedObjects to uniquely name the
        // associated current variable.
        var objectId = placedObjects.indexOf(obj);
        if (objectId > -1) {
          // Determine the orientation of the current into this object.
          orientations.push((nstr == nodeToStr(obj.getNodes()[0])) ? 1 : -1);
          currents.push('i[' + objectId + ']');
        }
      }
      // sum_currents = 0 when orientations are respected
      system.push(new AffineExpression(orientations, currents, 0));
    }

    // Write a voltage equation on each element.
    for (var objectId in placedObjects) {
      var obj = placedObjects[objectId];
      nodes = obj.getNodes();
      var node1name = voltageVariable(nodes[0]);
      var node2name = voltageVariable(nodes[1]);
      if (obj.getType() == 'resistor') {
        var currentname = 'i[' + objectId + ']';
        // V1 - V2 - R i == 0
        system.push(
          new AffineExpression([1, -1, -obj.getValue()],
                               [node1name, node2name, currentname],
                               0));
      } else if (obj.getType() == 'wire') {
        // V1 == V2
        system.push(new AffineExpression([1, -1], [node1name, node2name], 0));
      } else if (obj.getType() == 'voltagesource') {
        // V1 - V2 == V_s
        system.push(new AffineExpression([1, -1],
                                         [node1name, node2name],
                                         obj.getValue()));
      }
    }



    // Ground the black lead.
    var blackLeadVoltageName = voltageVariable(blackLeadObj.getNodes()[0]);
    system.push(new AffineExpression([1], [blackLeadVoltageName], 0));

    // Display the voltage at the red lead.
    var voltageMsg;
    try {
      var soln = solveLinearSystem(system);
      var v = soln[voltageVariable(redLeadObj.getNodes()[0])];
      if (isNaN(v)) {
        voltageMsg = 'floating';
      } else {
        voltageMsg = v.toPrecision(6) + ' V';
      }
    } catch (e) {
      if (e.message == 'inconsistent') {
        voltageMsg = 'short circuit';
      } else {
        throw e;
      }
    }
    return voltageMsg;
  } else {
    return 'floating';
  }
}
