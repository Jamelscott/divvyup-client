import Login from './components/Login/Login.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp/SignUp.tsx';
import Home from './components/Home/Home.tsx';
import Analytics from './components/Analytics/Analytics.tsx';
import Profile from './components/Profile/Profile.tsx';
import Friends from './components/Friends/Friends.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { DataState, selectUser, selectUserState, userSession } from './slices/userSlice.ts';
import { useEffect, useState } from 'react';
import { User } from './types';
import { getFriends, selectFriendsState } from './slices/friendsSlice.ts';
import { AppDispatch } from './utils/store.ts';
import { FloatingNav } from './components/Navbar/FloatingNav.tsx';
import './globals.css'
import DotPattern from './components/magicui/dot-pattern.tsx';
import LoadingHourglass from './components/Loading/LoadingHourglass.tsx';
// import Friend from './components/Friends/components/Friend.tsx';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

function App() {
    const userDataState = useSelector(selectUserState)
    const friendsDataState = useSelector(selectFriendsState)
    const user = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()
    const [_currentUser, setCurrentUser] = useState<User>(user)
    const isLoading = userDataState === DataState.LOADING || friendsDataState === DataState.LOADING

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
        <MantineProvider>
            <BrowserRouter>
                <DotPattern />
                {!!user?.username && <FloatingNav />}                {/* {errorMsg?.length > 0 && <ErrorMsg />} */}
                <Routes>
                    <Route path='/' element={user.id ? <Home /> : <Login />} />
                    <Route path='/analytics' element={<Analytics />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/friends' element={<Friends />} />
                    {/* <Route path='/friends/:id' element={<Friend />} /> */}
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                </Routes>
                {isLoading && <LoadingHourglass />}
                <Notifications color="grape" className='w-fit absolute bottom-10 right-5' />
            </BrowserRouter>
        </MantineProvider>
    );
}

export default App;
