import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./login.css";
import { supabase } from "../../utils/supabase";

function Login({ user, setUser }: any) {
  console.log(user)
  const [loginCreds, setLoginCreds] = useState({
    name: "",
    password: "",
    email: ""
  });
  const [msg, setMsg] = useState("")

  const handleLogin = async (e: any) => {
    e.preventDefault()
    let { data, error }: any = await supabase.auth.signInWithPassword({
      email: loginCreds.email,
      password: loginCreds.email,
      })
    if (data.user !== null) {
      setUser(data)
      console.log('logged in', data)
    } else {
      console.log(error)
      setMsg('user is already logged in')
    }
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
        className="list-container"
      >
        <p className="loginText">Login</p>
        {msg ? <p className="loginErrorText">{msg}</p> : <></>}
        <form
          style={{
            marginBottom: "0",
            display: "flex",
            flexFlow: "wrap",
            flexDirection: "column",
            height: "auto",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="list-form"
          onSubmit={handleLogin}
        >
          <input
            className="login-input-field"
            type="text"
            placeholder="username.."
            value={loginCreds.name}
            onChange={(e) =>
              setLoginCreds({ ...loginCreds, name: e.target.value })
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
          <input disabled={user} className="login-submit-button" type="submit" value="Submit" />
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
          position: "relative",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          color: 'white'
        }}
        className="list-container"
      >
        <h4 className="loginText" style={{marginTop:0, marginBottom:0}}>Just visiting?</h4>
        <hr className="whiteLine"></hr>
        <p className="questionText">username: visitor </p>
        <p className="questionText">password: visitor </p>
      </div>
    </>
  );
}

export default Login;
