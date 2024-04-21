import { supabase } from '../../utils/supabase';
import { UserLogin, UserSignUp, SignUpError, User } from './types';
import { User as supaUser } from '@supabase/supabase-js';

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
    const signedInUser = userBuilder(data.user);
    sessionStorage.setItem('user', JSON.stringify(signedInUser));
    return signedInUser;
}

export async function loginEmailOrUsername(loginCreds: UserLogin): Promise<User | undefined> {
    const { usernameOrEmail, password } = loginCreds;
    if (usernameOrEmail && password) {
        const isEmail = usernameOrEmail.includes('@');

        if (isEmail) {
            try {
                const response = await supabase.auth.signInWithPassword({ email: usernameOrEmail, password: password });
                if (response.error) throw response.error;
                if (response.data.user) {
                    const signedInUser = userBuilder(response.data.user);
                    sessionStorage.setItem('user', JSON.stringify(signedInUser));
                    return signedInUser;
                }
            } catch (error) {
                throw new Error(`Error: ${error}`);
            }
        } else {
            try {
                const { data, error } = await supabase.from('profiles').select('email').eq('username', usernameOrEmail);
                if (error) throw error;
                if (data) {
                    const response = await supabase.auth.signInWithPassword({ email: data[0].email, password: password });
                    if (response.error) throw response.error;

                    if (response.data.user) {
                        const signedInUser = userBuilder(response.data.user);
                        sessionStorage.setItem('user', JSON.stringify(signedInUser));
                        return signedInUser;
                    } else {
                        throw new Error('user not found - made a typo?');
                    }
                } else throw 'User data not available';
            } catch (error) {
                throw new Error(`Error: ${error}`);
            }
        }
    }
}

export function userBuilder(user: supaUser): User {
    if (!user.id) throw new Error('User data is empty?');
    if (user.email === undefined) throw new Error('User email data is undefined?');
    const expenses = user.user_metadata.expenses ? [...user.user_metadata.expenses] : [];
    const builtUser: User = {
        id: user.id,
        username: user.user_metadata.username,
        email: user.email,
        expenses: expenses
    };

    return builtUser;
}

export const handleGetUser = async () => {
    const { data: gotUser, error } = await supabase.auth.getUser();
    gotUser ? console.log(gotUser) : console.log(error);
};

export const handleUserSession = () => {
    const potentialUserString = sessionStorage.getItem('user');
    const potentialUser = potentialUserString !== null ? JSON.parse(potentialUserString) : {
        id: '',
        username: '',
        email: '',
        expenses: []
    };

    return potentialUser;
};

export const handleLogout = async () => {
    sessionStorage.setItem('user', JSON.stringify(nullUser));
    const { error } = await supabase.auth.signOut();
    return error;
};
