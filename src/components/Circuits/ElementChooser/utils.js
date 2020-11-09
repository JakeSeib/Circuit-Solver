import { cloneDeep } from 'lodash'

export function getTransformClass (direction) {
  const stateHash = {
    0: 'circuit-element--rotation-0',
    1: 'circuit-element--rotation-1',
    2: 'circuit-element--rotation-2',
    3: 'circuit-element--rotation-3'
  }

  return stateHash[direction]
}

function setAllUnpowered (board) {
  for (let i = 1; i < (Object.keys(board).length + 1); i++) {
    const row = board[i]
    for (let y = 1; y < (Object.keys(row).length + 1); y++) {
      row[y].powered = false
    }
  }
  return board
}

// todo: handle board edges
export function updatePowered (oldBoard, newBoard = setAllUnpowered(cloneDeep(oldBoard)), currPos = [1, 4], checked = {}) {
  // starting with source, check connections recursively and return a copy of
  // oldBoard with updated power distribution
  // currently, source element's position is hardcoded as default currPos argument
  const row = currPos[0]
  const col = currPos[1]
  const element = newBoard[row][col]

  newBoard[row][col].powered = true
  if (!checked[row]) {
    checked[row] = { [col]: true }
  } else {
    checked[row][col] = true
  }

  // iterate over connections
  for (let i = 0; i < element.connections.length; i++) {
    // find the element the connection points to
    // check if that element is also pointing to current element
    // if so, recur on that element
  }
  return newBoard
}
