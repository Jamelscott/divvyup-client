import { useEffect, useState } from 'react';
import Login from './Login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp/SignUp.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import TestApp from './TestApp/TestApp.tsx';
import { ExpenseData, FriendRequest, User } from './types';
import { handleUserSession } from './utils/loginHelpers.tsx';
import { UserContext } from './context/userContext';
import { getFriendRequests, getFriends } from './utils/friendHelpers.tsx';
import { handleFetchSingleProfileExpenses } from './utils/expenseHelpers.tsx';
import ErrorMsg from './Error/ErrorMsg.tsx';
import Analytics from './components/Analytics/Analytics.tsx';
import Profile from './components/Profile/Profile.tsx';
import Friends from './components/Friends/Friends.tsx';

function App() {
    const [user, setUser] = useState<User>(handleUserSession());
    const [friends, setFriends] = useState<User[]>([])
    const [expenses, setExpenses] = useState<ExpenseData[]>([])
    const [updateContext, setUpdateContext] = useState<boolean>(true)
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
    const [errorMsg, setErrorMsg] = useState<string[]>([])

    useEffect(() => {
        console.log('fetching')
        if (!updateContext) return
        const fetchFriends = async (userid: string) => {
            const fetchedFriends = await getFriends(userid) as User[]
            setFriends(fetchedFriends)
            return fetchedFriends
        }
        const fetchExpenses = async (userid: string) => {
            const fetchedExpenses = await handleFetchSingleProfileExpenses(userid) as ExpenseData[]
            setExpenses(fetchedExpenses.reverse())
            return fetchedExpenses.reverse()
        }
        const fetchFriendRequests = async (user: User) => {
            const fetchedFriendRequests = await getFriendRequests(user)
            setFriendRequests(fetchedFriendRequests)
            return fetchedFriendRequests
        }
        fetchFriends(user.id)
        fetchFriendRequests(user)
        fetchExpenses(user.id)
        setUpdateContext(false)
    }, [updateContext])

    const userData = {
        user: user,
        setUser: setUser,
        friends: friends,
        expenses: expenses,
        updateContext: updateContext,
        setUpdateContext: setUpdateContext,
        friendRequests: friendRequests,
        setFriendRequests: setFriendRequests,
        errorMsgs: errorMsg,
        setErrorMsgs: setErrorMsg,
    }
    return (
        <UserContext.Provider value={userData}>
            <BrowserRouter>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {user?.username && <Navbar />}
                    {errorMsg?.length > 0 && <ErrorMsg />}
                    <Routes>
                        <Route path='/' element={user ? <TestApp /> : <Login />} />
                        <Route path='/analytics' element={<Analytics />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/friends' element={<Friends />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<SignUp />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
