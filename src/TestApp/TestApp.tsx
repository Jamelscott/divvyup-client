import { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TestAddExpenseForm from './TestExpenseForm';
import TestFriends from './TestFriends';
import { UserContext, UserContextType } from '../context/userContext';
import TestExpenses from './TestExpenses';
import { calcTotalExpenseDiff } from '../utils/expenseHelpers';

function TestApp() {
    const { user, expenses } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const expenseDiff = useMemo(() => calcTotalExpenseDiff(expenses, user), [expenses])
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
        }
    }, [navigate, user.id]);

    const getTotalNum = (num: number) => {
        return Number(Math.round(parseFloat(Math.abs(num) + 'e' + 2)) + 'e-' + 2).toFixed(2);
    }
    const checkOwing = () => {
        if (expenseDiff > 0) {
            return <h3 style={{ color: 'green' }}>You are owed ${expenseDiff}</h3>
        } else if (expenseDiff < 0) {
            return <h3 style={{ color: 'red' }}>You owe ${getTotalNum(expenseDiff)}</h3>
        } else if (expenseDiff === 0 && expenses.length > 1) {
            return <h3 style={{ color: 'black' }}>You are all squared up.</h3>
        } else {
            return <h3 style={{ color: 'black' }}>You are owed the same amount that you owe your friends.</h3>
        }
    }
    return (
        <>
            <p>Welcome <b>{user.username}</b> to the test app</p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                    <TestAddExpenseForm />
                </div>
                <div>
                    <h1>All Expenses: </h1>
                    {checkOwing()}
                    <TestExpenses />
                </div>
            </div>
        </>
    );
}

export default TestApp;