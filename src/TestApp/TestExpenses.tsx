import { useContext } from "react";
import { UserContext, UserContextType } from "../context/userContext";
import TestExpense from "./TestExpense";

function TestExpenses() {
        const { expenses } = useContext(UserContext) as UserContextType;

        return (
                <div style={{ height: '800px', overflowY: "scroll", border: '1px solid black', padding: '15px 15px' }}>
                        <br />
                        {expenses?.map((expense: any, i) => {
                                console.log(expenses)
                                return <TestExpense key={`${expense} ${i}`} expense={expense} />
                        })}
                </div>
        );
}

export default TestExpenses;