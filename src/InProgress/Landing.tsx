import { Button, PasswordInput, Popover, TextInput } from "@mantine/core"

import holdingApp from "../../public/holdingApp.png"
import googlePlayIcon from "../../public/googlePlayButton.png"
import appStoreIcon from "../../public/appStoreButton.png"
import progressiveIcon from "../../public/pwa.png"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import LoginForm from "./LoginForm/LoginForm"
import SignUpForm from "./SignUpForm/SignUpFormx.tsx"
import Login from "@/components/Login/Login.tsx"

const Landing = () => {
	const [visible, { toggle }] = useDisclosure(false);
	const [visibleConfirm, { toggle:toggleConfirm }] = useDisclosure(false);
	const [openSignUp, setOpenSignUp] = useState(true)
	const [openLogin, setOpenLogin] = useState(false)

        return (
			<>
			<div onClick={()=> {
				openSignUp && setOpenSignUp(false)
				openLogin && setOpenLogin(false)
			}} style={{color:'white'}} className="p-10 pb-0 px-40 max-xl:px-8 flex flex-col min-w-sm">
				<div className="flex justify-between">
					<div className="text-5xl">
							<h1 style={{fontFamily:'Trispace'}} className="text-white font-light">
								BILLY
							</h1>
					</div>
					<div style={{fontFamily:'montserrat'}}  className="items-center justify-end gap-5">
						<div className="hidden md:flex gap-5">
							<Popover 
								width={300}
								trapFocus
								arrowSize={15}
								position="bottom-start"
								withArrow
								arrowPosition="center"
								offset={10}
							>
								<Popover.Target>
									<Button radius="xs" size="sm" variant="outline" color="white"><span style={{fontSize:'14px'}}>Login</span></Button>
								</Popover.Target>
								<Popover.Dropdown className="hidden md:block" bg="rgba(0, 0, 0, 0.1)">
									<div className="flex flex-col gap-2">
										<TextInput labelProps={{color:'white'}} color="white" label="Name" placeholder="Name" size="sm" />
										<TextInput color="white" label="Email" placeholder="john@doe.com" size="sm"/>
										<Button className="mt-2" radius="xs" size="sm" variant="default" color="grey"><span style={{fontSize:'14px'}}>Submit</span></Button>
									</div>
								</Popover.Dropdown>
							</Popover>			
							<Popover 
								width={300}
								trapFocus
								arrowSize={15}
								position="bottom-start"
								withArrow
								arrowPosition="center"
								offset={10}
							>
								<Popover.Target>
								<Button radius="xs" size="sm" color="#11B5E4"><span style={{fontSize:'14px'}}>Sign Up</span></Button>
								</Popover.Target>
								<Popover.Dropdown className="hidden md:block" bg="rgba(0, 0, 0, 0.1)" variant="outline">
									<div className="flex flex-col gap-2 ">
										{/* <div className="flex gap-4"> */}
											<div className="w-full">
												<TextInput labelProps={{color:'white'}} color="white" label="Username" placeholder="Username" size="sm" />
											</div>
											<div className="w-full">
												<TextInput color="white" label="Email" placeholder="john@doe.com" size="sm" />
											</div>
										{/* </div> */}
										{/* <div className="flex gap-4"> */}
											<div className="w-full">
												<PasswordInput
													label="Password"
													placeholder="Password"
													size="sm"
													color="white"
													visible={visible}
													onVisibilityChange={toggle}
													width={'100%'}
												/>
											</div>
											<div className="w-full">
												<PasswordInput
													label="Confirm Password"
													placeholder="Confirm Password"
													size="sm"
													color="white"
													visible={visibleConfirm}
													onVisibilityChange={toggleConfirm}
												/>
											</div>
										{/* </div> */}
										{/* <div className="mt-2"> */}
											<Button className="mt-2" radius="xs" size="sm" variant="default" color="grey"><span style={{fontSize:'14px'}}>Submit</span></Button>
										{/* </div> */}
									</div>
								</Popover.Dropdown>
							</Popover>										
						</div>
					</div>
				</div>
				<div className="flex justify-start gap-20 max-lg:flex-col max-xlg:items-start lg:mt-[150px] min-h-[450px]">
					<div className="flex flex-col gap-5 pt-20 ">
						<div className="text-7xl max-xl:text-6xl">
							<p style={{fontFamily:'Exo', paddingBottom:'10px'}}>
								Split bills, 
							</p>
							<p style={{fontFamily:'Exo'}}>
								Stay friends.  
							</p>
						</div>
						<div style={{fontFamily:'montserrat'}} className="text-lg">
							<p>From rent to dinner, Billy makes splitting costs<br/> simple and hassle-free.</p>
						</div>
						<div className="hidden max-md:flex gap-5">
							<Button onClick={()=> setOpenLogin(prev => !prev)} radius="xs" size="md" variant="outline" color="white"><span style={{fontSize:'14px'}}>Login</span></Button>
							<Button onClick={()=> setOpenSignUp(prev => !prev)} radius="xs" size="md" color="#11B5E4"><span style={{fontSize:'14px'}}>Sign Up</span></Button>
						</div>
						{/* <div className="flex max-w-xs cursor-pointer max-xl:items-center">
							<Button radius="xs" size="xl" color="#11B5E4" fullWidth><span style={{fontSize:'14px'}}>Get Billy for free</span></Button>
						</div> */}
						<div className="mt-10">
							<p className="font-semibold">download the app:</p>
						</div>
						<div className="flex gap-5 flex-wrap">
							<img className="cursor-pointer transition-transform duration-50 active:translate-y-1" src={googlePlayIcon}/>
							<img className="cursor-pointer transition-transform duration-50 active:translate-y-1" src={appStoreIcon} />
							<img className="cursor-pointer transition-transform duration-50 active:translate-y-1" src={progressiveIcon}/>
						</div>
					</div>
					<div className="hidden md:flex flex-1 flex justify-center max-w-[500px]">
						<img src={holdingApp} />
					</div>
				</div>
			</div>
                	<SignUpForm open={openSignUp} />
					<LoginForm open={openLogin} />
			</>
        )
}

export default Landing