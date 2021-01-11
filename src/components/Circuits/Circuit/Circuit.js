import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ElementChooser from '../ElementChooser/ElementChooser'
import PassLock from '../../PassLock/PassLock'
import { initBoard, updateBoard } from './utils'

const Circuit = () => {
  const [board, setBoard] = useState(initBoard)
  const [locked, setLocked] = useState(true)

  let circuitJSX
  if (locked) {
    circuitJSX = <PassLock setLocked={setLocked} password='a' />
  } else {
    circuitJSX = <Container className='circuit-container'>
      <Row>
        <Col><ElementChooser position='0-0' board={board} setBoard={setBoard} updateBoard={updateBoard}></ElementChooser></Col>
        <Col><ElementChooser position='0-1' board={board} setBoard={setBoard} updateBoard={updateBoard}></ElementChooser></Col>
      </Row>
      <Row>
        <Col><ElementChooser position='1-0' board={board} setBoard={setBoard} updateBoard={updateBoard}></ElementChooser></Col>
        <Col><ElementChooser position='1-1' board={board} setBoard={setBoard} updateBoard={updateBoard}></ElementChooser></Col>
      </Row>
    </Container>
  }

  return circuitJSX
}

export default Circuit
