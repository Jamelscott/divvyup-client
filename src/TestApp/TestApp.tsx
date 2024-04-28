import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestAddExpenseForm from './TestExpenseForm';
import TestFriends from './TestFriends';
import { UserContext, UserContextType } from '../context/userContext';
import TestExpenses from './TestExpenses';

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
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                    <TestAddExpenseForm />
                    <div style={{ height: '200px' }}></div>
                    <TestFriends />
                </div>
                <div>
                    <h1>All Expenses: </h1>
                    <TestExpenses />
                </div>
            </div>
        </>
    );
}

export default TestApp;