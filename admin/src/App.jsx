import React from 'react'
import Navbar from './components/NavBar'
import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <div className='bg-gray-50 min-h-screen'>
        <>
          <Navbar/>
          <hr className='border-t border-gray-300'/>
          <div className='flex w-full'>
            <Sidebar/>
          </div>
        </>  
    </div>
  )
}



export default App