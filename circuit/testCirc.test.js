const { Lead,
        Resistor,
        VoltageSource,
        Wire,
        simulateCircuit
      } = require('./circ')

test('Basic Lead methods', () => {
  const lead = new Lead([1, 1], false)
  expect(lead.getType()).toBe('lead')
  expect(lead.getNodes()).toEqual([[1, 1]])
  expect(lead.isLead).toBe(true)
  expect(lead.black).toBe(false)
})

test('Basic Resistor methods', () => {
  const resistor = new Resistor(5, [[0, 0], [1, 1]])
  expect(resistor.getType()).toBe('resistor')
  expect(resistor.getValue()).toBe(5)
  expect(resistor.getNodes()).toEqual([[0, 0], [1, 1]])
})

test('Basic VoltageSource methods', () => {
  const source = new VoltageSource(5, [[0, 0], [1, 1]])
  expect(source.getType()).toBe('voltagesource')
  expect(source.getValue()).toBe(5)
  expect(source.getNodes()).toEqual([[0, 0], [1, 1]])
})

test('Basic Wire methods', () => {
  const wire = new Wire([[0, 0], [1, 1]])
  expect(wire.getType()).toBe('wire')
  expect(wire.getNodes()).toEqual([[0, 0], [1, 1]])
  expect(wire.isWire).toBe(true)
})

let blackLeadObj = new Lead([100, 100], true)
let redLeadObj = new Lead([100, 101], false)
const resistor1 = new Resistor(1, [[100, 100], [100, 101]])
const resistor2 = new Resistor(1, [[300, 300], [300, 301]])
const source = new VoltageSource(10, [[200, 200], [200, 201]])
const wire1 = new Wire([[100, 100], [200, 200]]) // source to resistor1
const wire2 = new Wire([[100, 101], [200, 201]]) // resistor1 to source
const wire3 = new Wire([[300, 301], [200, 201]]) // resistor2 to source
const wire4 = new Wire([[300, 300], [200, 200]]) // source to resistor2
const wire5 = new Wire([[100, 101], [300, 300]]) // resistor1 to resistor2

test('No voltage source', () => {
  const objects = [blackLeadObj, redLeadObj, resistor1]

  expect(simulateCircuit(objects)).toBe('0.00000 V')
})

test('1 resistor circuit', () => {
  const objects = [blackLeadObj, redLeadObj, source, resistor1, wire1, wire2]

  expect(simulateCircuit(objects)).toBe('10.0000 V')
})

test('Unconnected elements', () => {
  blackLeadObj = new Lead([300, 300], true)
  redLeadObj = new Lead([300, 301], false)
  let objects = [blackLeadObj, redLeadObj, source, resistor1, resistor2, wire1, wire2, wire3]

  expect(simulateCircuit(objects)).toBe('0.00000 V') // resistor2 voltage (not in circuit)

  blackLeadObj = new Lead([100, 100], true)
  redLeadObj = new Lead([100, 101], false)
  objects = [blackLeadObj, redLeadObj, source, resistor1, resistor2, wire1, wire2, wire3]

  expect(simulateCircuit(objects)).toBe('10.0000 V') // resistor1 voltage
})

test('2 resistors series', () => {
  blackLeadObj = new Lead([300, 300], true)
  redLeadObj = new Lead([300, 301], false)
  let objects = [blackLeadObj, redLeadObj, source, resistor1, resistor2, wire1, wire3, wire5]

  expect(simulateCircuit(objects)).toBe('5.00000 V') // resistor2 voltage

  blackLeadObj = new Lead([100, 100], true)
  redLeadObj = new Lead([100, 101], false)
  objects = [blackLeadObj, redLeadObj, source, resistor1, resistor2, wire1, wire3, wire5]

  expect(simulateCircuit(objects)).toBe('5.00000 V') // resistor1 voltage

})

test('2 resistors parallel', () => {
  const objects = [blackLeadObj, redLeadObj, source, resistor1, resistor2, wire1, wire2, wire3, wire4]

  expect(simulateCircuit(objects)).toBe('10.0000 V')
})
