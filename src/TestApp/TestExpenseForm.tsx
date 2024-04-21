import { useContext, useEffect, useState } from 'react';
import { getFriends } from '../utils/friendHelpers';
import { UserContext, UserContextType } from '../context/userContext';
import TestModal from './TestModal';

function TestAddExpenseForm() {
    const { user } = useContext(UserContext) as UserContextType;
    const [friends, setFriends] = useState<any>();
    const [openModal, setOpenModal] = useState<any>(false);

    useEffect(() => {
        async function fetchFriends() {
            const fetchedFriends = await getFriends(user.id);
            setFriends(fetchedFriends);
        }
        fetchFriends();
    }, [user]);

    return (
        <>
            <hr></hr>
            <h1>Friends: </h1>
            {
                friends?.map((friend: any) => {
                    return <button onClick={() => openModal ? setOpenModal(false) : setOpenModal(friend)} key={friend.id}>{friend.username}</button>
                })
            }
            <hr></hr>
            {openModal && <TestModal friend={openModal} />}
        </>
    );
}

export default TestAddExpenseForm;