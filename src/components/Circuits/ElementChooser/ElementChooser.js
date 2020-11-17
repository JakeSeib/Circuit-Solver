import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import '../../../index.scss'
import './ElementChooser.scss'
import { getTransformClass } from './utils'

const ElementChooser = ({ position, board, setBoard, updatePowered }) => {
  const [direction, setDirection] = useState(0)
  const [highlighted, setHighlighted] = useState(false)

  const [row, col] = position.split('-')

  const handleDirectionSwitch = (event) => {
    setDirection((direction + 1) % 4)
    let updatedBoard = {
      ...board,
      [row]: {
        ...board[row],
        [col]: {
          ...board[row][col],
          connections: board[row][col].connections.map(i => (i + 1) % 4)
        }
      }
    }
    updatedBoard = updatePowered(updatedBoard)
    setBoard(updatedBoard)
  }

  const addHighlight = (event) => {
    setHighlighted(true)
  }

  const removeHighlight = (event) => {
    setHighlighted(false)
  }

  const elementJSX = (
    <Container
      className={`circuit-element ${board[row][col].type} ${highlighted ? 'circuit-element--highlight' : ''} ${getTransformClass(direction)}`}
      onClick={handleDirectionSwitch}
      onMouseEnter={addHighlight}
      onMouseLeave={removeHighlight}>
      <p>{board[row][col].type} powered:{`${board[row][col].powered}`}</p>
    </Container>
  )

  return elementJSX
}

export default ElementChooser
