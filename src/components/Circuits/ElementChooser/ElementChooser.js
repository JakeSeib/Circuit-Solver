import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'

import '../../../index.scss'
import './ElementChooser.scss'

const TypeChooser = () => {
  const [type, setType] = useState(0)
  const [direction, setDirection] = useState('horizontal')
  const typeOptions = ['wire', 'resistor']

  const handleTypeSwitch = (event) => {
    setType(Math.abs(type - 1))
  }
  const handleDirectionSwitch = (event) => {
    setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal')
  }

  const elementJSX = (
    <Container className='circuit-element'>
      <p>{typeOptions[type]} {direction}</p>
      <button onClick={event => { handleTypeSwitch(event) }}>Cycle type</button>
      <button onClick={event => { handleDirectionSwitch(event) }}>Cycle direction</button>
    </Container>
  )

  return elementJSX
}

export default TypeChooser
