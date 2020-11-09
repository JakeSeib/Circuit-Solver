import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import '../../../index.scss'
import './ElementChooser.scss'
import { getTransformClass, updatePowered } from './utils'

const ElementChooser = ({ position, board, setBoard }) => {
  const [direction, setDirection] = useState(0)
  const [highlighted, setHighlighted] = useState(false)

  const row = position.split('-')[0]
  const col = position.split('-')[1]

  const handleDirectionSwitch = (event) => {
    setDirection((direction + 1) % 4)
    setBoard({
      ...board,
      [row]: {
        ...board[row],
        [col]: {
          ...board[row][col],
          connections: board[row][col].connections.map(i => (i + 1) % 4)
        }
      }
    })
    // todo: only update state once at the end
    updatePowered(board)
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
      <p>{board[row][col].type} connections:{board[row][col].connections.join(',')}</p>
    </Container>
  )

  return elementJSX
}

export default ElementChooser
