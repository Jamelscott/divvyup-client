import { supabase } from '../../utils/supabase';
import { User, addExpense } from '../types';

export const itemTypes = [
    'Misc',
    'household',
    'grocery',
    'pet',
    'rent',
    'mortgage',
    'dining out'
]

export const handleAddExpense = async (expense: addExpense, user: User) => {
    const { purchasedBy, quantity, splitPercentage, name, type, friendId } = expense;
    const newExpense = {
        name: name,
        type: type,
        lender: purchasedBy,
        ower: purchasedBy === user.id ? friendId : user.id,
        quantity: quantity,
        splitpercentage: splitPercentage,
    }
    console.log(newExpense)
    const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select();
    if (error) {
        if (error?.code === '42501') {
            console.log(error, 'cannot add expense to other users');
            return false
        } else {
            console.log(error);
            return false
        }
    } else {
        console.log(data);
        return true
    }
};
// dummy data: 'ower.eq.0ae9db38-6f02-4ebd-8552-f5632daccce3,lender.eq.0ae9db38-6f02-4ebd-8552-f5632daccce3'
export const handleFetchSingleProfileExpenses = async (id: string) => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .or(`ower.eq.${id},lender.eq.${id}`);
    console.log(data)
    const sortByDate = data?.sort((expenseA, expenseB) => new Date(expenseA.createdAt).getTime() - new Date(expenseB.createdAt).getTime())
    if (error) {
        console.log(error);
    }
    return sortByDate;
};

export const priceParser = (expense: any) => {
    const { splitpercentage: splitString } = expense;
    let splitBy: number;

    switch (splitString) {
        case 50:
            splitBy = 2
            break;
        case 100:
            splitBy = 1
            break;
        default:
            splitBy = 1
    }

    return (expense.quantity / splitBy).toFixed(2)
}
export const youOweThem = (expense: any, userId: any) => {
    // let userIsLender: boolean;
    if (userId !== expense.lender && userId !== expense.ower) throw new Error("expense doesn't belong to user")
    if (userId !== expense.lender) {
        return true
    } else {
        return false
    }
}