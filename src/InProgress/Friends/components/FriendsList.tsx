import { selectUser } from "../../../slices/userSlice";
import {
  DataState,
  getFriendRequests,
  getFriends,
  selectFriends,
  selectFriendsState,
} from "../../../slices/friendsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../../utils/store";
import Friend from "./Friend";
import { User } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import { FriendSourceType } from "@/components/Home/Home";
import { Modal } from "@mantine/core";
import ExpenseModal from "./ExpenseModal";

function FriendsList({ sourceType }: { sourceType: FriendSourceType }) {
  const friendsDataState = useSelector(selectFriendsState);
  const friends = useSelector(selectFriends);
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [opened, { open, close }] = useDisclosure(false);
  const [modalFriend, setModalFriend] = useState<User>();

  useEffect(() => {
    if (user.id && friendsDataState === DataState.INITIAL) {
      dispatch(getFriends(user.id));
      dispatch(getFriendRequests(user));
    }
  }, [user]);

  const handleOpenExpenseModal = (friend: User) => {
    setModalFriend(friend);
    open();
    return;
  };

  return (
    <div className="flex gap-4 flex-wrap w-full">
      {user.expenses &&
        friends?.map((friend) => (
          <Friend
            key={friend.id}
            handleOpenExpenseModal={handleOpenExpenseModal}
            friend={friend}
            sourceType={sourceType}
          />
        ))}
      <Modal opened={opened} onClose={close} size="xl" title="Add an Expense">
        <ExpenseModal onClose={close} selectedFriend={modalFriend} />
      </Modal>
    </div>
  );
}

export default FriendsList;
