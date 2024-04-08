import { handleFetchSingleProfileExpenses } from "../utils/expenseHelpers";

function TestUserExpenses({userId}: {userId:string}) {
    return ( 
        <>
        <button onClick={() => handleFetchSingleProfileExpenses(userId)}>Console.log user expenses</button>
        </>
     );
}

export default TestUserExpenses;