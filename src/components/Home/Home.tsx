import { useSelector } from "react-redux";
import ExpenseList from "../Friend/components/ExpenseList";
import BalaneceDetails from "./components/BalanceDetails";
import HomeHeader from "./components/HomeHeader";
import { selectExpenses } from "@/slices/userSlice";
import FriendDetails from "./components/FriendDetails";
import { ExpenseListType } from "@/types.d";

const Home = () => {
  const expenses = useSelector(selectExpenses);

  return (
    <div className="flex flex-col xl:flex-row p-4 gap-5">
      <div className="flex-1 flex flex-col gap-5">
        <HomeHeader />
        <BalaneceDetails />
        <FriendDetails />
      </div>
      <div className="overflow-y-scroll flex-1 flex flex-col max-md:mb-[85px] items-center font-[Trispace] rounded-[10px] bg-[rgba(217,217,217,0.04)] shadow-lg p-4 h-[100%] overflow-auto">
        <div className="bg-[#172c29]">
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
