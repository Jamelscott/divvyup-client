import { useForm } from 'react-hook-form';
import { acceptFriendRequest, handleRequestFriend, rejectFriendRequest } from '../utils/friendHelpers';
import { User } from '../types';
import { useContext } from 'react';
import { UserContext, UserContextType } from '../context/userContext';
import FriendsList from './TestFriendsList';

function TestFriends() {
    const { user, setUpdateContext, friendRequests, setFriendRequests, errorMsgs, setErrorMsgs } = useContext(UserContext) as UserContextType;
    const { register, handleSubmit } = useForm();

    const submitFriendRequest = async (data: string, user: User) => {
        const tryRequest = await handleRequestFriend(data, user)
        if (tryRequest.error) {
            if (errorMsgs.includes(tryRequest.error)) return
            return setErrorMsgs([...errorMsgs, tryRequest.error])
        }
        setFriendRequests([...friendRequests, tryRequest])
        setUpdateContext(true)
    }

    const rejectRequest = (requestId: string) => {
        rejectFriendRequest(requestId)
        setUpdateContext(true)
    }
    return (
        <>
            <form onSubmit={handleSubmit((data) => submitFriendRequest(data.emailOrUsername, user))}>
                <input required {...register('emailOrUsername')} />
                <input type="submit" value="add Friend" />
            </form>
            <p><b>Friend Requests</b></p>
            <ol>
                {friendRequests?.length > 0 ? friendRequests?.map((request) => {
                    return (
                        <div key={request.id}>
                            <li>{request.requester_uuid === user.id ? request.requestee_username : request.requester_username}</li>
                            <input type="button" disabled={request.requester_uuid === user.id} value="accept" onClick={() => acceptFriendRequest(request.id)} />
                            <input type="button" value={request.requester_uuid === user.id ? 'remove friend requeset' : 'reject'} onClick={() => rejectRequest(request.id)} />
                        </div>
                    );
                }) : <p>you have no pending friends</p>}
            </ol>
            <FriendsList />
        </>
    );
}

export default TestFriends;