import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from '../utils/supabase'
import Login from './Login/Login'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './SignUp/SignUp.tsx'
import Navbar from './Navbar/Navbar.tsx'

type User = {
  username: string,
  email: string
}

function App() {

  const [user, setUser] = useState<any>(null)

  return (
    <>
    <BrowserRouter>
        <Navbar user={user} setUser={setUser}/>
      <Routes>
        <Route path='/' element={<Login user={user} setUser={setUser} />} />
        <Route path='/signup' element={<SignUp setUser={setUser}/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
