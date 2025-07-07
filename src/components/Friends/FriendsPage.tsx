import FriendsList from "./components/FriendsList";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFriends,
  selectFriendsState,
  setActiveExpenseList,
} from "@/slices/friendsSlice";
import { AppDispatch } from "@/utils/store";
import FriendRequests from "./components/FriendRequests";
import SmallFriendsList from "./components/SmallFriendsList";
import SmallFriendRequests from "./components/SmallFriendRequests";
import { DataState, FriendSourceType } from "@/types.d";

function FriendsPage() {
  const friendsState = useSelector(selectFriendsState);
  const friends = useSelector(selectFriends);
  const dispatch = useDispatch<AppDispatch>();

  if (friendsState === DataState.FULFILLED && friends.length > 0) {
    const filterOutNoExpensesFriend = friends.filter(
      (friend) => friend.expenses && friend.expenses.length > 0
    );

    filterOutNoExpensesFriend.length > 0 &&
      dispatch(setActiveExpenseList(filterOutNoExpensesFriend[0].id));
  }

  //!TODO: build empty state

  return (
    <>
      <div className="hidden max-[600px]:flex flex-col items-center p-5 justify-center">
        <SmallFriendRequests />
        <div className="pt-4">
          <SmallFriendsList sourceType={FriendSourceType.FRIENDS_PAGE} />
        </div>
      </div>

      <div className="max-[600px]:hidden">
        <div
          className="flex justify-between p-[40px] gap-5 w-full"
          style={{ overflow: "hidden" }}
        >
          <FriendsList sourceType={FriendSourceType.FRIENDS_PAGE} />
          <FriendRequests />
        </div>
      </div>
    </>
  );
}

export default FriendsPage;
