import { useState } from 'react'
import Login from './Login/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUp from './SignUp/SignUp.tsx'
import Navbar from './Navbar/Navbar.tsx'
import TestApp from './TestApp/TestApp.tsx'
import { User } from './utils/types'
import { handleUserSession } from './utils/loginHelpers.tsx'

function App() {

  const [user, setUser] = useState<User>(handleUserSession())

  return (
    <>
    <BrowserRouter>
        <Navbar user={user} setUser={setUser}/>
      <Routes>
        <Route path='/' element={<TestApp user={user}/>} />
        <Route path='/login' element={<Login user={user} setUser={setUser} />} />
        <Route path='/signup' element={<SignUp setUser={setUser} user={user}/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
