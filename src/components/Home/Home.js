import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import './Home.scss'

const Home = () => {
  const [redirectRoute, setRedirectRoute] = useState(null)

  function handleHomeClick (event) {
    setRedirectRoute(event.target.getAttribute('data-route'))
  }

  let appJSX
  if (redirectRoute) {
    appJSX = <Redirect to={`/${redirectRoute}`} />
  } else {
    appJSX = <Container className='landing-container'>
      <Row>
        <Button className='landing-button' data-route='species' variant='success' onClick={handleHomeClick}>
          Species Assessment
        </Button>
      </Row>
      <Row>
        <Button className='landing-button' data-route='circuits' variant='success' onClick={handleHomeClick}>
          AI Power Controls ( ERIC: DO NOT TOUCH!!! )
        </Button>
      </Row>
      <Row>
        <Button className='landing-button' data-route='ship-logs' variant='success' onClick={handleHomeClick}>
          Ship Logs
        </Button>
      </Row>
      <Row>
        <Button className='landing-button' data-route='video-logs' variant='success' onClick={handleHomeClick}>
          Video Logs
        </Button>
      </Row>
      <Row>
        <Button className='landing-button' data-route='diary' variant='success' onClick={handleHomeClick}>
          Diary
        </Button>
      </Row>
    </Container>
  }

  return appJSX
}

export default Home
