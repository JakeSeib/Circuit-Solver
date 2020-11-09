import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ElementChooser from '../ElementChooser/ElementChooser'
import { initBoard } from './utils'

const Circuit = () => {
  const [board, setBoard] = useState(initBoard)

  return <Container className='circuit-container'>
    <Row>
      <Col><ElementChooser position='1-1' board={board} setBoard={setBoard}></ElementChooser></Col>
      <Col><ElementChooser position='1-2' board={board} setBoard={setBoard}></ElementChooser></Col>
      <Col><ElementChooser position='1-3' board={board} setBoard={setBoard}></ElementChooser></Col>
      <Col><ElementChooser position='1-4' board={board} setBoard={setBoard}></ElementChooser></Col>
      <Col><ElementChooser position='1-5' board={board} setBoard={setBoard}></ElementChooser></Col>
    </Row>
  </Container>
}

export default Circuit
