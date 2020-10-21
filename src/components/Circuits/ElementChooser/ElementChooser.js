import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'

import '../../../index.scss'
import './ElementChooser.scss'
import getTransformClass from './getTransformClass.js'

const ElementChooser = ({ type }) => {
  const [direction, setDirection] = useState(0)
  const [highlighted, setHighlighted] = useState(false)

  const handleDirectionSwitch = (event) => {
    setDirection((direction + 1) % 4)
  }

  const addHighlight = (event) => {
    setHighlighted(true)
  }

  const removeHighlight = (event) => {
    setHighlighted(false)
  }

  const elementJSX = (
    <Container
      className={`${highlighted ? 'circuit-element-highlight' : 'circuit-element'} ${getTransformClass(direction)}`}
      onClick={event => { handleDirectionSwitch(event) }}
      onMouseEnter={event => { addHighlight(event) }}
      onMouseLeave={event => { removeHighlight(event) }}>
      <p>{type} {direction}</p>
    </Container>
  )

  return elementJSX
}

export default ElementChooser
