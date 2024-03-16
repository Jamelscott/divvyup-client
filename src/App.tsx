import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from '../utils/supabase'
import Login from './Login/Login'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './SignUp/SignUp.tsx'
import Navbar from './Navbar/Navbar.tsx'

function App() {

  const {user, setUser}: any = useState({
    username: '',
    email: ''
  })

  return (
    <>
    <BrowserRouter>
        <Navbar/>
      <Routes>
        <Route path='/' element={<Login user={user} setUser={setUser} />} />
        <Route path='/signup' element={<SignUp setUser={setUser}/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
