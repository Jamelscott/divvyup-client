import { useEffect, useState } from 'react';
import Login from './Login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp/SignUp.tsx';
import Navbar from './Navbar/Navbar.tsx';
import TestApp from './TestApp/TestApp.tsx';
import { Expense, FriendRequest, User } from './types';
import { handleUserSession } from './utils/loginHelpers.tsx';
import { UserContext } from './context/userContext';
import { getFriendRequests, getFriends } from './utils/friendHelpers.tsx';
import { handleFetchSingleProfileExpenses } from './utils/expenseHelpers.tsx';
import ErrorMsg from './Error/ErrorMsg.tsx';

function App() {
    const [user, setUser] = useState<User>(handleUserSession());
    const [friends, setFriends] = useState<User[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [updateContext, setUpdateContext] = useState<boolean>(false)
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
    const [errorMsg, setErrorMsg] = useState<string[]>([])

    useEffect(() => {
        const fetchFriends = async (userid: any) => {
            const friendz = await getFriends(userid) as User[]
            setFriends(friendz)
            return friends
        }
        const fetchExpenses = async (userid: any) => {
            const expensez = await handleFetchSingleProfileExpenses(userid) as Expense[]
            setExpenses(expensez.reverse())
            return friends
        }
        const fetchFriendRequests = async (user: any) => {
            const requestz = await getFriendRequests(user)
            setFriendRequests(requestz)
            return friends
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
                <Navbar />
                {errorMsg.length > 0 && <ErrorMsg />}
                <Routes>
                    <Route path='/' element={<TestApp />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
