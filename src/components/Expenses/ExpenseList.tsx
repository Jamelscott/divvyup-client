import { selectExpenses, selectUser } from "@/slices/userSlice";
import { useSelector } from "react-redux";
import Expense from "./Expense";
import { ExpenseData } from "@/types";
import { selectFriends } from "@/slices/friendsSlice";

export enum ExpenseListType {
        RECENT,
        USER_SPECIFIC
}

function ExpenseList({ sourceType, friendExpenses }: { friendExpenses?: ExpenseData[], sourceType: ExpenseListType }) {
        const expenses = useSelector(selectExpenses)
        const friends = useSelector(selectFriends)
        const user = useSelector(selectUser)
        let renderedExpenses = friendExpenses ?? expenses
        const friendUsername = () => {
                if (!friendExpenses) return 'Friend'
                const id = friendExpenses[0].lender === user.id ? friendExpenses[0].ower : friendExpenses[0].lender
                const friendData = friends.find((friend) => friend.id === id)
                return friendData?.username
        }
        const header = sourceType === ExpenseListType.RECENT ? <h3><b>Recent Expenses</b></h3> : <h3><b>Expenses with {friendUsername()}</b></h3>
        return (
                <div className="flex flex-col gap-5 items-center w-full bg-white shadow-lg rounded-xl border border-black p-3" style={{ height: '100%' }}>
                        {header}
                        <div className="flex p-3 flex-col gap-5 w-full h-full overflow-y-scroll" style={{ height: 'fit-content' }}>
                                {renderedExpenses.length > 0 ? renderedExpenses.map((expense: any, i) => {
                                        return <Expense key={`${expense} ${i}`} expense={expense} sourceType={sourceType} />
                                }) : <>You have no expenses</>}
                        </div>
                </div >
                // </ShineBorder>
        );
}

export default ExpenseList;