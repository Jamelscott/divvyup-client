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
    lender: User, // Id of lender
    ower: User, // Id of ower,
    quantity: number,
    date: Date,
}

export type ExpenseType = 'Entertainment' | 'Food and Drink' | 'Home' | 'Transportation' | 'Life' | 'Utility'