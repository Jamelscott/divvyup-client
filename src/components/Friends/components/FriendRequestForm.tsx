import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import { postFriendRequest } from "../../../slices/friendsSlice";
import { AppDispatch } from "../../../utils/store";
import { Button, TextInput } from "@mantine/core";
import { useRef, useState } from "react";

function FriendRequestForm({ modalFunc, modalOpen }: any) {
        const user = useSelector(selectUser)
        const dispatch = useDispatch<AppDispatch>()
        const { register, handleSubmit } = useForm({
                mode: 'onSubmit',
        });
        const [loading, setLoading] = useState(false)
        const inputRef = useRef<HTMLInputElement>(null);

        const submitFriendRequest = async () => {
                setLoading(true)
                if (inputRef.current?.value) {
                        await dispatch(postFriendRequest({ user: user, usernameOrEMail: inputRef.current.value }))
                        inputRef.current.value = ''
                }
                setLoading(false)
                modalFunc(!modalOpen)
        }

        return (
                <form onSubmit={handleSubmit(() => submitFriendRequest())}>
                        <div className="flex justify-center gap-10 ">
                                <TextInput
                                        withAsterisk
                                        placeholder="email or username"
                                        {...register('name')}
                                        ref={inputRef}
                                />
                                <Button
                                        type="submit"
                                        style={{ border: '1px solid grey' }}
                                        color="cyan"
                                        size="sm"
                                        value="Add"
                                        disabled={loading}
                                >
                                        Add
                                </Button>
                        </div>
                </form >
        );
}

export default FriendRequestForm;