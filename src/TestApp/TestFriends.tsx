import { useForm } from "react-hook-form";
import { acceptFriendRequest, getFriendRequests, handleRequestFriend, rejectFriendRequest } from "../utils/friendHelpers";
import { User } from "../utils/types";
import { useEffect, useState } from "react";

function TestFriends({user}: {user: User}) {
    const { register, handleSubmit }= useForm()
    const [requests, setRequests] = useState([])

    useEffect(() => {
        async function getToken() {
            const requests: any = await getFriendRequests(user);
            setRequests(requests);
        }
        getToken();
     }, [])
    

    return ( 
        <>
            <form onSubmit={handleSubmit((data) => handleRequestFriend(data.emailOrUsername, user))}>
                <input defaultValue="jameloscott" {...register("emailOrUsername")} />
                <input type="submit" value="add Friend" />
            </form>
            <p><b>Friend Requests</b></p>
            <ol>
            {requests.map((request: any) => {
                return (
                    <div key={request.id}>
                        <li>{request.requestee_username}</li>
                        <input type="button" value="accept" onClick={() => acceptFriendRequest(request.id)} />
                        <input type="button" value="reject" onClick={() => rejectFriendRequest(request.id)}/>
                    </div>
                )
            })}
            </ol>
        </>
     );
}

export default TestFriends;