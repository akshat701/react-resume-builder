import React from 'react'
import { Logo } from '../assets'
import './App'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    
    <div className='footer'>
      
      <div className='imge'>
      <img src={Logo} className="w-8 h-auto object-contain" alt="" />
      <p className='ex'>Expressume</p>
      </div>
      <div className='footerextra'>
        <Link to={"/"} id='home1'>Home</Link>
        <Link to={"/"} id='home2'>Contact</Link>
        <Link to={"/" } id='home3'>Privacy Policy</Link>
      </div>
    </div>
    
  )
}

export default Footer
