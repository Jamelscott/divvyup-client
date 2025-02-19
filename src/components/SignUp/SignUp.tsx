import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../../supabase';
import './signup.css';
import { UserSignUp } from '../../types';
import { userBuilder } from '../../utils/userHelpers';
import { NeonGradientCard } from '../magicui/neon-gradient-card';
import { useSelector } from 'react-redux';
import { selectUser } from '@/slices/userSlice';

function SignUp() {
    const navigate = useNavigate();
    const user = useSelector(selectUser)
    const [signUpCreds, setSignUpCreds] = useState<UserSignUp>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string>('');

    const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError('');
        e.preventDefault();
        if (!signUpCreds.username || signUpCreds.username.split('').length < 4) {
            setError('invalid username, must be more then 3 characters');
            return;
        }
        if (!signUpCreds.email || signUpCreds.email.split('@')[0].length < 4) {
            setError('invalid email');
            return;
        }
        if (signUpCreds.password.length < 5) {
            setError('invalid password, must be at least 5 characeters');
            return;
        }
        if (signUpCreds.password !== signUpCreds.confirmPassword) {
            setError('passwords do not match');
            return;
        }
        if (!user || !user.id) {
            const { data, error } = await supabase.auth.signUp({
                email: signUpCreds.email,
                password: signUpCreds.password,
                options: {
                    data: {
                        username: signUpCreds.username.toLowerCase(),
                    },
                },
            });
            if (error) {
                if (error.message === 'duplicate key value violates unique constraint "profiles_username_key"') {
                    console.log('error: ', error);
                    setError('Username already in use');
                    return;
                } else {
                    console.log('error: ', error);
                    setError('User is already signed up');
                    return;
                }
            }
            if (data.user === null) {
                throw new Error('user not found, returning null from server');
            }
            if (data.user.email === undefined) {
                throw new Error('user email not found, returning null from server');
            }

            const newUser = userBuilder(data.user as any);
            console.log(newUser);
            navigate('/');
        }

    };

    return (
        <>
            <div style={{ width: '100%', marginTop: '200px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                <NeonGradientCard className="max-w-sm items-center justify-center text-center">

                    <p className="loginText signInText">Sign up</p>
                    <div className="errorTextContainer">
                        {error ? <p>{error}</p> : <></>}
                    </div>
                    <form
                        style={{
                            marginBottom: '0',
                            display: 'flex',
                            flexFlow: 'wrap',
                            flexDirection: 'column',
                            height: 'auto',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        className="list-form"
                        onSubmit={handleSignUpSubmit}
                    >
                        <input
                            className="login-input-field"
                            type="text"
                            placeholder="enter username.."
                            value={signUpCreds.username}
                            onChange={(e) =>
                                setSignUpCreds({ ...signUpCreds, username: e.target.value })
                            }
                        />
                        <input
                            className="login-input-field"
                            type="email"
                            placeholder="enter email.."
                            value={signUpCreds.email}
                            onChange={(e) =>
                                setSignUpCreds({ ...signUpCreds, email: e.target.value })
                            }
                        />
                        <input
                            className="login-input-field"
                            type="password"
                            placeholder="enter password.."
                            value={signUpCreds.password}
                            onChange={(e) =>
                                setSignUpCreds({ ...signUpCreds, password: e.target.value })
                            }
                        />
                        <input
                            className="login-input-field"
                            type="password"
                            placeholder="confirm password.."
                            value={signUpCreds.confirmPassword}
                            onChange={(e) =>
                                setSignUpCreds({
                                    ...signUpCreds,
                                    confirmPassword: e.target.value,
                                })
                            }
                        />
                        <input className="login-submit-button" type="submit" value="Submit" />
                    </form>
                    <hr className="whiteLine"></hr>
                    <p className="questionText">
                        already have an account? <br></br> Login <span> </span>
                        <Link className="link" to="/">
                            here
                        </Link>
                    </p>
                </NeonGradientCard>
            </div>
        </>
    );
}

export default SignUp;
