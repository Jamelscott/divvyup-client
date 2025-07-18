import { selectUser } from "../../../slices/userSlice";
import {
  getFriendRequests,
  getFriends,
  selectFriends,
  selectFriendsState,
} from "../../../slices/friendsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../../utils/store";
import FriendCard from "./FriendCard";
import { DataState, FriendSourceType, User } from "@/types.d";
import ExpenseModal from "./ExpenseModal";

function FriendsList({ sourceType }: { sourceType: FriendSourceType }) {
  const friendsDataState = useSelector(selectFriendsState);
  const friends = useSelector(selectFriends);
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [openModal, setOpenModal] = useState(false);
  const [modalFriend, setModalFriend] = useState<User>();

  useEffect(() => {
    if (user.id && friendsDataState === DataState.INITIAL) {
      dispatch(getFriends(user.id));
      dispatch(getFriendRequests(user));
    }
  }, [user]);

  const handleOpenExpenseModal = (friend: User) => {
    setModalFriend(friend);
    setOpenModal(true);
    return;
  };

  return (
    <div className="flex gap-4 flex-wrap w-full">
      {user.expenses &&
        friends?.map((friend) => (
          <FriendCard
            key={friend.id}
            handleOpenExpenseModal={handleOpenExpenseModal}
            friend={friend}
            sourceType={sourceType}
          />
        ))}
      {openModal && (
        <ExpenseModal
          onClose={() => setOpenModal(false)}
          selectedFriend={modalFriend}
        />
      )}
    </div>
  );
}

export default FriendsList;
