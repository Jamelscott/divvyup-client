import { useContext } from "react";
import { priceParser, youOweThem } from "../utils/expenseHelpers";
import { UserContext, UserContextType } from "../context/userContext";
import { ExpenseData } from "../types";
import { getLocalFriend } from "../utils/friendHelpers";

function TestExpense({ expense }: { expense: ExpenseData }) {
        const { user, friends } = useContext(UserContext) as UserContextType;
        const friendName = friends?.find((friend) => friend.id === expense.lender || friend.id === expense.ower)
        const negative = youOweThem(expense, user.id)
        return (
                <div className="single-expense-container" key={`${expense.id}`}>
                        <div className="friend-data-container">
                                <div>
                                        <div style={{ backgroundColor: 'grey', width: '40px', height: '40px', borderRadius: '100px' }}></div>
                                </div>
                                <div>
                                        <p>Name: {expense.name}</p>
                                </div>
                        </div>
                        <p>Type: {expense.type}</p>
                        {friendName && <p>Friend: {friendName.username}</p>}
                        <p style={{ color: negative ? 'red' : 'green' }}>Amount: {!negative && '-'}{priceParser(expense)}</p>
                        <p>Paid By: {friends && getLocalFriend(expense.lender, friends)?.username || 'Me'}</p>
                        <hr />
                </div>
        );
}

export default TestExpense;