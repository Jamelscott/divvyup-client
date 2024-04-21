import { useForm } from 'react-hook-form';
import './styles/testModal.css'
import { handleAddExpense } from '../utils/expenseHelpers';
import { Expense } from '../utils/types';
function TestModal({ friend }: any) {
        console.log(friend)
        const { register, handleSubmit } = useForm();
        return (
                <div className='container'>
                        <form onSubmit={handleSubmit((data) => handleAddExpense(data as Expense))}>
                                <label htmlFor="name">name: </label>
                                <input defaultValue="carrots" {...register('name')} />
                                <br />
                                <label htmlFor="type">type: </label>
                                <input defaultValue="grocery" {...register('type')} />
                                <br />
                                <select name="paidBy" id="lenderOrOwer">
                                        <option value="lender">lender</option>
                                        <option value="ower">ower</option>
                                </select>
                                <input defaultValue="f2c62dce-af40-4dbc-ae27-99a0bc6e20fb" {...register('lender')} />
                                <input defaultValue="d39a1198-93ad-4a44-8483-46a2b6955f77" {...register('ower')} />
                                <select name="lenderOwer" id="">

                                </select>
                                <input defaultValue="12.56" {...register('quantity')} />
                                <input type="submit" />
                        </form >
                </div>
        );
}

export default TestModal;