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
                    notifications.show(errorNotification('Failed to login','login info is incorrect'))
                    return undefined
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
                    notifications.show(errorNotification('Failed to login','login info is incorrect'))
                    throw undefined
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
export const handleRemoveFriend = async (userId: string, friendId:string) => {
    // First delete operation
    const { error: error1 } = await supabase
    .from('friends')
    .delete()
    .eq('requester_uuid', userId)
    .eq('requestee_uuid', friendId);

    // Second delete operation
    const { error: error2 } = await supabase
        .from('friends')
        .delete()
        .eq('requester_uuid', friendId)
        .eq('requestee_uuid', userId); 
    if (error2 || error1) throw new Error('cannot remove friend')
};

export const handleSignUpSubmit = async (username:string, email:string, password:string, confirmPassword:string, user:User) => {
    if (user.id) {
        console.log(user)
        notifications.show(errorNotification('Erorr','refresh the window'))
        return false
    }
    if (!username || username.split('').length < 4) {
        notifications.show(errorNotification('invalid username','username must be at least 4 characters'))
        return false;
    }
    if (!email || email.split('@')[0].length < 4) {
        notifications.show(errorNotification('invalid email','input a valid email'))
        return false;
    }
    if (password.length < 5) {
        notifications.show(errorNotification('invalid password','password must be at least 5 characters'))
        return false;
    }
    if (password !== confirmPassword) {
        notifications.show(errorNotification('invalid confirmation','passwords do not match'))
        return false;
    }
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username.toLowerCase(),
                },
            },
        });
        if (error) {
            if (error.message === 'duplicate key value violates unique constraint "profiles_username_key"') {
                console.log('error: ', error);
                notifications.show(errorNotification('invalid username','that username already exists'))
                return false;
            } else {
                notifications.show(errorNotification('Unknown error', error.message))
                return false;
            }
        }
        if (data.user === null) {
            notifications.show(errorNotification('login error','user not found, returning null from server'))
            return false
        }
        if (data.user.email === undefined) {
            notifications.show(errorNotification('login error','user email not found, returning null from server'))
            return false
        }
        const newUser = userBuilder(data.user as any);
        console.log(newUser);
        return true
};