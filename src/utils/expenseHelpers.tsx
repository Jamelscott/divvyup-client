import { supabase } from '../../utils/supabase';
import { Expense, User, addExpense } from '../types';

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
    const { purchasedBy, quantity, splitpercentage, name, type, friendId } = expense;
    const newExpense = {
        name: name,
        type: type,
        lender: purchasedBy,
        ower: purchasedBy === user.id ? friendId : user.id,
        quantity: quantity,
        splitpercentage: splitpercentage,
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
    const sortByDate = data?.sort((expenseA, expenseB) => new Date(expenseA.createdAt).getTime() - new Date(expenseB.createdAt).getTime())
    if (error) {
        console.log(error);
    }
    return sortByDate;
};

export const priceParser = (expense: Expense) => {
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
export const youOweThem = (expense: Expense, userId: string) => {
    // let userIsLender: boolean;
    if (!expense || !userId) return
    if (userId !== expense.lender) if (userId !== expense.ower) {
        console.log('hi')
        return
    }
    if (userId !== expense.lender) {
        return true
    } else {
        return false
    }
}

export const calcTotalExpenseDiff = (expenses: Expense[], user: User) => {
    let total = 0;
    expenses.forEach((expense) => {
        if (expense.lender === user.id) total += Number(priceParser(expense))
        if (expense.ower === user.id) total -= Number(priceParser(expense))
    })
    return total
}