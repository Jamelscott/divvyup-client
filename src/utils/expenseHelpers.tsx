import { supabase } from '../../utils/supabase';
import { Expense } from './types';

export const handleAddExpense = async (expense: Expense) => {
    const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select();
    if (error) {
        if (error?.code === '42501') {
            console.log(error, 'cannot add expense to other users');
        } else {
            console.log(error);
        }
    } else {
        console.log(data);
    }
};
// dummy data: 'ower.eq.0ae9db38-6f02-4ebd-8552-f5632daccce3,lender.eq.0ae9db38-6f02-4ebd-8552-f5632daccce3'
export const handleFetchSingleProfileExpenses = async (id: string) => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .or(`ower.eq.${id},lender.eq.${id}`);
    if (error) {
        console.log(error);
    } else {
        console.log(data);
    }
    return data;
};
