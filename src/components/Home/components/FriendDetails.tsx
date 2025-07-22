import { selectFriends } from "@/slices/friendsSlice";
import { selectExpenses, selectUser } from "@/slices/userSlice";
import { friendOwingDiffs } from "@/utils/friendHelpers";

import { useSelector } from "react-redux";
import FriendDetail from "./FriendDetail";

const FriendDetails = () => {
  const friends = useSelector(selectFriends);
  const user = useSelector(selectUser);
  const expenses = useSelector(selectExpenses);
  const friendDiffs = friendOwingDiffs(friends, expenses, user);

  return (
    <div className="flex items-center w-full justify-between gap-5 font-[Trispace] rounded-[10px] bg-[rgba(217,217,217,0.04)] shadow-lg p-4">
      <div
        className="flex-1 flex flex-col gap-5 pt-0 flex-wrap border pr-5 border-r-2 border-l-0 border-t-0 border-b-0"
        style={{ borderColor: "rgba(137, 137, 137, 0.2)" }}
      >
        <h2 className="text-center md:text-start">You Owe</h2>
        {friendDiffs?.youOwe.map((friend) => (
          <FriendDetail
            id={friend.friendId}
            username={friend.friendUsername}
            key={friend.friendUsername}
            photo={friend.friendPhoto}
            expenses={expenses}
            userId={user.id}
          />
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-5 pt-0">
        <h2 className="text-center md:text-start">You are Owed</h2>
        {friendDiffs?.youAreOwed.map((friend) => (
          <FriendDetail
            id={friend.friendId}
            username={friend.friendUsername}
            key={friend.friendUsername}
            photo={friend.friendPhoto}
            userId={user.id}
            expenses={expenses}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendDetails;
