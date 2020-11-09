export function getTransformClass (direction) {
  const stateHash = {
    0: 'circuit-element--rotation-0',
    1: 'circuit-element--rotation-1',
    2: 'circuit-element--rotation-2',
    3: 'circuit-element--rotation-3'
  }

  return stateHash[direction]
}

// todo: check powered based on connections to other powered elements
export function checkPowered (type, position, connections) {
  if (type === 'source') {
    return true
  } else {
    return true
  }
}
