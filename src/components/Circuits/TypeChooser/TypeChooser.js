import React, { useState, Fragment } from 'react'

const TypeChooser = () => {
  const [currComponent, setCurrComponent] = useState(0)
  const componentOptions = ['wire', 'resistor']

  const handleClick = (event) => {
    setCurrComponent(Math.abs(currComponent - 1))
  }

  const componentJSX = (
    <Fragment>
      <p>{componentOptions[currComponent]}</p>
      <button onClick={event => { handleClick(event) }}>Cycle</button>
    </Fragment>
  )

  return componentJSX
}

export default TypeChooser
