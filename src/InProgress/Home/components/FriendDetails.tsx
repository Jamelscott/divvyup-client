import { selectFriends } from "@/slices/friendsSlice";
import { selectExpenses, selectUser } from "@/slices/userSlice";
import { friendOwingDiff } from "@/utils/friendHelpers";

import { useSelector } from "react-redux";
import FriendDetail from "./FriendDetail";
import { calcTotalExpenseDiff } from "@/utils/expenseHelpers";

const FriendDetails = () => {
  const friends = useSelector(selectFriends);
  const user = useSelector(selectUser);
  const expenses = useSelector(selectExpenses);

  const expensDiff = calcTotalExpenseDiff(expenses, user);
  console.log(expensDiff);

  const friendOwingDiffs = friends?.reduce(
    (
      acc: {
        youAreOwed: {
          friendId: string;
          friendUsername: string;
          friendPhoto: string;
          totalDiff: number;
        }[];
        youOwe: {
          friendId: string;
          friendUsername: string;
          friendPhoto: string;
          totalDiff: number;
        }[];
      },
      curr
    ) => {
      const { userSpent, friendSpent, friendOwes, userOwes } = friendOwingDiff(
        user,
        expenses,
        curr
      );

      if (userSpent > friendSpent) {
        console.log(
          "userspent:",
          userSpent,
          "friendSpent: ",
          friendSpent,
          "riendOwes: ",
          friendOwes,
          "userOwes: ",
          userOwes
        );
        acc.youAreOwed.push({
          friendId: curr.id,
          friendUsername: curr.username,
          friendPhoto: curr.photo,
          totalDiff: userSpent - friendSpent,
        });
      } else if (friendSpent > userSpent) {
        acc.youOwe.push({
          friendId: curr.id,
          friendUsername: curr.username,
          friendPhoto: curr.photo,
          totalDiff: friendSpent - userSpent,
        });
      }

      return acc;
    },
    {
      youOwe: [],
      youAreOwed: [],
    }
  );

  return (
    <div className="flex flex-col items-center font-[Trispace] rounded-[10px] bg-[rgba(217,217,217,0.04)] shadow-lg p-4">
      <div className="flex w-full justify-between gap-5 ">
        <div className="flex-1 flex flex-col gap-5 pt-0">
          <h2>You Owe</h2>
          {friendOwingDiffs?.youOwe.map((friend) => (
            <FriendDetail
              id={friend.friendId}
              username={friend.friendUsername}
              totalDiff={friend.totalDiff}
              key={friend.friendUsername}
              photo={friend.friendPhoto}
              expenses={expenses}
              userId={user.id}
              color="#D96161"
            />
          ))}
        </div>
        <div
          style={{ borderColor: "rgba(137, 137, 137, 0.2)" }}
          className="w-0 h-full border-[1px]"
        ></div>
        <div className="flex-1 flex flex-col gap-5 pt-0">
          <h2>You are Owed</h2>
          {friendOwingDiffs?.youAreOwed.map((friend) => (
            <FriendDetail
              id={friend.friendId}
              username={friend.friendUsername}
              totalDiff={friend.totalDiff}
              key={friend.friendUsername}
              photo={friend.friendPhoto}
              userId={user.id}
              expenses={expenses}
              color="#509F33"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendDetails;
