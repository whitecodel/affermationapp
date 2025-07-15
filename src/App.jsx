import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import DashboardPage from './pages/dashboard/DashboardPage'
import MainRoute from './router'
import 'antd/dist/reset.css';
import "./global.scss"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
     <ToastContainer />
    <MainRoute />
     </BrowserRouter>
    </>
  )
}

export default App
