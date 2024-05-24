import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { loginEmailOrUsername } from '../utils/loginHelpers';
import { UserLogin } from '../types';
import { UserContext, UserContextType } from '../context/userContext';

function Login() {
    const { user, setUser, setUpdateContext } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();

    useEffect(() => {
        if (user.id) navigate('/');
    }, [navigate, user.id]);

    const [msg, setMsg] = useState('');
    const [loginCreds, setLoginCreds] = useState<UserLogin>({
        usernameOrEmail: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const loggedUser = await loginEmailOrUsername(loginCreds);

            if (!loggedUser) throw new Error('logged in user not found');

            if (loggedUser.username !== null) {
                setUpdateContext(true)
                setUser(loggedUser);
                console.log('logged in', loggedUser);
                navigate('/');
            } else {
                throw new Error();
            }
        } catch (err) {
            console.log(err);
            setMsg('user is already logged in');
        }
    };

    return (
        <>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                }}
                className="list-container"
            >
                <p className="loginText">Login</p>
                {msg ? <p className="loginErrorText">{msg}</p> : <></>}
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
                    <input className="login-submit-button" type="submit" value="Submit" />
                </form>
                <hr className="whiteLine"></hr>
                <p className="questionText">
                    don’t have an account? <br></br> Sign up <span> </span>
                    <Link className="link" to="/signup">
                        here
                    </Link>
                </p>
            </div>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                    color: 'white'
                }}
                className="list-container"
            >
                <h4 className="loginText" style={{ marginTop: 0, marginBottom: 0 }}>Just visiting?</h4>
                <hr className="whiteLine"></hr>
                <p className="questionText">username: visitor </p>
                <p className="questionText">password: visitor </p>
            </div>
        </>
    );
}

export default Login;
