import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ElementChooser from '../ElementChooser/ElementChooser'
import PassLock from '../../PassLock/PassLock'
import { initBoard, updatePowered } from './utils'

const Circuit = () => {
  const [board, setBoard] = useState(initBoard)
  const [locked, setLocked] = useState(true)

  let circuitJSX
  if (locked) {
    circuitJSX = <PassLock setLocked={setLocked} password='a' />
  } else {
    circuitJSX = <Container className='circuit-container'>
      <Row>
        <Col><ElementChooser position='0-0' board={board} setBoard={setBoard} updatePowered={updatePowered}></ElementChooser></Col>
        <Col><ElementChooser position='0-1' board={board} setBoard={setBoard} updatePowered={updatePowered}></ElementChooser></Col>
        <Col><ElementChooser position='0-2' board={board} setBoard={setBoard} updatePowered={updatePowered}></ElementChooser></Col>
        <Col><ElementChooser position='0-3' board={board} setBoard={setBoard} updatePowered={updatePowered}></ElementChooser></Col>
        <Col><ElementChooser position='0-4' board={board} setBoard={setBoard} updatePowered={updatePowered}></ElementChooser></Col>
      </Row>
    </Container>
  }

  return circuitJSX
}

export default Circuit
