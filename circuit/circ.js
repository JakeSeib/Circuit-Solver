const { AffineExpression, solveLinearSystem } = require('./linearsystem')

// Todo:
// [x] Write tests for basic circuit components and circuits
//   [x] getNodes functions
//   [x] finding voltage in circuits with connected and unconnected pieces
//     [x] basic 1 vs 1 resistor circuit
//     [x] unconnected element(s)
//     [x] series resistors
//     [x] parallel resistors
//     [x] leads on incomplete circuit
// [] Remove as much visual code as possible and tidy file
// [] Write and test function to convert hash of positions to components and connections to list of circuit elements (not including leads)
//   [] Start with tests to convert each element into components (batteries, wires (straight, turns and junctions), and resisters) in various rotations
//   [] Then write tests for combinations of them
// [] Write and test code for find voltage at relevant locations
//   [] Start with updating previous function to to account for gauges (new type that creates wires but updates hash of nodes to test for voltage)
//   [] Then write and test function to get voltage at all gauges and return them
//   [] Refactor to not have to recalculate 4 times

// Meter leads ----------------------------------------------------------------
function Lead(node, black) {
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
function Resistor(value, nodes) {
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
function VoltageSource(value, nodes) {
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
function Wire(nodes) {
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

var isMouseDown = false;
var canvasWidth = 800;
var canvasHeight = 400;

// The element or wire with focus
var selectedObject = null;
var tentativelySelectedObject = null;
var bDraggedOutsideThreshold = false;
// The element or wire being dragged
var draggedObject = null;

// Node that the cursor is near, or null
var highlightedNode = null;

var dragOffsetx = null;
var dragOffsety = null;
// Original coordinates of thing being dragged
var dragOriginalx = null;
var dragOriginaly = null;
// Cursor position at drag start
var dragStartx = null;
var dragStarty = null;

var previousSnapPosition = '';

function nodeToStr(n) {
  return n[0] + ',' + n[1];
}

// ----------------------------------------------------------------------------

function redraw() {
  var canvas = document.getElementById('circarea');
  if (!canvas.getContext) {
    return;
  }
  var ctx = canvas.getContext('2d');

  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw all the placed objects
  for (var objIndex in objects) {
    var obj = objects[objIndex];
    if (obj === selectedObject) {
      ctx.lineWidth = 3.0;
      ctx.strokeStyle = "rgb(180, 0, 0)";
    } else {
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "rgb(0, 0, 0)";
    }
    obj.draw(ctx);
  }

  // Draw a circle at the highlighted node.
  if (highlightedNode !== null) {
    ctx.beginPath();
    ctx.arc(highlightedNode[0], highlightedNode[1], 3, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
}

function setCanvasDimensions(w, h) {
  document.getElementById('leadoutput').style.left = (w - 310) + 'px';
  document.getElementById('circarea').width = w;
  document.getElementById('circarea').height = h;
  canvasWidth = w;
  canvasHeight = h;
}

// Size the drawing area.
function sizeCanvas() {
  setCanvasDimensions(window.innerWidth - 8, window.innerHeight - 45);

  redraw();
}

// Return a node (on some object, somewhere) that is close to (xpos, ypos), if
// one exists. Otherwise, return null. If excludeDragged is true, do not allow
// nodes on draggedObject.
function findNearbyNode(xpos, ypos, excludeDragged) {
  var nearestNode = null;
  for (var objIndex in objects) {
    var obj = objects[objIndex];
    // Don't try to snap to a node on an object that is being moved
    if (excludeDragged && (obj === draggedObject)) {
      continue;
    }
    for (var nodeIndex in obj.getNodes()) {
      var node = obj.getNodes()[nodeIndex];
      if (normSquared(xpos - node[0], ypos - node[1]) < 10 * 10) {
        nearestNode = node;
      }
    }
  }
  return nearestNode;
}

// Return an object that is under the cursor, or null if there is no such
// object.
function findNearestObject(xpos, ypos) {
  var nearestObject = null;
  for (var objIndex in objects) {
    var obj = objects[objIndex];
    if (obj.isClickInArea(xpos, ypos)) {
      nearestObject = obj;
    }
  }
  return nearestObject;
}

// Return the name of the variable associated with the voltage at NODE.
function voltageVariable(node) {
  return 'v[' + nodeToStr(node) + ']';
}

// Simulation-related logic ---------------------------------------------------

// Initialize everything.
function init() {
  sizeCanvas();

  // Place the objects.
  var horizLeadMargin = 75;
  var vertLeadMargin = 75;
  // blackLeadObj = new Lead(horizLeadMargin, canvasHeight - vertLeadMargin, true);
  // redLeadObj = new Lead(canvasWidth - horizLeadMargin - 30, vertLeadMargin, false);
  // objects.push(blackLeadObj);
  // objects.push(redLeadObj);
  // objects.push(new VoltageSource(0, 0, 5, true));
  // objects.push(new Resistor(60, 0, 1, true));

  printMessage("Welcome!", true);

  redraw();
}

function simulateCircuit(components) {
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

// Event handlers -------------------------------------------------------------

// Handle a mousedown event.
function md(e) {
  isMouseDown = true;

  var cursorX = e.clientX - e.target.offsetLeft;
  var cursorY = e.clientY - e.target.offsetTop;
  dragStartx = cursorX;
  dragStarty = cursorY;

  // If the selected element is a wire and we are near its endpoints, allow
  // dragging by the endpoints.
  if (selectedObject !== null && selectedObject.isWire) {
    var nodes = selectedObject.getNodes();
    for (var nodeIndex in nodes) {
      var node = nodes[nodeIndex];
      if (normSquared(cursorX - node[0], cursorY - node[1]) < 10 * 10) {
        draggedObject = selectedObject;
        if (node === nodes[0]) {
          // Switch the endpoints of the segment, because code in mm
          // assumes we're dragging by the second endpoint.
          var tmp_coord_x = draggedObject.x1;
          draggedObject.x1 = draggedObject.x2;
          draggedObject.x2 = tmp_coord_x;
          var tmp_coord_y = draggedObject.y1;
          draggedObject.y1 = draggedObject.y2;
          draggedObject.y2 = tmp_coord_y;
        }
        return;
      }
    }
  }

  // Mark an object for possible drag or selection if the cursor is close
  // enough to the center of it. Dragging occurs if the cursor moves outside
  // a given radius.
  var nearestNode = findNearbyNode(cursorX, cursorY, false);
  var nearestObject = findNearestObject(cursorX, cursorY);

  if (nearestObject !== null && !(nearestObject.isWire && nearestNode !== null)) {
    tentativelySelectedObject = nearestObject;
    bDraggedOutsideThreshold = false;
    dragOffsetx = nearestObject.xpos - cursorX;
    dragOffsety = nearestObject.ypos - cursorY;
    dragOriginalx = nearestObject.xpos;
    dragOriginaly = nearestObject.ypos;
  } else if (nearestNode !== null) {
    // If we're near an endpoint, create a new wire starting there.
    draggedObject = new Wire(nearestNode[0], nearestNode[1],
                             nearestNode[0], nearestNode[1]);
    objects.push(draggedObject);
  } else {
    // Otherwise, deselect all objects.
    selectedObject = null;
    tentativelySelectedObject = null;
  }

  redraw();
}

// Handle a mouseup event.
function mu(e) {
  isMouseDown = false;

  // Select an object if the mouse has not moved far since the mousedown.
  if (tentativelySelectedObject !== null && !bDraggedOutsideThreshold) {
    selectedObject = tentativelySelectedObject;
  }
  draggedObject = null;

  redraw();
}

// Handle a mousemove event.
function mm(e) {
  var cursorX = e.clientX - e.target.offsetLeft;
  var cursorY = e.clientY - e.target.offsetTop;

  var needsRedraw = false;

  // Update the mouseover hints as necessary.
  var nearestObject = findNearestObject(cursorX, cursorY);
  var nearbyNode = null;
  if (nearestObject !== null && nearestObject.getMessage) {
    // If we're over a real element, display the tooltip for that object
    // and set the hand cursor.
    printMessage(nearestObject.getMessage(), true);
    // TODO: refactor this into a separate function.
    document.getElementById('circarea').className = "clickable";
  } else {
    // Otherwise, if we're near a node, highlight that node.
    nearbyNode = findNearbyNode(cursorX, cursorY, false);
    if (nearbyNode !== null) {
      document.getElementById('circarea').className = "clickable";
    } else {
      document.getElementById('circarea').className = "";
    }
    // TODO: indicate to the user when they can drag a node to create or resize
    // a wire.
    printMessage('', true);
  }
  // Check whether the highlighted node moved, and if so, force a redraw.
  if (nearbyNode != highlightedNode) {
    highlightedNode = nearbyNode;
    needsRedraw = true;
  }

  if (isMouseDown) {
    if (draggedObject === null) {
      // Initiate a drag if applicable.
      if (normSquared(cursorX - dragStartx, cursorY - dragStarty) > 5 * 5) {
        if (tentativelySelectedObject !== null &&
            !tentativelySelectedObject.isWire) {
          draggedObject = tentativelySelectedObject;
        }
        bDraggedOutsideThreshold = true;
      }
    } else {
      var bRecompute = false;

      var snapPosition;
      if (draggedObject.isWire) {
        // Snap the endpoint being dragged to a nearby node, if possible.
        var wireSnapTargetNode = findNearbyNode(cursorX, cursorY, true);
        if (wireSnapTargetNode !== null) {
          draggedObject.x2 = wireSnapTargetNode[0];
          draggedObject.y2 = wireSnapTargetNode[1];
          snapPosition = nodeToStr(wireSnapTargetNode);
        } else {
          draggedObject.x2 = cursorX;
          draggedObject.y2 = cursorY;
          snapPosition = null;
        }
      } else {
        // Snap some node on this object to a nearby node, if possible
        var nodes = draggedObject.getNodes();
        var snapped = false;
        for (var nodeIndex in nodes) {
          var node = nodes[nodeIndex];
          var nodeRelx = node[0] - draggedObject.xpos;
          var nodeRely = node[1] - draggedObject.ypos;
          var objectSnapTargetNode = findNearbyNode(
            cursorX + dragOffsetx + nodeRelx,
            cursorY + dragOffsety + nodeRely,
            true);
          if (objectSnapTargetNode !== null) {
            draggedObject.xpos = objectSnapTargetNode[0] - nodeRelx;
            draggedObject.ypos = objectSnapTargetNode[1] - nodeRely;
            snapPosition = objectSnapTargetNode[0] + ',' +
              objectSnapTargetNode[1] + ',' + nodeRelx + ',' + nodeRely;
            snapped = true;
            break;
          }
        }
        if (!snapped) {
          draggedObject.xpos = cursorX + dragOffsetx;
          draggedObject.ypos = cursorY + dragOffsety;
          snapPosition = null;
        }
      }
      bRecompute = (snapPosition != previousSnapPosition);
      previousSnapPosition = snapPosition;


      if (bRecompute) {
        simulateCircuit(objects);
      }
    }

    needsRedraw = true;
  }

  if (needsRedraw) {
    redraw();
  }
}

function mover(e) { }

function mout(e) { }

function kdown(e) {
  // Delete selected element when DEL is pressed.
  if (e.keyCode == 46) {
    if (selectedObject !== null && !selectedObject.isLead) {
      objects.splice(objects.indexOf(selectedObject), 1);
      selectedObject = null;
      simulateCircuit(objects);
      redraw();
    }
    return false;
  } else if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57)) {
    if (selectedObject !== null &&
        !selectedObject.isLead) {
      if (e.keyCode == 8) {
        // Backspace
        selectedObject.value = Math.floor(selectedObject.value / 10);
        redraw();
      } else {
        // Some digit
        var digit = e.keyCode - 48;
        selectedObject.value = selectedObject.value * 10 + digit;
        redraw();
      }
      printMessage(selectedObject.getMessage(), true);
      simulateCircuit(objects);
    }
    return false;
  }
}

function selectstart(e) {
  // TODO: be more selective about returning false, so that the user can
  // still select the actual text on the page.
  return false;
}

module.exports = {
  Lead,
  Resistor,
  Wire,
  VoltageSource,
  simulateCircuit
}
