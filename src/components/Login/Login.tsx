import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { UserLogin } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, selectUser } from '../../slices/userSlice';
import { AppDispatch } from '../../utils/store';
import { NeonGradientCard } from '../magicui/neon-gradient-card';
import SparklesText from '../magicui/sparkles-text';

function Login() {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector(selectUser)
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [loginCreds, setLoginCreds] = useState<UserLogin>({
        usernameOrEmail: '',
        password: '',
    });
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await dispatch(getUser(loginCreds));
            navigate('/');
        } catch (err) {
            console.log(err);
            setMsg('user is already logged in');
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [])

    return (
        <div style={{ width: '100%', marginTop: '200px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
            <NeonGradientCard className="max-w-sm items-center justify-center text-center">
                <SparklesText sparklesCount={8} className="loginText" text="DivvyUp" />
                {msg ? <p className="loginErrorText">{msg}</p> : <></>}
                <form
                    style={{
                        marginTop: '30px',
                        marginBottom: '0',
                        display: 'flex',
                        flexFlow: 'wrap',
                        flexDirection: 'column',
                        height: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    className="list-form"
                    onSubmit={handleLogin}
                >
                    <input
                        className="login-input-field"
                        type="text"
                        placeholder="username or email.."
                        value={loginCreds.usernameOrEmail}
                        onChange={(e) =>
                            setLoginCreds({ ...loginCreds, usernameOrEmail: e.target.value })
                        }
                    />
                    <input
                        className="login-input-field"
                        type="password"
                        placeholder="password.."
                        value={loginCreds.password}
                        onChange={(e) =>
                            setLoginCreds({ ...loginCreds, password: e.target.value })
                        }
                    />
                    <input className="login-submit-button" type="submit" value="Login" />
                </form>
                <hr className="whiteLine"></hr>
                <p className="questionText">
                    don’t have an account? <br></br> Sign up <span> </span>
                    <Link className="link" to="/signup">
                        here
                    </Link>
                </p>
            </NeonGradientCard>
            {/* <div style={{ position: 'absolute', left: '40px', bottom: "40px" }}>
                <NeonGradientCard className="max-w-sm items-center justify-center text-center">
                    <h4 className="loginTextTwo" style={{ marginTop: 0, marginBottom: 0 }}>Just visiting?</h4>
                    <hr className="whiteLine"></hr>
                    <p className="questionText">username: visitor </p>
                    <p className="questionText">password: visitor </p>
                </NeonGradientCard>
            </div> */}
        </div>
    );
}

export default Login;
