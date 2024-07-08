import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TestExpenses from '../../TestApp/TestExpenses';
import { calcTotalExpenseDiff } from '../../utils/expenseHelpers';
import SideBar from '../Sidebar/Sidebar';
import HomeSidebar from './HomeSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { DataState, selectExpenses, selectUser } from '../../slices/userSlice';
import { getFriends, selectFriends, selectFriendsState } from '../../slices/friendsSlice';
import { AppDispatch } from '../../utils/store';

function Home() {
    const user = useSelector(selectUser)
    const friends = useSelector(selectFriends)
    const friendsDataState = useSelector(selectFriendsState)
    const expenses = useSelector(selectExpenses)
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()
    const expenseDiff = useMemo(() => calcTotalExpenseDiff(expenses, user), [expenses])

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

export default Home;