import { useContext } from "react";
import { UserContext, UserContextType } from "../../../context/userContext";
import { handleRequestFriend } from "../../../utils/friendHelpers";
import { useForm } from "react-hook-form";
import { User } from "../../../types";

function FriendRequestForm() {
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

        return (
                <form onSubmit={handleSubmit((data) => submitFriendRequest(data.emailOrUsername, user))}>
                        <input required {...register('emailOrUsername')} />
                        <input type="submit" value="add Friend" />
                </form>
        );
}

export default FriendRequestForm;