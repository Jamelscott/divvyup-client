import React, { useRef, useState } from "react";

import { Dock, DockIcon } from "@/components/magicui/dock";
import navOptions from "./navData";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { expireFriends, selectFriends } from "@/slices/friendsSlice";
import { logoutUser } from "@/slices/userSlice";
import { AppDispatch } from "@/utils/store";
import './flatingNav.css'
import { Button } from "@mantine/core";

type IconProps = React.HTMLAttributes<SVGElement>;

export function FloatingNav() {
        const [hoverText, setHoverText] = useState<string>('')
        const navigate = useNavigate();
        const dispatch = useDispatch<AppDispatch>();
        const location = useLocation();
        const friends = useSelector(selectFriends)
        const [_selected, setSelected] = useState<string>(location.pathname)
        const ele = useRef<any>()
        const [hide, setHide] = useState(true)

        const handleMouseEnter = () => {
                if (hide) {
                        ele.current.style.bottom = '0'
                }
                setHide(false)
        }

        const handleMouseExit = () => {
                if (!hide) {
                        ele.current.style.bottom = '-100px'
                }
                setHide(true)

        }

        const logout = async () => {
                await dispatch(logoutUser())
                dispatch(expireFriends())
                navigate('/login')
                console.log('user logged out');
                return
        };
        const options = navOptions.map((option) => {
                if (option.id === 'friends' && friends.length === 0) return <></>
                if (option.id === 'analytics' && friends.length === 0) return <></>
                const name = option.id
                const Component = Icons[option.id]
                const hoverString = name.charAt(0).toUpperCase() + name.slice(1);
                const handleOnClick = () => {
                        if (option.id === 'logout') {
                                (async () => logout())()
                                navigate('/')
                                return
                        } else {
                                setSelected(option.route as string)
                                navigate(`${option.route}`)
                        }
                        setHide(true)
                }
                return (
                        <DockIcon key={option.id}>
                                <div onClick={handleOnClick} onMouseEnter={() => setHoverText(hoverString)} style={hoverText === hoverString ? { backgroundColor: '#EAEAEA', border: '10px solid #EAEAEA', borderRadius: 100 } : {}}>
                                        <Component className={`size-6`} />
                                </div>
                        </DockIcon>
                )
        })

        return (
                <div>
                        <div
                                ref={ele}
                                style={{ transition: '.5s' }}
                                onMouseOver={() => handleMouseEnter()}
                                onMouseLeave={() => {
                                        handleMouseExit()
                                        setHoverText('')
                                        return
                                }}
                                className="floating-nav-container"
                        >
                                <Dock key={1} magnification={80} direction="middle">
                                        {options}
                                </Dock>
                        </div>
                        <div style={{
                                position: 'fixed',
                                bottom: '-45px',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                marginTop: '100px',
                                width: '200px',
                                height: '50px',
                                textAlign: 'center',
                                zIndex: 9999
                        }}>
                                <div>

                                        {hoverText}
                                </div>
                                <Button size="sm" style={{ height: '22px' }} onMouseOver={() => handleMouseEnter()} onMouseLeave={() => handleMouseExit()}>
                                        Nav
                                </Button>
                        </div>
                </div>
        );
}

export const Icons = {
        home: (props: IconProps) => (
                <svg {...props} width="150px" height="150px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.35 19.0001C9.35 19.4143 9.68579 19.7501 10.1 19.7501C10.5142 19.7501 10.85 19.4143 10.85 19.0001H9.35ZM10.1 16.7691L9.35055 16.7404C9.35018 16.75 9.35 16.7595 9.35 16.7691H10.1ZM12.5 14.5391L12.4736 15.2886C12.4912 15.2892 12.5088 15.2892 12.5264 15.2886L12.5 14.5391ZM14.9 16.7691H15.65C15.65 16.7595 15.6498 16.75 15.6495 16.7404L14.9 16.7691ZM14.15 19.0001C14.15 19.4143 14.4858 19.7501 14.9 19.7501C15.3142 19.7501 15.65 19.4143 15.65 19.0001H14.15ZM10.1 18.2501C9.68579 18.2501 9.35 18.5859 9.35 19.0001C9.35 19.4143 9.68579 19.7501 10.1 19.7501V18.2501ZM14.9 19.7501C15.3142 19.7501 15.65 19.4143 15.65 19.0001C15.65 18.5859 15.3142 18.2501 14.9 18.2501V19.7501ZM10.1 19.7501C10.5142 19.7501 10.85 19.4143 10.85 19.0001C10.85 18.5859 10.5142 18.2501 10.1 18.2501V19.7501ZM9.5 19.0001V18.2501C9.4912 18.2501 9.4824 18.2502 9.4736 18.2505L9.5 19.0001ZM5.9 15.6541H5.15C5.15 15.6635 5.15018 15.673 5.15054 15.6825L5.9 15.6541ZM6.65 8.94807C6.65 8.53386 6.31421 8.19807 5.9 8.19807C5.48579 8.19807 5.15 8.53386 5.15 8.94807H6.65ZM3.0788 9.95652C2.73607 10.1891 2.64682 10.6555 2.87944 10.9983C3.11207 11.341 3.57848 11.4302 3.9212 11.1976L3.0788 9.95652ZM6.3212 9.56863C6.66393 9.336 6.75318 8.86959 6.52056 8.52687C6.28793 8.18415 5.82152 8.09489 5.4788 8.32752L6.3212 9.56863ZM5.47883 8.3275C5.13609 8.5601 5.04682 9.02651 5.27942 9.36924C5.51203 9.71198 5.97844 9.80125 6.32117 9.56865L5.47883 8.3275ZM11.116 5.40807L10.7091 4.77804C10.7043 4.78114 10.6995 4.78429 10.6948 4.7875L11.116 5.40807ZM13.884 5.40807L14.3052 4.7875C14.3005 4.78429 14.2957 4.78114 14.2909 4.77804L13.884 5.40807ZM18.6788 9.56865C19.0216 9.80125 19.488 9.71198 19.7206 9.36924C19.9532 9.02651 19.8639 8.5601 19.5212 8.3275L18.6788 9.56865ZM14.9 18.2501C14.4858 18.2501 14.15 18.5859 14.15 19.0001C14.15 19.4143 14.4858 19.7501 14.9 19.7501V18.2501ZM15.5 19.0001L15.5264 18.2505C15.5176 18.2502 15.5088 18.2501 15.5 18.2501V19.0001ZM19.1 15.6541L19.8495 15.6825C19.8498 15.673 19.85 15.6635 19.85 15.6541L19.1 15.6541ZM19.85 8.94807C19.85 8.53386 19.5142 8.19807 19.1 8.19807C18.6858 8.19807 18.35 8.53386 18.35 8.94807H19.85ZM21.079 11.1967C21.4218 11.4293 21.8882 11.3399 22.1207 10.9971C22.3532 10.6543 22.2638 10.1879 21.921 9.9554L21.079 11.1967ZM19.521 8.3274C19.1782 8.09487 18.7119 8.18426 18.4793 8.52705C18.2468 8.86984 18.3362 9.33622 18.679 9.56875L19.521 8.3274ZM10.85 19.0001V16.7691H9.35V19.0001H10.85ZM10.8495 16.7977C10.8825 15.9331 11.6089 15.2581 12.4736 15.2886L12.5264 13.7895C10.8355 13.73 9.41513 15.0497 9.35055 16.7404L10.8495 16.7977ZM12.5264 15.2886C13.3911 15.2581 14.1175 15.9331 14.1505 16.7977L15.6495 16.7404C15.5849 15.0497 14.1645 13.73 12.4736 13.7895L12.5264 15.2886ZM14.15 16.7691V19.0001H15.65V16.7691H14.15ZM10.1 19.7501H14.9V18.2501H10.1V19.7501ZM10.1 18.2501H9.5V19.7501H10.1V18.2501ZM9.4736 18.2505C7.96966 18.3035 6.70648 17.1294 6.64946 15.6257L5.15054 15.6825C5.23888 18.0125 7.19612 19.8317 9.5264 19.7496L9.4736 18.2505ZM6.65 15.6541V8.94807H5.15V15.6541H6.65ZM3.9212 11.1976L6.3212 9.56863L5.4788 8.32752L3.0788 9.95652L3.9212 11.1976ZM6.32117 9.56865L11.5372 6.02865L10.6948 4.7875L5.47883 8.3275L6.32117 9.56865ZM11.5229 6.0381C12.1177 5.65397 12.8823 5.65397 13.4771 6.0381L14.2909 4.77804C13.2008 4.07399 11.7992 4.07399 10.7091 4.77804L11.5229 6.0381ZM13.4628 6.02865L18.6788 9.56865L19.5212 8.3275L14.3052 4.7875L13.4628 6.02865ZM14.9 19.7501H15.5V18.2501H14.9V19.7501ZM15.4736 19.7496C17.8039 19.8317 19.7611 18.0125 19.8495 15.6825L18.3505 15.6257C18.2935 17.1294 17.0303 18.3035 15.5264 18.2505L15.4736 19.7496ZM19.85 15.6541V8.94807H18.35V15.6541H19.85ZM21.921 9.9554L19.521 8.3274L18.679 9.56875L21.079 11.1967L21.921 9.9554Z" fill="#4650a0"></path> </g></svg>
        ),
        profile: (props: IconProps) => (
                <svg {...props} fill="#CE2D4F" height="100px" width="100px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 491.521 491.521" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M442.646,48.877c-65.167-65.168-170.821-65.168-235.986-0.002c-60.305,60.306-64.686,155.227-13.375,220.704l-21.8,21.801 c-10.598-8.148-20.225-12.812-24.028-9.009l-18.393,18.392l61.696,61.694l18.392-18.391c3.802-3.804-0.861-13.431-9.009-24.028 l21.801-21.801c65.477,51.312,160.398,46.932,220.705-13.374C507.812,219.697,507.812,114.042,442.646,48.877z M235.119,77.338 c49.368-49.368,129.701-49.371,179.068-0.003c22.461,22.46,34.585,51.336,36.608,80.782h-89.477l-9.871-30.836 c-1.084-3.375-4.304-5.884-7.827-5.504c-3.546,0.124-6.581,2.586-7.424,6.039l-21.856,89.272l-30.558-104.516 c-0.89-3.043-3.499-5.257-6.635-5.644c-3.143-0.41-6.217,1.115-7.811,3.855l-27.786,47.326h-43.038 C200.536,128.667,212.661,99.797,235.119,77.338z M414.184,256.403c-49.369,49.369-129.693,49.364-179.061-0.004 c-22.881-22.881-35.018-52.417-36.69-82.434h47.654c2.81,0,5.411-1.487,6.836-3.918l20.795-35.412l33.693,115.247 c0.991,3.391,4.095,5.706,7.61,5.706c0.054,0,0.116,0,0.178,0c3.584-0.085,6.665-2.563,7.525-6.046l22.188-90.651l3.066,9.569 c1.045,3.282,4.103,5.513,7.549,5.513h95.345C449.198,203.988,437.063,233.524,414.184,256.403z"></path> </g> </g> <g> <g> <path d="M148.064,351.473l-34.855-34.854L1.541,428.286c-6.528,6.529,8.737,27.693,25.944,43.764 c14.452,13.498,30.268,23.413,35.751,17.932l111.667-111.669L148.064,351.473z"></path> </g> </g> </g></svg>
        ),
        friends: (props: IconProps) => (
                <svg {...props} height="100px" width="100px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 28.832 28.832" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style={{ fill: '#28AFB0' }} d="M11.98,5.373c0-1.584,1.284-2.869,2.869-2.869s2.869,1.284,2.869,2.869s-1.284,2.869-2.869,2.869 S11.98,6.957,11.98,5.373z M15.716,15.621c0.616-0.658,1.479-1.075,2.575-1.245c0.249-0.038,0.513-0.061,0.786-0.077 c0.088-0.003,0.171-0.012,0.259-0.012h1.707c-1.253-0.521-2.141-1.761-2.141-3.203c0-0.575,0.143-1.12,0.394-1.596 c-0.89-0.325-1.711-0.32-1.711-0.32h-5.753c-0.643,0.015-1.183,0.096-1.636,0.23c0.281,0.5,0.442,1.076,0.442,1.686 c0,1.442-0.887,2.681-2.142,3.203h1.412c0.017-0.002,0.033-0.002,0.051-0.002c0.1,0,0.209,0.004,0.319,0.012 c0.235,0.017,0.492,0.053,0.758,0.107c1.444,0.303,3.186,1.253,3.379,3.527l0.002,0.051v1.774h0.362l0.002-1.774 C14.779,17.957,14.729,16.675,15.716,15.621z M6.993,13.983c1.582,0,2.869-1.287,2.869-2.871S8.575,8.243,6.993,8.243 c-1.584,0-2.869,1.285-2.869,2.869C4.124,12.695,5.41,13.983,6.993,13.983z M9.728,14.908H3.976 c-4.118,0.076-3.975,3.103-3.975,3.103L0,25.067h0.004c0,0.017-0.003,0.035-0.003,0.05c0,0.67,0.545,1.211,1.213,1.211 c0.669,0,1.209-0.541,1.209-1.211c0-0.016-0.002-0.033-0.005-0.05h0.005v-6.532h0.758l-0.006,6.958l7.266,0.006l-0.006-6.996h0.786 v6.563h0.004c0,0.003,0,0.006,0,0.01c0,0.669,0.541,1.211,1.207,1.211c0.669,0,1.211-0.542,1.211-1.211c0-0.004,0-0.007,0-0.01 V18.01C13.378,14.861,9.728,14.908,9.728,14.908z M22.185,13.982c1.585,0,2.87-1.285,2.87-2.87s-1.285-2.87-2.87-2.87 s-2.87,1.285-2.87,2.87C19.316,12.697,20.6,13.982,22.185,13.982z M24.921,14.908h-5.754c-4.119,0.076-3.973,3.103-3.973,3.103 l-0.002,7.056h0.005c0,0.017-0.003,0.035-0.003,0.05c0,0.67,0.544,1.211,1.212,1.211c0.669,0,1.208-0.541,1.208-1.211 c0-0.016-0.003-0.033-0.004-0.05h0.004v-6.532h0.76l-0.009,6.958l7.266,0.006l-0.006-6.996h0.786v6.563h0.002 c0,0.003,0,0.006,0,0.01c0,0.669,0.542,1.211,1.21,1.211c0.667,0,1.209-0.542,1.209-1.211c0-0.004,0-0.007,0-0.01V18.01 C28.57,14.861,24.921,14.908,24.921,14.908z"></path> </g> </g></svg>
        ),
        analytics: (props: IconProps) => (
                <svg {...props} width="133px" height="133px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 8.5C14.5 9.88071 13.3807 11 12 11C10.6193 11 9.5 9.88071 9.5 8.5C9.5 7.11929 10.6193 6 12 6C13.3807 6 14.5 7.11929 14.5 8.5Z" fill="#6BAB90"></path> <path d="M15.5812 16H8.50626C8.09309 16 7.87415 15.5411 8.15916 15.242C9.00598 14.3533 10.5593 13 12.1667 13C13.7899 13 15.2046 14.3801 15.947 15.2681C16.2011 15.5721 15.9774 16 15.5812 16Z" fill="#6BAB90" stroke="#6BAB90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <circle cx="12" cy="12" r="10" stroke="#6BAB90" strokeWidth="2"></circle> </g></svg>
        ),
        logout: (props: IconProps) => (
                <svg fill="#000000" width="126px" height="126px" viewBox="0 0 24 24" id="sign-out-2" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" className="icon line-color" {...props} ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><polyline id="secondary" points="18 9 21 12 18 15" style={{ fill: 'none', stroke: '#ba2c2c', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }}></polyline><line id="secondary-2" data-name="secondary" x1="21" y1="12" x2="7" y2="12" style={{ fill: 'none', stroke: '#ba2c2c', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }}></line><path id="primary" d="M14,16v3a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V5A1,1,0,0,1,4,4h9a1,1,0,0,1,1,1V8" style={{ fill: 'none', stroke: '#ba2c2c', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }}></path></g></svg>
        ),
}