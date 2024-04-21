import { useContext } from 'react';
import { handleFetchSingleProfileExpenses } from '../utils/expenseHelpers';
import { UserContext, UserContextType } from '../context/userContext';

function TestUserExpenses() {
    const { user } = useContext(UserContext) as UserContextType;

    return (
        <>
            <button onClick={() => handleFetchSingleProfileExpenses(user.id)}>Console.log user expenses</button>
        </>
    );
}

export default TestUserExpenses;