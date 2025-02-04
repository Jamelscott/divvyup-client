import { notifications } from '@mantine/notifications';
import { supabase } from '../supabase';
import { UserLogin, UserSignUp, SignUpError, User, ExpenseData } from '../types';
import { errorNotification } from '@/components/utils/notifications';

const nullUser = {
    id: '',
    username: '',
    email: '',
    expenses: []
};

export default async function signUp(signUpData: UserSignUp): Promise<User | SignUpError> {
    const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
            data: {
                username: signUpData.username
            }
        }
    });
    if (error) {
        console.log(error);
        return { error: 'User is already signed up' };
    }
    if (data.user === null) {
        throw new Error('user not found, returning null from server');
    }
    if (data.user.email === undefined) {
        throw new Error('user email not found, returning null from server');
    }
    const signedInUser = userBuilder(data.user as any);
    sessionStorage.setItem('user', JSON.stringify(signedInUser));
    return signedInUser;
}

export async function loginEmailOrUsername(loginCreds: UserLogin): Promise<User | undefined> {
    const { usernameOrEmail, password } = loginCreds;
    if (usernameOrEmail && password) {
        const isEmail = usernameOrEmail.includes('@');

        if (isEmail) {
                const response = await supabase.auth.signInWithPassword({ email: usernameOrEmail, password: password });
                if (response.error) {
                    notifications.show(errorNotification('Friend Request Fail','That user may not exist'))
                    throw new Error(response.error.message)
                };
                if (response.data.user) {
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', response.data.user.id)
                        .single()
                    if (error) console.log(error)
                    const signedInUser = userBuilder(profile);
                    return signedInUser;
                }
        } else {
                const { data, error } = await supabase.from('profiles').select().eq('username', usernameOrEmail.toLocaleLowerCase());
                if (error || data.length === 0) {
                    notifications.show(errorNotification('Friend Request Failed','That usrname/email does not exist'))
                    throw new Error('profile does not exist')
                }
                if (data) {
                    const response = await supabase.auth.signInWithPassword({ email: data[0].email, password: password });
                    if (response.error) throw response.error;

                    if (response.data.user) {
                        const { data: profile, error } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', response.data.user.id)
                            .single()
                        if (error) console.log(error)
                        const signedInUser = userBuilder(profile);
                        return signedInUser;
                    } else {
                        throw new Error('user not found - made a typo?');
                    }
                } else throw new Error ('User data not available');
        }
    }
}

export function userBuilder(user: User): User {
    if (!user.id) throw new Error('User data is empty?');
    if (user.email === undefined) throw new Error('User email data is undefined?');
    const builtUser: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        expenses: user.expenses || [],
        photo: user.photo
    };

    return builtUser;
}

export const handleGetUser = async () => {
    const { data: gotUser, error } = await supabase.auth.getUser();
    gotUser ? console.log(gotUser) : console.log(error);
};

export const handleUserSession = () => {
    const userString = sessionStorage.getItem('user');
    if (userString === null) return;
    const sessionUser = JSON.parse(userString)
    return sessionUser;
};

export const handleUpdateUserExpenseSession = (newValue: ExpenseData): User => {
    const userString = sessionStorage.getItem('user');
    if (userString === null) throw new Error('user not initiated');
    sessionStorage.setItem('user', JSON.stringify(nullUser));
    const parsedUser = JSON.parse(userString) as User
    const updatedUser = { ...parsedUser, expenses: [newValue, ...parsedUser.expenses] }
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser
};

export const handleDeleteUserExpenseSession = (expense: ExpenseData): User => {
    const userString = sessionStorage.getItem('user');
    if (userString === null) throw new Error('user not initiated');
    sessionStorage.setItem('user', JSON.stringify(nullUser));
    const parsedUser = JSON.parse(userString) as User
    const existingExpenses = parsedUser.expenses

    const updatedUser = { ...parsedUser, expenses: [...existingExpenses.filter((exp) => exp.id !== expense.id)] }
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser
};

export const handleLogout = async () => {
    sessionStorage.setItem('user', JSON.stringify(nullUser));
    const { error } = await supabase.auth.signOut();
    return error;
};

export const handleGetUserById = async (userId: string): Promise<User> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error) throw new Error('cannot find user')
    return data;
};
