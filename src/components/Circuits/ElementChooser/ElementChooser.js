import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import '../../../index.scss'
import './ElementChooser.scss'
import { getTransformClass } from './utils'

const ElementChooser = ({ position, board, setBoard, updateBoard }) => {
  const [direction, setDirection] = useState(0)
  const [highlighted, setHighlighted] = useState(false)

  const [row, col] = position.split('-')

  const handleDirectionSwitch = (event) => {
    setBoard(updateBoard(board, [row, col]))
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
      className={`circuit-element ${board.elements[row][col].type} ${highlighted ? 'circuit-element--highlight' : ''} ${getTransformClass(direction)}`}
      onClick={handleDirectionSwitch}
      onMouseEnter={addHighlight}
      onMouseLeave={removeHighlight}>
      <p>{board.elements[row][col].type} powered:{`${board.elements[row][col].powered}`} connections:{`${board.elements[row][col].connections}`}</p>
    </Container>
  )

  return elementJSX
}

export default ElementChooser
