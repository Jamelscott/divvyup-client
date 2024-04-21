import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestAddExpenseForm from './TestExpenseForm';
import TestUserExpenses from './TestUserExpenses';
import TestFriends from './TestFriends';
import { UserContext, UserContextType } from '../context/userContext';

function TestApp() {
    const { user } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.id) {
            navigate('/login');
        }
    }, [navigate, user.id]);
    return (
        <>
            <p>Welcome <b>{user.username}</b> to the test app</p>
            <TestAddExpenseForm />
            <TestUserExpenses />
            <TestFriends />
        </>
    );
}

export default TestApp;