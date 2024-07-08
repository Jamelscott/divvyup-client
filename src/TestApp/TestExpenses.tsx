import ExpenseData from "../components/Expenses/Expense";
import { useSelector } from "react-redux";
import { selectExpenses } from "../slices/userSlice";

function TestExpenses() {
	const expenses = useSelector(selectExpenses)
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