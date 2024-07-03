import { useContext } from "react";
import { UserContext, UserContextType } from "../context/userContext";
import ExpenseData from "../components/Expenses/Expense";
import { AdvancedImage } from '@cloudinary/react';

function TestExpenses() {
	const { expenses } = useContext(UserContext) as UserContextType;
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<h3>Recent Expenses</h3>
			<div style={{ height: '700px', overflowY: "scroll", padding: '15px 15px' }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
					{expenses?.map((expense: any, i) => {
						return <ExpenseData key={`${expense} ${i}`} expense={expense} />
					})}
				</div>
			</div>
		</div>
	);
}

export default TestExpenses;