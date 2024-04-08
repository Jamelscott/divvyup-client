import { useForm } from "react-hook-form";
import { handleAddExpense } from "../utils/expenseHelpers";
import { Expense } from "../utils/types";

function TestAddExpenseForm() {
    const { register, handleSubmit }= useForm()
    return ( 
        <>
            <form onSubmit={handleSubmit((data) => handleAddExpense(data as Expense))}>
                <input defaultValue="carrots" {...register("name")} />
                <input defaultValue="grocery" {...register("type")} />
                <input defaultValue="ff07e530-7293-4659-a781-f5c63d7e61f1" {...register("lender")} />
                <input defaultValue="d39a1198-93ad-4a44-8483-46a2b6955f77" {...register("ower")} />
                <input defaultValue="12.56" {...register("quantity")} />
                <input type="submit" />
            </form>
        </>
     );
}

export default TestAddExpenseForm;