import { cloneDeep } from 'lodash'

// connections:
// 0: up
// 1: right
// 2: down
// 3: left

export const initBoard = {
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
  const connections = board[row][col].connections

  connections.forEach(connection => {
    switch (connection) {
    case 0:
      if ((row - 1) >= 0) {
        const adjacentCoordinate = [row - 1, col]
        if (board[row - 1][col].connections.includes(inverseConnection(connection))) {
          connected.push(adjacentCoordinate)
        }
      }
      break
    case 1:
      if ((col + 1) < Object.keys(board[0]).length) {
        const adjacentCoordinate = [row, col + 1]
        if (board[row][col + 1].connections.includes(inverseConnection(connection))) {
          connected.push(adjacentCoordinate)
        }
      }
      break
    case 2:
      if ((row + 1) < Object.keys(board).length) {
        const adjacentCoordinate = [row + 1, col]
        if (board[row + 1][col].connections.includes(inverseConnection(connection))) {
          connected.push(adjacentCoordinate)
        }
      }
      break
    case 3:
      if ((col - 1) >= 0) {
        const adjacentCoordinate = [row, col - 1]
        if (board[row][col - 1].connections.includes(inverseConnection(connection))) {
          connected.push(adjacentCoordinate)
        }
      }
      break
    }
  })

  return connected
}

function setAllUnpowered (board) {
  for (let i = 0; i < (Object.keys(board).length); i++) {
    const row = board[i]
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

export function updatePowered (oldBoard, newBoard = setAllUnpowered(cloneDeep(oldBoard)), coordinate = [0, 3], visited = {}) {
  // starting with power source (hardcoded as default coordinate), look for all
  // connected circuit elements and set their powered status to true
  const [row, col] = coordinate
  addVisited(coordinate, visited)
  newBoard[row][col].powered = true

  const connected = findConnections(newBoard, coordinate).filter(coord => {
    return !hasVisited(coord, visited)
  })
  for (let i = 0; i < connected.length; i++) {
    updatePowered(oldBoard, newBoard, connected[i], visited)
  }

  return newBoard
}
