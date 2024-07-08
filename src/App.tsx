import Login from './Login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp/SignUp.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Home from './components/Home/Home.tsx';
import Analytics from './components/Analytics/Analytics.tsx';
import Profile from './components/Profile/Profile.tsx';
import Friends from './components/Friends/Friends.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectUserState, userSession } from './slices/userSlice.ts';
import { useEffect, useState } from 'react';
import { User } from './types';
import { getFriends } from './slices/friendsSlice.ts';
import { AppDispatch } from './utils/store.ts';

function App() {
    const userDataState = useSelector(selectUserState)
    const user = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()
    const [_currentUser, setCurrentUser] = useState<User>(user)

    useEffect(() => {
        if (user.id) {
            setCurrentUser(user)
            dispatch(getFriends(user.id))
        }

    }, [userDataState])
    useEffect(() => {
        if (!user.id) {
            dispatch(userSession())
        }
    }, [])


    return (
        <BrowserRouter>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {!!user?.username && <Navbar />}
                {/* {errorMsg?.length > 0 && <ErrorMsg />} */}
                <Routes>
                    <Route path='/' element={user.id ? <Home /> : <Login />} />
                    <Route path='/analytics' element={<Analytics />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/friends' element={<Friends />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
