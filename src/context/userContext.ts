import { createContext } from "react";
import { ExpenseData, FriendRequest, User } from "../types";

export type UserContextType = {
        user: User,
        setUser: React.Dispatch<React.SetStateAction<User>>
        friends: User[] | undefined,
        expenses: ExpenseData[]
        setUpdateContext: React.Dispatch<React.SetStateAction<boolean>>
        friendRequests: FriendRequest[],
        setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>
        errorMsgs: string[],
        setErrorMsgs: React.Dispatch<React.SetStateAction<string[]>>
}

export const UserContext = createContext<UserContextType | null>(null);