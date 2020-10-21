function getTransformClass (direction) {
  const stateHash = {
    0: 'circuit-element-0',
    1: 'circuit-element-1',
    2: 'circuit-element-2',
    3: 'circuit-element-3'
  }

  return stateHash[direction]
}

export default getTransformClass
