import { useSelector } from "react-redux";
import ExpenseList, { ExpenseListType } from "../Friend/components/ExpenseList";
import BalaneceDetails from "./components/BalanceDetails";
import HomeHeader from "./components/HomeHeader";
import { selectExpenses } from "@/slices/userSlice";
import FriendDetails from "./components/FriendDetails";

const Home = () => {
  const expenses = useSelector(selectExpenses);

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-3">
      <div className="flex-1 flex flex-col p-3 gap-5">
        <HomeHeader />
        <BalaneceDetails />
        <FriendDetails />
      </div>
      <div className="flex-1 flex flex-col items-center font-[Trispace] rounded-[10px] bg-[rgba(217,217,217,0.04)] shadow-lg p-4 max-h-screen overflow-auto">
        <div className="sticky top-0 bg-[#172c29]">
          <h2 className="text-2xl font-[montserrat] text-[#11B5E4] mb-4 w-full">
            Recent Expenses
          </h2>
        </div>
        <ExpenseList
          friendExpenses={expenses}
          sourceType={ExpenseListType.RECENT}
        />
      </div>
    </div>
  );
};
export default Home;
