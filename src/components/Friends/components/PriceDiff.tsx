import { selectUser } from "@/slices/userSlice";
import { User } from "@/types";
import { friendOwingDiff } from "@/utils/friendHelpers";
import { useSelector } from "react-redux";

function PriceDiff({
  friend,
  noExpenses,
}: {
  friend: User;
  noExpenses: boolean;
}) {
  const user = useSelector(selectUser);
  const friendDiff = friendOwingDiff(user, user.expenses, friend);
  const youSpentMore = friendDiff.userSpent > friendDiff.friendSpent;
  const friendSpentMore = friendDiff.friendSpent > friendDiff.userSpent;
  const priceDiff = (
    !noExpenses && youSpentMore
      ? friendDiff.userSpent - friendDiff.friendOwes
      : !noExpenses && friendSpentMore
      ? friendDiff.friendSpent - friendDiff.userOwes
      : 0
  ).toFixed(2);

  if (noExpenses) {
    return <h3>$0.00</h3>;
  }
  if (priceDiff === "0.00") {
    return <h3>$0.00</h3>;
  }
  if (youSpentMore) {
    return <h3 style={{ color: "#509F33" }}>${priceDiff}</h3>;
  }
  if (!youSpentMore) {
    return <h3 style={{ color: "#D96161" }}>-${priceDiff}</h3>;
  }
  return <></>;
}

export default PriceDiff;
