import { useState } from 'react';
import TestModal from './ExpenseModal/ExpenseModal';
import FriendRequestForm from '../Friends/components/FriendRequestForm';
import FriendRequests from '../Friends/components/FriendRequests';
import { useSelector } from 'react-redux';
import { selectFriends, selectFriendsState } from '../../slices/friendsSlice';
import { User } from '../../types';

function AddExpenseButton() {
    const friends = useSelector(selectFriends)
    const friendsDataState = useSelector(selectFriendsState)
    const [openModal, setOpenModal] = useState(false);
    const [currentFriends, setCurrentFriends] = useState<User[]>(friends)

    return (
        <>
            <h1>Add Expense: </h1>
            <button onClick={() => openModal ? setOpenModal(false) : setOpenModal(true)} >Add Expense</button>
            <hr></hr>
            {openModal && <TestModal setOpenModal={setOpenModal} />}
        </>
    );
}

export default AddExpenseButton;