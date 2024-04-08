import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TestAddExpenseForm from "./TestExpenseForm";
import TestUserExpenses from "./TestUserExpenses";
import TestFriends from "./TestFriends";


function TestApp({user}: any) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.id) {
            navigate('/login')
        }
    }, [])
    return ( 
        <>
            <p>Welcome <b>{user.username}</b> to the test app</p>
            <TestAddExpenseForm />
            <TestUserExpenses userId={user.id} />
            <TestFriends user={user} />
        </>
     );
}

export default TestApp;