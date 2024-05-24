import { useContext } from "react";
import { acceptFriendRequest } from "../../../utils/friendHelpers";
import { UserContext, UserContextType } from "../../../context/userContext";

function FriendRequests() {
        const { user, setUpdateContext, friendRequests } = useContext(UserContext) as UserContextType;

        const rejectRequest = (requestId: string) => {
                rejectRequest(requestId)
                setUpdateContext(true)
        }
        return (
                <div className='friend-request-container'>
                        <p><b>Friend Requests</b></p>
                        {friendRequests?.length > 0 ?
                                <ol>

                                        {friendRequests?.map((request) => {

                                                return (
                                                        <div key={request.id}>
                                                                <li>{request.requester_uuid === user.id ? request.requestee_username : request.requester_username}</li>
                                                                <input type="button" disabled={request.requester_uuid === user.id} value="accept" onClick={() => acceptFriendRequest(request.id)} />
                                                                <input type="button" value={request.requester_uuid === user.id ? 'remove friend requeset' : 'reject'} onClick={() => rejectRequest(request.id)} />
                                                        </div>
                                                );
                                        })}
                                </ol>
                                : <p>you have no pending friends</p>}
                </div>
        );
}

export default FriendRequests;
