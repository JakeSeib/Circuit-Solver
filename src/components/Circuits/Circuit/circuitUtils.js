import { cloneDeep } from 'lodash'
import { Lead, Resistor, VoltageSource, Wire, simulateCircuit } from '../../../../solveCircuit/circuitSim'

export const initBoard = {
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
        value: 10,
        powered: true
      },
      3: {
        type: 'source',
        connections: [1, 3],
        value: 10,
        powered: true
      },
      4: {
        type: 'wire',
        connections: [1, 3],
        powered: true
      }
    }
  },
  source: [0, 3]
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

  // connections:
  // 0: up
  // 1: right
  // 2: down
  // 3: left

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

export function getNodes (row, col, connections) {
  // given row, col, and connections, return an array of nodes the element is
  // connected to

  // for node purposes, board operates on a (m + 3) x (n + 3) grid, where m, n
  // are the numbers of rows and cols. Every element is centered on a 3x3 grid,
  // with center space occupied by the element itself, and the outer sides
  // reserved for possible nodes connecting elements to each other

  // connections:
  // 0: up
  // 1: right
  // 2: down
  // 3: left

  const [gridRow, gridCol] = [(row * 2) + 1, (col * 2) + 1]
  const nodes = []

  connections.forEach(connection => {
    let node
    switch (connection) {
    case 0:
      node = [gridRow - 1, gridCol]
      break
    case 1:
      node = [gridRow, gridCol + 1]
      break
    case 2:
      node = [gridRow + 1, gridCol]
      break
    case 3:
      node = [gridRow, gridCol - 1]
      break
    }

    nodes.push(node)
  })

  return nodes
}

export function boardToComponents (board) {
  // takes a board and returns an array of components (Leads, Resistors, Wires,
  // and a VoltageSource) for simulateCircuit to use

  const components = []

  for (let row = 0; row < Object.keys(board.elements).length; row++) {
    for (let col = 0; col < Object.keys(board.elements[0]).length; col++) {
      const element = board.elements[row][col]
      const nodes = getNodes(row, col, element.connections)
      switch (element.type) {
      case 'resistor':
        components.push(new Resistor(element.value, nodes))
        break
      case 'source':
        components.push(new VoltageSource(element.value, nodes))
        break
      case 'wire':
        nodes.forEach(node => {
          components.push(new Wire([node, [(row * 2) + 1, (col * 2) + 1]]))
        })
        break
      }
    }
  }
  return components
}

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

export function measureGaugeVoltage (board, gaugePosition) {
  // given the board and the position of the gauge to measure voltage at as
  // [row, col], return a string representing the measurement of the gauge in Volts

  const components = boardToComponents(board)
  const [gaugeRow, gaugeCol] = gaugePosition
  const gaugeNodes = getNodes(gaugeRow, gaugeCol, board.elements[gaugeRow][gaugeCol].connections)
  components.unshift(new Lead(gaugeNodes[0], true))
  components.unshift(new Lead(gaugeNodes[1], false))

  return simulateCircuit(components)
}
