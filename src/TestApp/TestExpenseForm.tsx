import { useContext, useEffect, useState } from 'react';
import { getFriends } from '../utils/friendHelpers';
import { UserContext, UserContextType } from '../context/userContext';
import TestModal from '../components/Expenses/ExpenseModal/ExpenseModal';
import FriendRequestForm from '../components/Friends/components/FriendRequestForm';
import FriendRequests from '../components/Friends/components/FriendRequests';

function TestAddExpenseForm() {
    const { user, friends } = useContext(UserContext) as UserContextType;
    const [_friends, setFriends] = useState<any>();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        async function fetchFriends() {
            const fetchedFriends = await getFriends(user.id);
            setFriends(fetchedFriends);
        }
        fetchFriends();
    }, [user]);

    if (!friends || friends.length < 1) {
        return (
            <>
                <p>Get some friends loser</p>
                <FriendRequestForm />
                <FriendRequests />
            </>
        )
    }

    return (
        <>
            <h1>Add Expense: </h1>
            <button onClick={() => openModal ? setOpenModal(false) : setOpenModal(true)} >Add Expense</button>
            <hr></hr>
            {openModal && <TestModal setOpenModal={setOpenModal} />}
        </>
    );
}

export default TestAddExpenseForm;