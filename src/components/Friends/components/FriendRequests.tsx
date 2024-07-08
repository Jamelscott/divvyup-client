import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import { approveFriendRequest, rejectFriendRequest, selectFriendRequests } from "../../../slices/friendsSlice";
import { AppDispatch } from "../../../utils/store";

function FriendRequests() {
        const user = useSelector(selectUser)
        const friendRequests = useSelector(selectFriendRequests)
        const dispatch = useDispatch<AppDispatch>()
        const handleRejectRequest = (requestId: string) => {
                dispatch(rejectFriendRequest(requestId))
        }
        const handleAcceptRequest = (id: string) => {
                dispatch(approveFriendRequest(id))
        }
        return <div className='friend-request-container'>
                <p><b>Friend Requests</b></p>
                {friendRequests?.map((request) => (
                        <div key={request.id}>
                                <p>{request.requester_uuid === user.id ? request.requestee_username : request.requester_username}</p>
                                <input type="button" disabled={request.requester_uuid === user.id} value="accept" onClick={() => handleAcceptRequest(request.id)} />
                                <input type="button" value={request.requester_uuid === user.id ? 'remove friend request' : 'reject'} onClick={() => handleRejectRequest(request.id)} />
                        </div>)) || <p>you have no pending friends</p>}
        </div>;
}

export default FriendRequests;
