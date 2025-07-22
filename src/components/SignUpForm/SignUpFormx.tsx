import { selectUser } from "@/slices/userSlice";
import { UserSignUp } from "@/types.d";
import { handleSignUpSubmit } from "@/utils/userHelpers";
import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ open, mobile }: { open: boolean; mobile: boolean }) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const ref = useRef<HTMLInputElement>(null);
  const [signUpCreds, setSignUpCreds] = useState<UserSignUp>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validSignUp = await handleSignUpSubmit(
      signUpCreds.username,
      signUpCreds.email,
      signUpCreds.password,
      signUpCreds.confirmPassword,
      user
    );
    if (validSignUp) {
      navigate("/home");
    }
  };

  if (user.id) {
    navigate("/home");
  }
  const canSubmit =
    !!signUpCreds.username.charAt(3) &&
    !!signUpCreds.password.charAt(4) &&
    !!signUpCreds.email.charAt(4) &&
    !!signUpCreds.confirmPassword.charAt(4) &&
    signUpCreds.password === signUpCreds.confirmPassword;

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [open]);

  return (
    <form
      style={{
        maxHeight: open ? "420px" : "0px",
      }}
      className={`rounded-t-xl ${
        mobile &&
        "shadow-[0px_-10px_20px_rgba(0,0,0,0.5)] max-md:block absolute w-screen right-0 bottom-0 overflow-hidden h-full transition-[max-height] duration-300 ease-linear"
      }`}
      onSubmit={signUpSubmit}
    >
      <div
        className={`flex flex-col ${
          mobile && "bg-[#0F2424] p-6"
        } gap-2 items-start`}
      >
        <div className="flex justify-center w-full">
          {mobile && <Text size="lg">Enter your account details</Text>}
        </div>
        <TextInput
          ref={ref}
          className="w-[100%]"
          labelProps={{ color: "white" }}
          color="white"
          label="Your username"
          size="md"
          value={signUpCreds.username}
          onChange={(e) =>
            setSignUpCreds({ ...signUpCreds, username: e.target.value })
          }
        />
        <TextInput
          className="w-[100%]"
          labelProps={{ color: "white" }}
          color="white"
          label="Your email"
          size="md"
          value={signUpCreds.email}
          onChange={(e) =>
            setSignUpCreds({ ...signUpCreds, email: e.target.value })
          }
        />
        <PasswordInput
          className="w-[100%]"
          color="white"
          label="Enter a password"
          size="md"
          value={signUpCreds.password}
          onChange={(e) =>
            setSignUpCreds({ ...signUpCreds, password: e.target.value })
          }
        />
        <PasswordInput
          className="w-[100%]"
          color="white"
          label="Confirm password"
          size="md"
          value={signUpCreds.confirmPassword}
          onChange={(e) =>
            setSignUpCreds({
              ...signUpCreds,
              confirmPassword: e.target.value,
            })
          }
        />
        <Button
          disabled={!canSubmit}
          className="mt-2"
          radius="xs"
          size="sm"
          variant="default"
          color="grey"
          type="submit"
        >
          Finish
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
