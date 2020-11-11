import React, { useState, Fragment } from 'react'
import { Redirect } from 'react-router-dom'

const Home = () => {
  const [redirectRoute, setRedirectRoute] = useState(null)

  function handleHomeClick (event) {
    setRedirectRoute(event.target.getAttribute('data-route'))
  }

  let appJSX
  if (redirectRoute) {
    appJSX = <Redirect to={`/${redirectRoute}`} />
  } else {
    appJSX = <Fragment>
      <div className='landing-link' data-route='species' onClick={handleHomeClick}>
        Species Assessment
      </div>
      <div className='landing-link' data-route='circuits' onClick={handleHomeClick}>
        AI Power Controls (ERIC: DO NOT TOUCH!!!)
      </div>
      <div className='landing-link' data-route='ship-logs' onClick={handleHomeClick}>
        Ship Logs
      </div>
      <div className='landing-link' data-route='video-logs' onClick={handleHomeClick}>
        Video Logs
      </div>
      <div className='landing-link' data-route='diary' onClick={handleHomeClick}>
        Diary
      </div>
    </Fragment>
  }

  return appJSX
}

export default Home
