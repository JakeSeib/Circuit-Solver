import { cloneDeep } from 'lodash'
import 

export const initBoard = {

  // connections:
  // 0: up
  // 1: right
  // 2: down
  // 3: left

  elements: {
    0: {
      0: {
        type: 'wire',
        connections: [1, 3],
        powered: true
      },
      1: {
        type: 'wire',
        connections: [1, 3],
        powered: true
      },
      2: {
        type: 'resistor',
        connections: [1, 3],
        powered: true
      },
      3: {
        type: 'source',
        connections: [1, 3],
        powered: true
      },
      4: {
        type: 'wire',
        connections: [1, 3],
        powered: true
      }
    }
  },
  source: [0, 3],
  powered: false
}

function inverseConnection (connection) {
  const connectionHash = {
    0: 2, // up/down
    1: 3, // left/right
    2: 0, // down/up
    3: 1// right/left
  }
  return connectionHash[connection]
}

function findConnections (board, coordinate) {
  // given a board and coordinate [x, y], return a list of all coordinates
  // within the board's size connected to coordinate
  const connected = []
  const [row, col] = coordinate
  const connections = board.elements[row][col].connections

  connections.forEach(connection => {
    switch (connection) {
    case 0:
      if ((row - 1) >= 0) {
        const adjacentCoordinate = [row - 1, col]
        if (board.elements[row - 1][col].connections.includes(inverseConnection(connection))) {
          connected.push(adjacentCoordinate)
        }
      }
      break
    case 1:
      if ((col + 1) < Object.keys(board.elements[0]).length) {
        const adjacentCoordinate = [row, col + 1]
        if (board.elements[row][col + 1].connections.includes(inverseConnection(connection))) {
          connected.push(adjacentCoordinate)
        }
      }
      break
    case 2:
      if ((row + 1) < Object.keys(board.elements).length) {
        const adjacentCoordinate = [row + 1, col]
        if (board.elements[row + 1][col].connections.includes(inverseConnection(connection))) {
          connected.push(adjacentCoordinate)
        }
      }
      break
    case 3:
      if ((col - 1) >= 0) {
        const adjacentCoordinate = [row, col - 1]
        if (board.elements[row][col - 1].connections.includes(inverseConnection(connection))) {
          connected.push(adjacentCoordinate)
        }
      }
      break
    }
  })

  return connected
}

function setAllUnpowered (board) {
  for (let i = 0; i < (Object.keys(board.elements).length); i++) {
    const row = board.elements[i]
    for (let y = 0; y < (Object.keys(row).length); y++) {
      row[y].powered = false
    }
  }
  return board
}

function addVisited (coordinate, visited) {
  const [row, col] = coordinate
  if (visited[row]) {
    visited[row][col] = true
  } else {
    visited[row] = { [col]: true }
  }
}

function hasVisited (coordinate, visited) {
  const [row, col] = coordinate
  if (visited[row]) {
    return visited[row][col]
  }
}

function updatePowered (board, coordinate = board.source, visited = {}) {
  // starting with power source, look for all connected circuit elements and
  // set their powered status to true
  const [row, col] = coordinate
  addVisited(coordinate, visited)
  board.elements[row][col].powered = true

  const connected = findConnections(board, coordinate).filter(coord => {
    return !hasVisited(coord, visited)
  })
  for (let i = 0; i < connected.length; i++) {
    updatePowered(board, connected[i], visited)
  }

  return board
}

export function

export function updateBoard (oldBoard, coordinate) {
  // given the previous board state and the 2-d coordinate of an element to be
  // rotated, return a copy of the board with updated connections and power status
  const newBoard = cloneDeep(oldBoard)
  const [row, col] = coordinate

  newBoard.elements[row][col].connections = newBoard.elements[row][col].connections.map(i => (i + 1) % 4)
  setAllUnpowered(newBoard)
  updatePowered(newBoard)

  return newBoard
}
