import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ElementChooser from '../ElementChooser/ElementChooser'
import PassLock from '../../PassLock/PassLock'
import { initBoard } from './utils'

const Circuit = () => {
  const [board, setBoard] = useState(initBoard)
  const [locked, setLocked] = useState(true)

  let circuitJSX
  if (locked) {
    circuitJSX = <PassLock setLocked={setLocked} password='a' />
  } else {
    circuitJSX = <Container className='circuit-container'>
      <Row>
        <Col><ElementChooser position='1-1' board={board} setBoard={setBoard}></ElementChooser></Col>
        <Col><ElementChooser position='1-2' board={board} setBoard={setBoard}></ElementChooser></Col>
        <Col><ElementChooser position='1-3' board={board} setBoard={setBoard}></ElementChooser></Col>
        <Col><ElementChooser position='1-4' board={board} setBoard={setBoard}></ElementChooser></Col>
        <Col><ElementChooser position='1-5' board={board} setBoard={setBoard}></ElementChooser></Col>
      </Row>
    </Container>
  }

  return circuitJSX
}

export default Circuit
