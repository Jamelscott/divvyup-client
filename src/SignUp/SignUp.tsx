import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import './signup.css'

function SignUp({user, setUser}: any) {
  const [signUpCreds, setSignUpCreds] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");
    e.preventDefault();
    if (!signUpCreds.username || signUpCreds.username.split("").length < 4) {
      setError("invalid username, must be more then 3 characters");
      return
    }
    if (!signUpCreds.email || signUpCreds.email.split("@")[0].length < 4) {
      setError("invalid email");
      return
    }
    if (signUpCreds.password.length < 5) {
      setError("invalid password, must be at least 5 characeters");
      return
    }
    if (signUpCreds.password !== signUpCreds.confirmPassword) {
      setError("passwords do not match");
      return
    }
    if (!user) {
      let { data: user, error } = await supabase.auth.signUp({
          email: signUpCreds.email,
          password: signUpCreds.password,
          options:{
            data: {
              name: signUpCreds.username
            }
          }
          })
      if (error) {
        setError('User is already signed up')
        return console.log('User is signed up')
      }
      setUser(user)
      console.log(user)
  }

  };

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
        <p className="loginText">Sign up</p>
        {error ? <p className="errorText">{error}</p> : <></>}
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
      </div>
    </>
  );
}

export default SignUp;
