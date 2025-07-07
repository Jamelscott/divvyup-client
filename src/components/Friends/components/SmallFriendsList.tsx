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
import Friend from "./FriendCard";
import { DataState, FriendSourceType, User } from "@/types.d";
import { useClickOutside } from "@mantine/hooks";
import SmallExpenseModal from "./SmallExpenseModal";
import { Transition } from "@mantine/core";

function SmallFriendsList({ sourceType }: { sourceType: FriendSourceType }) {
  const friendsDataState = useSelector(selectFriendsState);
  const friends = useSelector(selectFriends);
  const user = useSelector(selectUser);
  const ref = useClickOutside(() => setOpen(false));
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [modalFriend, setModalFriend] = useState<User>();

  useEffect(() => {
    if (user.id && friendsDataState === DataState.INITIAL) {
      dispatch(getFriends(user.id));
      dispatch(getFriendRequests(user));
    }
  }, [user]);

  const handleOpenExpenseModal = (friend: User) => {
    setModalFriend(friend);
    setOpen(true);
  };

  return (
    <div className="flex gap-4 flex-wrap justify-center pt-5">
      {user.expenses &&
        friends?.map((friend) => (
          <Friend
            key={friend.id}
            handleOpenExpenseModal={handleOpenExpenseModal}
            friend={friend}
            sourceType={sourceType}
          />
        ))}
      <Transition
        mounted={open}
        transition="slide-up"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <div
            style={{
              ...styles,
              zIndex: "3",
              position: "absolute",
              bottom: "0",
            }}
            ref={ref}
          >
            <SmallExpenseModal
              onClose={() => setOpen(false)}
              selectedFriend={modalFriend}
            />
          </div>
        )}
      </Transition>
    </div>
  );
}

export default SmallFriendsList;
