import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'

import '../../../index.scss'
import './ElementChooser.scss'
import getTransformClass from './getTransformClass.js'

const ElementChooser = ({ type }) => {
  const [direction, setDirection] = useState(0)

  const handleDirectionSwitch = (event) => {
    setDirection((direction + 1) % 4)
  }

  const elementJSX = (
    <Container className={`circuit-element ${getTransformClass(direction)}`} onClick={event => { handleDirectionSwitch(event) }}>
      <p>{type} {direction}</p>
    </Container>
  )

  return elementJSX
}

export default ElementChooser
