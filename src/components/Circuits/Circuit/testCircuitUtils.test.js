import { getNodes, boardToComponents, measureGaugeVoltage } from './circuitUtils'

test('getNodes right/left connections', () => {
  expect(getNodes(0, 0, [1, 3])).toEqual([[1, 2], [1, 0]]) // center = [1, 1]
  expect(getNodes(0, 1, [1, 3])).toEqual([[1, 4], [1, 2]]) // center = [1, 3]
  expect(getNodes(1, 0, [1, 3])).toEqual([[3, 2], [3, 0]]) // center = [3, 1]
  expect(getNodes(3, 3, [1, 3])).toEqual([[7, 8], [7, 6]]) // center = [7, 7]
})

test('getNodes up/down connections', () => {
  expect(getNodes(0, 0, [0, 2])).toEqual([[0, 1], [2, 1]]) // center = [1, 1]
  expect(getNodes(0, 1, [0, 2])).toEqual([[0, 3], [2, 3]]) // center = [1, 3]
  expect(getNodes(1, 0, [0, 2])).toEqual([[2, 1], [4, 1]]) // center = [3, 1]
  expect(getNodes(3, 3, [0, 2])).toEqual([[6, 7], [8, 7]]) // center = [7, 7]
})

test('getNodes up/right connections', () => {
  expect(getNodes(0, 0, [0, 1])).toEqual([[0, 1], [1, 2]]) // center = [1, 1]
  expect(getNodes(0, 1, [0, 1])).toEqual([[0, 3], [1, 4]]) // center = [1, 3]
  expect(getNodes(1, 0, [0, 1])).toEqual([[2, 1], [3, 2]]) // center = [3, 1]
  expect(getNodes(3, 3, [0, 1])).toEqual([[6, 7], [7, 8]]) // center = [7, 7]
})

test('getNodes left/down connections', () => {
  expect(getNodes(0, 0, [3, 2])).toEqual([[1, 0], [2, 1]]) // center = [1, 1]
  expect(getNodes(0, 1, [3, 2])).toEqual([[1, 2], [2, 3]]) // center = [1, 3]
  expect(getNodes(1, 0, [3, 2])).toEqual([[3, 0], [4, 1]]) // center = [3, 1]
  expect(getNodes(3, 3, [3, 2])).toEqual([[7, 6], [8, 7]]) // center = [7, 7]
})

const board = {
  elements: {
    0: {
      0: {
        type: 'resistor',
        connections: [1, 2],
        value: 10,
        powered: true
      },
      1: {
        type: 'wire',
        connections: [1, 3],
        powered: true
      }
    },
    1: {
      0: {
        type: 'source',
        connections: [0, 1],
        value: 10,
        powered: true
      },
      1: {
        type: 'wire',
        connections: [1, 3],
        powered: true
      }
    }
  },
  source: [1, 0]
}

test('boardToComponents makes components of each type', () => {
  const components = boardToComponents(board)
  expect(components.length).toBe(6)
  expect(components[0].getType()).toBe('resistor')
  expect(components[0].getValue()).toBe(10)
  expect(components[0].getNodes()).toEqual([[1, 2], [2, 1]])
  expect(components[1].getType()).toBe('wire')
  expect(components[2].getType()).toBe('wire')
  expect(components[3].getType()).toBe('voltagesource')
  expect(components[3].getValue()).toBe(10)
  expect(components[4].getType()).toBe('wire')
  expect(components[5].getType()).toBe('wire')
  expect(components[5].getNodes()).toEqual([[3, 2], [3, 3]])
})

test('boardToComponents with 2 x 3 board', () => {
  board.elements[0][2] = {
    type: 'resistor',
    connections: [2, 3],
    value: 5,
    powered: true
  }
  board.elements[1][2] = {
    type: 'wire',
    connections: [0, 3],
    powered: true
  }
  const components = boardToComponents(board)
  expect(components.length).toBe(9)
  expect(components[0].getType()).toBe('resistor')
  expect(components[0].getValue()).toBe(10)
  expect(components[0].getNodes()).toEqual([[1, 2], [2, 1]])
  expect(components[1].getType()).toBe('wire')
  expect(components[2].getType()).toBe('wire')
  expect(components[3].getType()).toBe('resistor')
  expect(components[3].getValue()).toBe(5)
  expect(components[3].getNodes()).toEqual([[2, 5], [1, 4]])
  expect(components[4].getType()).toBe('voltagesource')
  expect(components[4].getValue()).toBe(10)
  expect(components[5].getType()).toBe('wire')
  expect(components[5].getNodes()).toEqual([[3, 4], [3, 3]])
  expect(components[6].getType()).toBe('wire')
  expect(components[6].getNodes()).toEqual([[3, 2], [3, 3]])
  expect(components[7].getType()).toBe('wire')
  expect(components[8].getType()).toBe('wire')
})

test('measureGaugeVoltage 1 wire', () => {
  const testBoard = {
    elements: {
      0: {
        0: {
          type: 'wire',
          connections: [0, 2],
          powered: false
        }
      }
    }
  }
  expect(measureGaugeVoltage(testBoard, [0, 0])).toBe('0.00000 V')
})

test('measureGaugeVoltage 1 source', () => {
  const testBoard = {
    elements: {
      0: {
        0: {
          type: 'source',
          connections: [0, 2],
          powered: false,
          value: 7
        }
      }
    }
  }
  expect(measureGaugeVoltage(testBoard, [0, 0])).toBe('7.00000 V')
})

test('measureGaugeVoltage 4 components series', () => {
  const testBoard = {
    elements: {
      0: {
        0: {
          type: 'resistor',
          connections: [1, 2],
          value: 10,
          powered: true
        },
        1: {
          type: 'wire',
          connections: [2, 3],
          powered: true
        }
      },
      1: {
        0: {
          type: 'source',
          connections: [0, 1],
          value: 7,
          powered: true
        },
        1: {
          type: 'wire',
          connections: [0, 3],
          powered: true
        }
      }
    },
    source: [1, 0]
  }
  expect(measureGaugeVoltage(testBoard, [1, 0])).toBe('7.00000 V')
  expect(measureGaugeVoltage(testBoard, [0, 0])).toBe('-7.00000 V')
})

test('measureGaugeVoltage 6 components series', () => {
  expect(measureGaugeVoltage(board, [0, 0])).toBe('-6.66667 V')
  expect(measureGaugeVoltage(board, [0, 2])).toBe('-3.33333 V')
})

test('measureGaugeVoltage 9 components parallel', () => {
  const testBoard = {
    elements: {
      0: {
        0: {
          type: 'resistor',
          connections: [1, 2],
          value: 5,
          powered: true
        },
        1: {
          type: 'wire',
          connections: [1, 2, 3],
          powered: true
        },
        2: {
          type: 'wire',
          connections: [2, 3],
          powered: true
        }
      },
      1: {
        0: {
          type: 'source',
          connections: [0, 2],
          value: 10,
          powered: true
        },
        1: {
          type: 'resistor',
          connections: [0, 2],
          value: 10,
          powered: true
        },
        2: {
          type: 'resistor',
          connections: [0, 2],
          value: 10,
          powered: true
        }
      },
      2: {
        0: {
          type: 'wire',
          connections: [0, 1],
          powered: true
        },
        1: {
          type: 'wire',
          connections: [0, 1, 3],
          powered: true
        },
        2: {
          type: 'wire',
          connections: [0, 3],
          powered: true
        }
      }
    },
    source: [1, 0]
  }

  expect(measureGaugeVoltage(testBoard, [1, 0])).toBe('10.0000 V')
  expect(measureGaugeVoltage(testBoard, [0, 0])).toBe('-5.00000 V')
  expect(measureGaugeVoltage(testBoard, [1, 1])).toBe('5.00000 V')
  expect(measureGaugeVoltage(testBoard, [1, 2])).toBe('5.00000 V')
})
