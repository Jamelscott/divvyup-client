import { selectUser } from "../../../slices/userSlice";
import { DataState, getFriendRequests, getFriends, selectFriends, selectFriendsState } from "../../../slices/friendsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../../utils/store";
import Friend from "./Friend";
import { User } from "@/types";
import { Modal } from "@mantine/core";
import ExpenseModal from "@/components/Expenses/ExpenseModal/ExpenseModal";
import { useDisclosure } from "@mantine/hooks";
import { FriendSourceType } from "@/components/Home/Home";

function FriendsList({ sourceType }: { sourceType: FriendSourceType }) {
        const friendsDataState = useSelector(selectFriendsState)
        const friends = useSelector(selectFriends)
        const user = useSelector(selectUser)
        const dispatch = useDispatch<AppDispatch>()
        const [opened, { open, close }] = useDisclosure(false);
        const [modalFriend, setModalFriend] = useState<User>()

        useEffect(() => {
                if (user.id && friendsDataState === DataState.INITIAL) {
                        dispatch(getFriends(user.id))
                        dispatch(getFriendRequests(user))
                }
        }, [user])

        const handleOpenExpenseModal = (friend: User) => {
                setModalFriend(friend)
                open()
                return
        }

        return <>
                <>
                        <div className="flex flex-col items-center gap-5 bg-white rounded-3xl border-black border p-2.5 shadow-lg w-full overflow-y-scroll" style={{ height: '100%' }}>
                                <h2><b>Friends</b></h2>
                                <div className="h-full overflow-y-scroll w-full p-5" style={{ height: 'fit-content' }}>
                                        {user.expenses && friends?.map((friend) => <Friend key={friend.id} handleOpenExpenseModal={handleOpenExpenseModal} friend={friend} sourceType={sourceType} />)}
                                </div>
                        </div >
                        <Modal opened={opened} onClose={close} size='xl' title="Add an Expense">
                                <ExpenseModal onClose={close} selectedFriend={modalFriend} />
                        </Modal>
                </>
        </>
}

export default FriendsList;