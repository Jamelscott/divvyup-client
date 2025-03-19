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
import { getFriendRequests, getFriends, selectFriendsState } from './slices/friendsSlice.ts';
import { AppDispatch } from './utils/store.ts';
import './globals.css'
import LoadingHourglass from './components/Loading/LoadingHourglass.tsx';
import '@mantine/core/styles.css';
import { LoadingOverlay, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Landing from './InProgress/Landing.tsx';
import { NavbarMinimal as Navbar } from './InProgress/Navbar/Navbar.tsx';
import { SmallNavbar } from './InProgress/Navbar/SmallNavbar.tsx';
import NotFound from './components/404/NotFound.tsx';

function App() {
    const userDataState = useSelector(selectUserState)
    const friendsDataState = useSelector(selectFriendsState)
    const user = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()
    const [_currentUser, setCurrentUser] = useState<User>(user)
    const isLoading = userDataState === DataState.LOADING || friendsDataState === DataState.LOADING
    const isInitializing = userDataState === DataState.INITIAL || friendsDataState === DataState.INITIAL
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    useEffect(() => {
        if (user.id) {
            setCurrentUser(user)
            dispatch(getFriends(user.id))
            dispatch(getFriendRequests(user))
        }

    }, [userDataState])
    useEffect(() => {
        if (!user.id) {
            dispatch(userSession())
        }
    }, [])

    return (
        <MantineProvider defaultColorScheme="dark" >
            <BrowserRouter> 
                <LoadingOverlay
                    visible={isLoggingIn}
                    overlayProps={{opacity:0, blur: 0 }}
                    loaderProps={{children: <LoadingHourglass/>}}
                />
                {/* {!isLoading && <LoadingHourglass />} */}
                <div className='flex max-[600px]:flex-col'>
                    {user.id && 
                    <>
                    <div className='hidden max-[600px]:flex'>
                        <SmallNavbar />
                    </div>
                    <div className='flex max-[600px]:hidden fixed h-[100%]'>
                        <Navbar />
                    </div>
                    </>
                    }
                    <div className={user.id ? `pl-[80px] w-full max-[600px]:p-0` : 'flex justify-center w-[100%]'}>
                        <Routes>
                            <Route path='/' element={user.id ? <Home /> : <Landing setIsLoggingIn={setIsLoggingIn}/>}/>
                            {/* <Route path='/home' element={<Home />} /> */}
                            <Route path='/login' element={<Login setIsLoggingIn={setIsLoggingIn} />} />
                            <Route path='/analytics' element={<Analytics />} />
                            <Route path='/profile' element={<Profile />} />
                            <Route path='/friends' element={<Friends />} />
                            {/* <Route path='/friends/:id' element={<Friend />} /> */}
                            <Route path='/login' element={<Login setIsLoggingIn={setIsLoggingIn}/>} />
                            <Route path='/signup' element={<SignUp />} />
                            <Route path='*' element={<NotFound />} />
                        </Routes>
                    </div>
                </div>
                <Notifications color="grape" className='absolute bottom-5 right-5' />
            </BrowserRouter>
        </MantineProvider>
    );
}

export default App;
