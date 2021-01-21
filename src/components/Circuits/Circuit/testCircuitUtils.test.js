import { getNodes, boardToComponents } from './circuitUtils'

// [ ][ ][ ]
// [x][x][x]
// [ ][ ][ ]

test('getNodes left/right connections', () => {
  expect(getNodes(0, 0, [1, 3])).toEqual([[1, 2], [1, 0]])
  expect(getNodes(0, 1, [1, 3])).toEqual([[1, 5], [1, 3]])
  expect(getNodes(1, 0, [1, 3])).toEqual([[4, 2], [4, 0]])
  expect(getNodes(3, 3, [1, 3])).toEqual([[10, 11], [10, 9]])
})

// test('Dummy test', () => {
//   expect(boardToComponents('hello')).toBe('hello')
// })
