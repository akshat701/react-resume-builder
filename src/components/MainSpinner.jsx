import React from 'react'
import { PuffLoader } from 'react-spinners'

const MainSpinner = () => {
  return (
    <div className='spinner'>
      <PuffLoader color='#498FCD' size={80}/>
    </div>
  )
}

export default MainSpinner
