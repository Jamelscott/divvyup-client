import { useForm } from "react-hook-form";
import { User } from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import { postFriendRequest } from "../../../slices/friendsSlice";
import { AppDispatch } from "../../../utils/store";

function FriendRequestForm() {
        const user = useSelector(selectUser)
        const dispatch = useDispatch<AppDispatch>()
        const { register, handleSubmit } = useForm();

        const submitFriendRequest = async (usernameOrEMail: string, user: User) => {
                dispatch(postFriendRequest({ user: user, usernameOrEMail: usernameOrEMail }))
        }

        return (
                <form onSubmit={handleSubmit((data) => submitFriendRequest(data.emailOrUsername, user))}>
                        <input placeholder="email or username" type="text" required {...register('emailOrUsername')} />
                        <input type="submit" value="add Friend" />
                </form>
        );
}

export default FriendRequestForm;