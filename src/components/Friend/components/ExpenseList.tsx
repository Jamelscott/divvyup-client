import { ExpenseData, ExpenseListType } from "@/types.d";
import Expense from "./Expense";

function ExpenseList({
  sourceType,
  friendExpenses,
}: {
  friendExpenses: ExpenseData[];
  sourceType: ExpenseListType;
}) {
  return (
    <div className="flex flex-col w-full items-center max-w-[700px]">
      {friendExpenses.length > 0 ? (
        friendExpenses.map((expense: ExpenseData, i) => {
          return (
            <Expense
              key={`${expense} ${i}`}
              expense={expense}
              sourceType={sourceType}
            />
          );
        })
      ) : (
        <h2 style={{ opacity: 0.5 }}>You have no shared expenses</h2>
      )}
    </div>
  );
}

export default ExpenseList;
