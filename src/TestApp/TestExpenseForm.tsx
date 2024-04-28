import { useContext, useEffect, useState } from 'react';
import { getFriends } from '../utils/friendHelpers';
import { UserContext, UserContextType } from '../context/userContext';
import TestModal from './TestModal';

function TestAddExpenseForm() {
    const { user } = useContext(UserContext) as UserContextType;
    const [_friends, setFriends] = useState<any>();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        async function fetchFriends() {
            const fetchedFriends = await getFriends(user.id);
            setFriends(fetchedFriends);
        }
        fetchFriends();
    }, [user]);

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