import { createContext } from "react";
import { User } from "../utils/types";

export type UserContextType = {
        user: User,
        setUser: React.Dispatch<React.SetStateAction<User>>
        friends: User[] | undefined,
}

export const UserContext = createContext<UserContextType | null>(null);