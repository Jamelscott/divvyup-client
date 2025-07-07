import { selectFriends } from "@/slices/friendsSlice";
import { selectExpenses, selectUser } from "@/slices/userSlice";
import {
  calcTotalExpenseDiff,
  calcTotalLent,
  calcTotalOwing,
} from "@/utils/expenseHelpers";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const BalaneceDetails = () => {
  const user = useSelector(selectUser);
  const expenses = useSelector(selectExpenses);
  const friends = useSelector(selectFriends);

  const getTotalNum = (num: number) => {
    return Number(
      Math.round(parseFloat(Math.abs(num) + "e" + 2)) + "e-" + 2
    ).toFixed(2);
  };
  const totalDiff = useMemo(() => {
    const expenseDiff = calcTotalExpenseDiff(expenses, user);
    if (expenseDiff > 0) {
      return <h3 style={{ color: "#509F33" }}>${expenseDiff.toFixed(2)}</h3>;
    } else if (expenseDiff < 0) {
      return <h3 style={{ color: "#D96161" }}>${getTotalNum(expenseDiff)}</h3>;
    } else if (expenseDiff === 0) {
      return <h3 style={{ color: "#74C0FC" }}>$0.00</h3>;
    } else {
      return <></>;
    }
  }, [friends, expenses]);
  const totalOwing = useMemo(() => {
    const totalOwing = calcTotalOwing(expenses, user);
    if (totalOwing > 0) {
      return <h3 style={{ color: "#D96161" }}>${totalOwing.toFixed(2)}</h3>;
    } else {
      return <h3 style={{ color: "#74C0FC" }}>$0.00</h3>;
    }
  }, [friends, expenses]);
  const totalLent = useMemo(() => {
    const totalLent = calcTotalLent(expenses, user);
    if (totalLent > 0) {
      return <h3 style={{ color: "#509F33" }}>${totalLent.toFixed(2)}</h3>;
    } else {
      return <h3 style={{ color: "#74C0FC" }}>$0.00</h3>;
    }
  }, [friends, expenses]);
  return (
    <div className="flex justify-around gap-4 font-[Trispace] rounded-[10px] bg-[rgba(217,217,217,0.04)] shadow-lg p-3">
      <div className="flex flex-1 flex-col items-center justify-center">
        <h2>Total Difference</h2>
        {totalDiff}
      </div>
      <div
        className="flex flex-1 flex-col items-center justify-around border border-r-2 border-l-2 border-t-0 border-b-0"
        style={{ borderColor: "rgba(137, 137, 137, 0.2)" }}
      >
        <h2>You've spent</h2>
        {totalOwing}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h2>Friends spent</h2>
        {totalLent}
      </div>
    </div>
  );
};

export default BalaneceDetails;
