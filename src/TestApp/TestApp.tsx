import { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserContextType } from '../context/userContext';
import TestExpenses from './TestExpenses';
import { calcTotalExpenseDiff } from '../utils/expenseHelpers';
import SideBar from '../components/Sidebar/Sidebar';
import HomeSidebar from '../components/Home/HomeSidebar';

function TestApp() {
    const { user, expenses } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const expenseDiff = useMemo(() => calcTotalExpenseDiff(expenses, user), [expenses])
    useEffect(() => {
        if (!user || !user.id) {
            navigate('/login');
        }
    }, [navigate]);

    const getTotalNum = (num: number) => {
        return Number(Math.round(parseFloat(Math.abs(num) + 'e' + 2)) + 'e-' + 2).toFixed(2);
    }
    const checkOwing = () => {
        if (expenseDiff > 0) {
            return <h3 style={{ color: 'green' }}>Overall, you are owed ${expenseDiff.toFixed(2)}</h3>
        } else if (expenseDiff < 0) {
            return <h3 style={{ color: 'red' }}>Overall, you owe ${getTotalNum(expenseDiff)}</h3>
        } else if (expenseDiff === 0 && expenses.length > 1) {
            return <h3 style={{ color: 'black' }}>You are all squared up</h3>
        } else {
            return <h3 style={{ color: 'black' }}>You are owed the same amount that you owe your friends</h3>
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingLeft: '20px' }}>
                <div>
                    {checkOwing()}
                    <TestExpenses />
                </div>
                <SideBar sideBarComponent={<HomeSidebar />} />
            </div>
        </>
    );
}

export default TestApp;