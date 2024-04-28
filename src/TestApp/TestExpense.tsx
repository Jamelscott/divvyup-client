import { useContext } from "react";
import { priceParser, youOweThem } from "../utils/expenseHelpers";
import { UserContext, UserContextType } from "../context/userContext";
import { Expense } from "../types";

function TestExpense({ expense }: { expense: Expense }) {
        const { user, friends } = useContext(UserContext) as UserContextType;
        const friendName = friends?.find((friend) => friend.id === expense.lender || friend.id === expense.ower)
        const positive = youOweThem(expense, user.id)
        return (
                <div key={`${expense}`}>
                        <p>Name: {expense.name}</p>
                        <p>Type: {expense.type}</p>
                        {friendName && <p>Friend: {friendName.username}</p>}
                        <p style={{ color: positive ? 'green' : 'red' }}>Amount: {!positive && '-'}{priceParser(expense)}</p>
                        <hr />
                </div>
        );
}

export default TestExpense;