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
      ? friendDiff.userSpent - friendDiff.friendSpent
      : !noExpenses && friendSpentMore
      ? friendDiff.friendSpent - friendDiff.userSpent
      : 0
  ).toFixed(2);

  if (noExpenses) {
    return <h4 className="text-[22px]">$0.00</h4>;
  }
  if (priceDiff === "0.00") {
    return <h4 className="text-[22px]">$0.00</h4>;
  }
  if (youSpentMore) {
    return (
      <h4 className="text-[22px]" style={{ color: "#509F33" }}>
        ${priceDiff}
      </h4>
    );
  }
  if (!youSpentMore) {
    return (
      <h4 className="text-[22px]" style={{ color: "#D96161" }}>
        -${priceDiff}
      </h4>
    );
  }
  return <></>;
}

export default PriceDiff;
