import { getUser, selectUser } from "@/slices/userSlice";
import { UserLogin } from "@/types.d";
import { AppDispatch } from "@/utils/store";
import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DEFAULT_LOGINCREDS = {
  usernameOrEmail: "",
  password: "",
};

const LoginForm = ({
  open,
  setIsLoggingIn,
  setOpenLogin,
  mobile,
}: {
  open: boolean;
  setOpenLogin: (val: boolean) => void;
  setIsLoggingIn: (val: boolean) => void;
  mobile: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [loginCreds, setLoginCreds] = useState<UserLogin>(DEFAULT_LOGINCREDS);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      await dispatch(getUser(loginCreds));
      if (user.id) {
        setIsLoggingIn(false);
        navigate("/");
        setOpenLogin(false);
        setLoginCreds(DEFAULT_LOGINCREDS);
      } else {
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const canSubmit =
    !!loginCreds.usernameOrEmail.charAt(3) && !!loginCreds.password.charAt(4);
  return (
    <form
      style={{
        maxHeight: open ? "270px" : "0px",
      }}
      className={`rounded-t-xl ${
        mobile &&
        "shadow-[0px_-10px_20px_rgba(0,0,0,0.5)] max-md:block absolute w-screen max-w-[450px] right-0 bottom-0 overflow-hidden h-full transition-[max-height] duration-300 ease-linear"
      }`}
      onSubmit={handleLogin}
    >
      <div
        className={`flex flex-col ${
          mobile && "bg-[#0F2424] p-6"
        } gap-2 items-start`}
      >
        <div className="flex justify-center w-full">
          {mobile && <Text size="lg">Welcome back</Text>}
        </div>
        <div className="w-[100%]">
          <TextInput
            color="white"
            label="Username or Email"
            size="md"
            value={loginCreds.usernameOrEmail}
            onChange={(e) =>
              setLoginCreds({ ...loginCreds, usernameOrEmail: e.target.value })
            }
          />
        </div>
        <div className="w-[100%]">
          <PasswordInput
            label="Password"
            size="md"
            color="white"
            value={loginCreds.password}
            onChange={(e) =>
              setLoginCreds({ ...loginCreds, password: e.target.value })
            }
          />
        </div>
        <Button
          disabled={!canSubmit}
          className="mt-2"
          radius="xs"
          size="sm"
          variant="default"
          color="grey"
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
