import { useContext } from "react";
import { UserContext, UserContextType } from "../../../context/userContext";
import { handleRequestFriend } from "../../../utils/friendHelpers";
import { useForm } from "react-hook-form";
import { User } from "../../../types";

function FriendRequestForm() {
        const { user, setUpdateContext, friendRequests, setFriendRequests, errorMsgs, setErrorMsgs } = useContext(UserContext) as UserContextType;
        const { register, handleSubmit } = useForm();

        const submitFriendRequest = async (data: string, user: User) => {
                let tryRequest;
                try {
                        tryRequest = await handleRequestFriend(data, user)
                } catch (err: any) {
                        if (errorMsgs.includes(err.message)) return
                        return setErrorMsgs([...errorMsgs, 'user not found, try a different email or username'])
                } finally {
                        if (tryRequest.error) return setErrorMsgs([...errorMsgs, tryRequest.error])
                }
                setFriendRequests([...friendRequests, tryRequest])
                setUpdateContext(true)
        }

        return (
                <form onSubmit={handleSubmit((data) => submitFriendRequest(data.emailOrUsername, user))}>
                        <input placeholder="email or username" type="text" required {...register('emailOrUsername')} />
                        <input type="submit" value="add Friend" />
                </form>
        );
}

export default FriendRequestForm;