export type User = {
    id: string,
    username: string,
    email: string,
    expenses: Expense[] | null,
    photo: string,
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


export type ExpenseData = {
    id: string,
    name: string,
    type: ExpenseType,
    splitpercentage: number,
    purchasedBy: string,
    quantity: number,
    date: Date,
    ower: string,
    lender: string
    createdAt: Date;
}

export type addExpense = Expense & {
    friendId: string
}

export type ExpenseType = 'dining out' | 'grocery' | 'household' | 'misc' | 'mortgage' | 'pet' | 'rent'

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