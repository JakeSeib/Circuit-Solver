import { getNodes, boardToComponents } from './circuitUtils'

test('getNodes left/right connections', () => {
  expect(getNodes(0, 0, [1, 3])).toEqual([[1, 2], [1, 0]]) // center = [1, 1]
  expect(getNodes(0, 1, [1, 3])).toEqual([[1, 5], [1, 3]]) // center = [1, 4]
  expect(getNodes(1, 0, [1, 3])).toEqual([[4, 2], [4, 0]]) // center = [4, 1]
  expect(getNodes(3, 3, [1, 3])).toEqual([[10, 11], [10, 9]]) // center = [10, 10]
})

test('getNodes up/down connections', () => {
  expect(getNodes(0, 0, [0, 2])).toEqual([[0, 1], [2, 1]]) // center = [1, 1]
  expect(getNodes(0, 1, [0, 2])).toEqual([[0, 4], [2, 4]]) // center = [1, 4]
  expect(getNodes(1, 0, [0, 2])).toEqual([[3, 1], [5, 1]]) // center = [4, 1]
  expect(getNodes(3, 3, [0, 2])).toEqual([[9, 10], [11, 10]]) // center = [10, 10]
})

test('getNodes up/right connections', () => {
  expect(getNodes(0, 0, [0, 1])).toEqual([[0, 1], [1, 2]]) // center = [1, 1]
  expect(getNodes(0, 1, [0, 1])).toEqual([[0, 4], [1, 5]]) // center = [1, 4]
  expect(getNodes(1, 0, [0, 1])).toEqual([[3, 1], [4, 2]]) // center = [4, 1]
  expect(getNodes(3, 3, [0, 1])).toEqual([[9, 10], [10, 11]]) // center = [10, 10]
})

test('getNodes left/down connections', () => {
  expect(getNodes(0, 0, [3, 2])).toEqual([[1, 0], [2, 1]]) // center = [1, 1]
  expect(getNodes(0, 1, [3, 2])).toEqual([[1, 3], [2, 4]]) // center = [1, 4]
  expect(getNodes(1, 0, [3, 2])).toEqual([[4, 0], [5, 1]]) // center = [4, 1]
  expect(getNodes(3, 3, [3, 2])).toEqual([[10, 9], [11, 10]]) // center = [10, 10]
})

const board = {
  elements: {
    0: {
      0: {
        type: 'resistor',
        connections: [1, 3],
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
        connections: [1, 3],
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
  expect(components.length).toBe(4)
  expect(components[0].getType()).toBe('resistor')
  expect(components[0].getValue()).toBe(10)
  expect(components[0].getNodes()).toEqual([[1, 2], [1, 0]])
})
