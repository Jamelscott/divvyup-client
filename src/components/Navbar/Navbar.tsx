import { useLocation, useNavigate } from 'react-router-dom';
import { handleLogout, handleUserSession } from '../../utils/loginHelpers';
import { User } from '../../types';
import { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../../context/userContext';
import './navbar.css'
import analyticsIcon from '../../../assets/navbarIcons/analytics-icon.svg'
import friendsIcon from '../../../assets/navbarIcons/friends-icon.svg'
import homeIcon from '../../../assets/navbarIcons/home-icon.svg'
import profileIcon from '../../../assets/navbarIcons/profile-icon.svg'
import logoutIcon from '../../../assets/navbarIcons/logout-icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { DataState, logoutUser, selectUser, selectUserState } from '../../slices/userSlice';
import { AppDispatch } from '../../utils/store';
import { expireFriends } from '../../slices/friendsSlice';

const navOptions = [
    {
        id: 'home',
        image: homeIcon,
        route: '/',
        active: false
    },
    {
        id: 'friends',
        image: friendsIcon,
        route: '/friends',
        active: false
    },
    {
        id: 'profile',
        image: profileIcon,
        route: '/profile',
        active: false
    },
    {
        id: 'analytics',
        image: analyticsIcon,
        route: '/analytics',
        active: false
    },
    {
        id: 'logout',
        image: logoutIcon,
        route: null,
        active: false
    },
]


function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>()
    const [selected, setSelected] = useState<string>(location.pathname)

    const logout = async () => {
        await dispatch(logoutUser())
        dispatch(expireFriends())
        navigate('/login')
        console.log('user logged out');
        return
    };

    const options = navOptions.map((option) => {
        const handleOnClick = () => {
            if (option.id === 'logout') {
                (async () => logout())()
                navigate('/')
                return
            } else {
                setSelected(option.route as string)
                navigate(`${option.route}`)
            }
        }
        return <div onClick={handleOnClick} key={option.id} id={`${option.id}-container`} className={`nav-icon-container ${selected === option.route && 'nav-icon-container-selected'}`}>
            <img src={option.image} alt={`${option.id}-button`} />
        </div>
    })

    return (
        <div className='nav-container'>
            {options}
        </div >
    );
}

export default Navbar;