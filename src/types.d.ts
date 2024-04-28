export type User = {
    id: string,
    username: string,
    email: string,
    expenses: Expense[]
}

export type UserSignUp = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type SignUpError = {
    error: string
}

export type UserLogin = {
    usernameOrEmail: string,
    password: string,
}


export type Expense = {
    id: string,
    name: string,
    type: ExpenseType,
    splitPercentage: number,
    purchasedBy: string,
    quantity: number,
    date: Date,
    ower: string,
    lender: string
}

export type addExpense = Expense & {
    friendId: string
}

export type ExpenseType = 'Entertainment' | 'Food and Drink' | 'Home' | 'Transportation' | 'Life' | 'Utility'

export type FriendRequest = {
    id: string,
    type: string,
    requester_username: string,
    requestee_username: string,
    requester_uuid: string,
    requestee_uuid: string,
    updated_at: Date,
    created_at: Date
}

export type Profile = {
    id: string,
    email: string,
    username: string,
    expenseIds: string[],
    updated_at: Date,
    created_at: Date
}