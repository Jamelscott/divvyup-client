import { notifications } from "@mantine/notifications";
import { supabase } from "../supabase";
import {
  ExpenseData,
  User,
  AddExpense,
  ExpenseType,
  EditExpenseData,
} from "../types";

export const itemTypes = [
  "misc",
  "household",
  "grocery",
  "pet",
  "rent",
  "mortgage",
  "dining out",
] as ExpenseType[];

export const handleAddExpense = async (
  expense: AddExpense,
  user: User,
  friend: User | null
): Promise<ExpenseData> => {
  if (!friend) throw new Error("need a friend to transact with");
  const { lender: lenderId, quantity, splitpercentage, name, type } = expense;
  const ower = user.id === lenderId ? friend.id : user.id;
  const newExpense = {
    name: name,
    type: type,
    lender: lenderId,
    ower: ower,
    quantity: Number(quantity),
    splitpercentage: Number(splitpercentage),
  };
  try {
    const { data, error }: any = await supabase
      .from("expenses")
      .insert([newExpense])
      .select();
    if (error) {
      throw new Error("error");
    }
    return data[0];
  } catch (err) {
    console.log(err);
    throw new Error("error");
  }
};
// dummy data: 'ower.eq.0ae9db38-6f02-4ebd-8552-f5632daccce3,lender.eq.0ae9db38-6f02-4ebd-8552-f5632daccce3'
export const handleFetchSingleProfileExpenses = async (
  id: string
): Promise<ExpenseData[]> => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .or(`ower.eq.${id},lender.eq.${id}`)
    .order("created_at", { ascending: false });
  const sortByDate = (data as ExpenseData[])?.sort(
    (expenseA, expenseB) =>
      new Date(expenseA.created_at).getTime() -
      new Date(expenseB.created_at).getTime()
  );
  if (error) {
    console.log(error);
  }
  return sortByDate;
};

export const priceParser = (expense: ExpenseData) => {
  return (expense.quantity / getSplitPercentage(expense)).toFixed(2);
};

export const getSplitPercentage = (expense: ExpenseData) => {
  const { splitpercentage: splitString } = expense;

  let splitBy: number;

  switch (splitString) {
    case 50:
      splitBy = 2;
      break;
    case 100:
      splitBy = 1;
      break;
    default:
      splitBy = 1;
  }
  return splitBy;
};
export const youOweThem = (expense: ExpenseData, userId: string) => {
  if (!expense || !userId) return;
  if (userId !== expense.lender)
    if (userId !== expense.ower) {
      return;
    }
  if (userId !== expense.lender) {
    return true;
  } else {
    return false;
  }
};

export const calcTotalExpenseDiff = (expenses: ExpenseData[], user: User) => {
  let total = 0;
  expenses.forEach((expense) => {
    if (expense.lender === user.id) total += Number(priceParser(expense));
    if (expense.ower === user.id) total -= Number(priceParser(expense));
  });
  return total;
};

export const calcTotalOwing = (expenses: ExpenseData[], user: User) => {
  let total = 0;
  expenses.forEach((expense) => {
    if (expense.ower === user.id) total += Number(priceParser(expense));
  });
  return total;
};

export const calcTotalLent = (expenses: ExpenseData[], user: User) => {
  let total = 0;
  expenses.forEach((expense) => {
    if (expense.lender === user.id) total += Number(priceParser(expense));
  });
  return total;
};

export const handleDeleteExpense = async (expense: ExpenseData, user: User) => {
  if (expense.lender !== user.id && expense.ower !== user.id)
    throw new Error("user cannot delete another users expense");
  const { error, data } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expense.id);

  if (error) console.log(error);
  if (data) console.log(data);
};

export const handleEditExpense = async (
  newExpenseData: EditExpenseData,
  expenseId: string
) => {
  const { data, error } = await supabase
    .from("expenses")
    .update(newExpenseData)
    .eq("id", expenseId)
    .select();
  if (error) {
    throw new Error(error.message);
  }
  if (data) {
    return data[0] as ExpenseData;
  }
};

export const handleSettleUp = async (
  expenses: ExpenseData[],
  friendId: string
) => {
  const sharedExpenses = expenses
    .filter(
      (expense) => expense.lender === friendId || expense.ower === friendId
    )
    .map((expense) => {
      return {
        id: expense.id,
        name: expense.name,
        type: expense.type,
        lender: expense.lender,
        ower: expense.ower,
        quantity: expense.quantity,
        splitpercentage: expense.splitpercentage,
      };
    });
  const { error } = await supabase
    .from("expense_archive")
    .insert(sharedExpenses)
    .select();
  if (error) {
    notifications.show({
      title: "Failed to settle up",
      message: error.message,
      color: "grape",
      withBorder: true,
      radius: "md",
    });
    return;
  } else {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", [sharedExpenses.map((expense) => expense.id)]);
    if (error) {
      notifications.show({
        title: "Failed to delete expenses",
        message: "not sure why..",
        color: "grape",
        withBorder: true,
        radius: "md",
      });
    }
  }
};
