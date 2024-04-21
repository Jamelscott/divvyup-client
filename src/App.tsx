import { useEffect, useState } from 'react';
import Login from './Login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp/SignUp.tsx';
import Navbar from './Navbar/Navbar.tsx';
import TestApp from './TestApp/TestApp.tsx';
import { Expense, User } from './utils/types';
import { handleUserSession } from './utils/loginHelpers.tsx';
import { UserContext } from './context/userContext';
import { getFriends } from './utils/friendHelpers.tsx';
import { handleFetchSingleProfileExpenses } from './utils/expenseHelpers.tsx';


function App() {
    const [user, setUser] = useState<User>(handleUserSession());
    const [friends, setFriends] = useState<User[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])

    useEffect(() => {
        const fetchFriends = async (userid: any) => {
            const friendz = await getFriends(userid) as User[]
            setFriends(friendz)
            return friends
        }
        const fetchExpenses = async (userid: any) => {
            const expensez = await handleFetchSingleProfileExpenses(userid) as Expense[]
            setExpenses(expensez)
            return friends
        }
        fetchFriends(user.id)
        fetchExpenses(user.id)
    }, [])

    const userData = {
        user: user,
        setUser: setUser,
        friends: friends,
        expenses: expenses
    }

    console.log(userData)
    return (
        <UserContext.Provider value={userData}>
            <BrowserRouter>
                <Navbar />
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
