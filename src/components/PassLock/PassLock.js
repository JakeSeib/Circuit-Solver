import React, { Fragment, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './PassLock.scss'

const PassLock = ({ setLocked, password }) => {
  const [passwordEntry, setPasswordEntry] = useState('')
  const [passwordCorrect, setPasswordCorrect] = useState(null)
  const [timer, setTimer] = useState(null)
  const handleChange = event => {
    setPasswordEntry(event.target.value)
  }

  const handleFormSubmit = event => {
    event.preventDefault()
    if (passwordEntry === password) {
      setPasswordCorrect(true)
      if (timer) { clearTimeout(timer) }
      setTimeout(function () {
        setLocked(false)
      }, 5000)
    } else {
      setPasswordCorrect(false)
      setPasswordEntry('')
      if (timer) { clearTimeout(timer) }
      setTimer(setTimeout(function () {
        if (!passwordCorrect) {
          setPasswordCorrect(null)
        }
      }, 2000))
    }
  }

  let passLockJSX
  if (passwordCorrect) {
    passLockJSX = <p className='password-msg password-accept-msg'>Password Accepted. Welcome, Glorbo.</p>
  } else {
    passLockJSX = <Fragment>
      <Form className='password-form' onSubmit={handleFormSubmit}>
        <Form.Group controlId='password'>
          <Form.Label>Enter Password</Form.Label>
          <Form.Control
            className='password-field'
            required
            type='password'
            name='password'
            value={passwordEntry}
            onChange={handleChange}
            maxLength='10'
          />
        </Form.Group>
        <Button className='button-password' variant='success' size='lg' type='submit'>Unlock</Button>
      </Form>
      <p className='password-msg'>{passwordCorrect === false ? 'Incorrect Password' : ''}</p>
    </Fragment>
  }
  return passLockJSX
}

export default PassLock
