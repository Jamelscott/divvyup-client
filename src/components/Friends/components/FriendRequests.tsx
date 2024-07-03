import { useContext, useState } from "react";
import { acceptFriendRequest, rejectFriendRequest } from "../../../utils/friendHelpers";
import { UserContext, UserContextType } from "../../../context/userContext";

function FriendRequests() {
        const { user, setUpdateContext, friendRequests } = useContext(UserContext) as UserContextType;
        const [friendRequestz, setFriendRequestz] = useState(friendRequests)

        const handleRejectRequest = (requestId: string) => {
                rejectFriendRequest(requestId)
                setUpdateContext(true)
        }
        const handleAcceptRequest = (id: string) => {
                acceptFriendRequest(id)
                setUpdateContext(true)
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
