import { useForm } from 'react-hook-form';
import { acceptFriendRequest, getFriendRequests, getFriends, handleRequestFriend, rejectFriendRequest } from '../utils/friendHelpers';
import { FriendRequest } from '../utils/types';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '../context/userContext';

function TestFriends() {
    const { user } = useContext(UserContext) as UserContextType;
    const { register, handleSubmit } = useForm();
    const [requests, setRequests] = useState<FriendRequest[]>([]);

    useEffect(() => {
        async function getRequests() {
            const requests = await getFriendRequests(user);
            setRequests(requests);
        }
        getRequests();
    }, [user]);


    return (
        <>
            <form onSubmit={handleSubmit((data) => handleRequestFriend(data.emailOrUsername, user))}>
                <input defaultValue="jameloscott" {...register('emailOrUsername')} />
                <input type="submit" value="add Friend" />
            </form>
            <p><b>Friend Requests</b></p>
            <ol>
                {requests.length > 0 ? requests.map((request) => {
                    return (
                        <div key={request.id}>
                            <li>{request.requester_uuid === user.id ? request.requestee_username : request.requester_username}</li>
                            <input type="button" disabled={request.requester_uuid === user.id} value="accept" onClick={() => acceptFriendRequest(request.id)} />
                            <input type="button" value={request.requester_uuid === user.id ? 'remove friend requeset' : 'reject'} onClick={() => rejectFriendRequest(request.id)} />
                        </div>
                    );
                }) : <p>you have no pending friends</p>}
            </ol>
            <input type="button" value="log all friends" onClick={() => getFriends(user.id)} />
        </>
    );
}

export default TestFriends;