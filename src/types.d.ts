import { DataState } from "./slices/userSlice";

export type GenericDataState<T> = {
    data: T;
    dataState: DataState;
    error?: ErrorData;
    expiration?: number;
};

export type User = {
    id: string,
    username: string,
    email: string,
    expenses: ExpenseData[],
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
    created_at: Date;
}

export type AddExpense = Expense & {
    friendId: string
}

export enum ExpenseListType {
    RECENT,
    USER_SPECIFIC
}

export enum FriendListType {
    HOMEPAGE,
    FRIENDS_PAGE
};

export type ExpenseType = 'dining out' | 'grocery' | 'household' | 'misc' | 'mortgage' | 'pet' | 'rent'

export type FriendSliceData = {
    friendRequests: FriendRequest[],
    friends: User[] | null;
    activeList: string | null;
}

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