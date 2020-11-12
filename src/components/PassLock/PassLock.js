import React, { Fragment, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const PassLock = ({ setLocked, password }) => {
  const [passwordEntry, setPasswordEntry] = useState('')
  const [passwordCorrect, setPasswordCorrect] = useState(null)
  const handleChange = event => {
    setPasswordEntry(event.target.value)
  }

  const handleFormSubmit = event => {
    event.preventDefault()
    if (passwordEntry === password) {
      setPasswordCorrect(true)
      setTimeout(function () {
        setLocked(false)
      }, 5000)
    } else {
      setPasswordCorrect(false)
      setPasswordEntry('')
      setTimeout(function () {
        setPasswordCorrect(null)
      }, 2000)
    }
  }

  let passLockJSX
  if (passwordCorrect) {
    passLockJSX = <p>Password Accepted. Welcome, Glorbo.</p>
  } else {
    passLockJSX = <Fragment>
      <Form className='password-form' onSubmit={handleFormSubmit}>
        <Form.Group controlId="password">
          <Form.Label>Enter Password</Form.Label>
          <Form.Control
            required
            type="password"
            name="password"
            value={passwordEntry}
            onChange={handleChange}
            maxLength="10"
          />
        </Form.Group>
        <Button variant="success" type="submit">Unlock</Button>
      </Form>
      <p>{passwordCorrect === false ? 'Incorrect Password' : ''}</p>
    </Fragment>
  }
  return passLockJSX
}

export default PassLock
