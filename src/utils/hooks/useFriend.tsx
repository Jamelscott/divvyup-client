import { selectFriends } from "@/slices/friendsSlice";
import { selectExpenses } from "@/slices/userSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

function useFriend({ friendId }: { friendId: string }) {
  const friends = useSelector(selectFriends);
  const expenses = useSelector(selectExpenses);

  const { friend, sharedExpenses } = useMemo(() => {
    const friend = friends && friends.find((friend) => friend.id === friendId);
    const sharedExpenses = expenses
      .filter(
        (expense) =>
          expense.lender === friend?.id || expense.ower === friend?.id
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
      );
    return { friend, sharedExpenses };
  }, [friends, expenses]);

  return {
    friend,
    sharedExpenses,
  };
}

export default useFriend;
