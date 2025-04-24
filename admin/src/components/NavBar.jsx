import React from 'react'
import {assets}from '../assets/assets'

const NavBar = () => {
  return (
    <div>
        <img src={assets.logo} alt=''/>
        <button>Logout</button>
    </div>
  )
}

export default NavBar