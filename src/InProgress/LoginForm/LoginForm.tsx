import { Button, Text, TextInput } from "@mantine/core";

const LoginForm = ({open}:{open:boolean}) => {
        return (
            <form
                style={{ 
                    maxHeight: open ? "250px" : "0px",
                }}
                className=" shadow-[0px_-10px_20px_rgba(0,0,0,0.5)] hidden max-md:block absolute bg-[#0C1D1A] bottom-0 w-screen overflow-hidden h-full transition-[max-height] duration-300 ease-linear rounded-t-xl"
                // onSubmit={handleLogin}
            >
                <div className="flex flex-col p-3 gap-2 items-center">
                    <Text size="lg">Login</Text>
                    <TextInput labelProps={{color:'white'}} color="white" label="Name" size="sm" 
                        placeholder="username or email.."
                        // value={loginCreds.usernameOrEmail}
                        // onChange={(e) =>
                        //     setLoginCreds({ ...loginCreds, usernameOrEmail: e.target.value })
                        // }
                    />
                    <TextInput placeholder="username or email.." color="white" label="Email" size="sm"
                        // value={loginCreds.usernameOrEmail}
                        // onChange={(e) =>
                        //     setLoginCreds({ ...loginCreds, usernameOrEmail: e.target.value })
                        // }
                    />
                    <Button className="mt-2" radius="xs" size="sm" variant="default" color="grey"
                    //  type="submit"
                     >Submit</Button>
                </div>
                </form>
        )
}

export default LoginForm;