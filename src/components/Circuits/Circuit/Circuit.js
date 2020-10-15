import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ElementChooser from '../ElementChooser/ElementChooser'

const Circuit = () => {
  return <Container className='circuit-container'>
    <Row>
      <Col><ElementChooser type='wire'></ElementChooser></Col>
      <Col><ElementChooser type='wire'></ElementChooser></Col>
      <Col><ElementChooser type='resistor'></ElementChooser></Col>
      <Col><ElementChooser type='wire'></ElementChooser></Col>
      <Col><ElementChooser type='wire'></ElementChooser></Col>
    </Row>
  </Container>
}

export default Circuit
