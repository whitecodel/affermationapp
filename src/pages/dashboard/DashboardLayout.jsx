import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Outlet } from 'react-router-dom'
import "./DashboardLayout.scss"
import DashboardPage from './DashboardPage'
import Profile from '../Profile'

const DashboardLayout = ({children}) => {

    


  return (
    <div className='main-layout'>
        
        <Sidebar />
        <div>
        <Topbar />
        {children}
        {/* <DashboardPage />    */}
        
        </div>
    </div>
  )
}

export default DashboardLayout