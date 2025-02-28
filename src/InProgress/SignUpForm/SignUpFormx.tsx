import { Button, Text, TextInput } from "@mantine/core";

const SignUpForm = ({open}:{open:boolean}) => {
        return (
            <form
                style={{ 
                    maxHeight: open ? "250px" : "0px",
                }}
                className=" shadow-[0px_-10px_20px_rgba(0,0,0,0.5)] hidden max-md:block absolute bg-[#0C1D1A] bottom-0 w-screen overflow-hidden h-full transition-[max-height] duration-300 ease-linear rounded-t-xl"
                // onSubmit={handleLogin}
            >
                <div className="flex flex-col p-3 gap-2 items-center">
                    <Text size="lg">Sign Up</Text>
                    <div className="flex gap-5">
                        <div>
                                <TextInput labelProps={{color:'white'}} color="white" label="Name" size="sm" 
                                        placeholder="enter username.."
                                        // value={signUpCreds.username}
                                        // onChange={(e) =>
                                        //     setSignUpCreds({ ...signUpCreds, username: e.target.value })
                                        // }
                                />
                                <TextInput labelProps={{color:'white'}} color="white" label="Email" size="sm" 
                                        placeholder="enter email.."
                                        // value={signUpCreds.email}
                                        // onChange={(e) =>
                                        //     setSignUpCreds({ ...signUpCreds, email: e.target.value })
                                        // }
                                />
                        </div>
                        <div>
                                <TextInput placeholder="password.." color="white" label="Password" size="sm"
                                        //     value={signUpCreds.password}
                                        //     onChange={(e) =>
                                        //         setSignUpCreds({ ...signUpCreds, password: e.target.value })
                                        //     }
                                />
                                <TextInput placeholder="password.." color="white" label="Confirm Password" size="sm"
                                        //     value={signUpCreds.confirmPassword}
                                        //     onChange={(e) =>
                                        //         setSignUpCreds({
                                        //             ...signUpCreds,
                                        //             confirmPassword: e.target.value,
                                        //         })
                                        //     }
                                />
                        </div>
                    </div>
                    <Button className="mt-2" radius="xs" size="sm" variant="default" color="grey"
                    //  type="submit"
                     >Submit</Button>
                </div>
                </form>
        )
}

export default SignUpForm;