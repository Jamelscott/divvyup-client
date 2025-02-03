import analyticsIcon from '../../../assets/navbarIcons/analytics-icon.svg'
import friendsIcon from '../../../assets/navbarIcons/friends-icon.svg'
import homeIcon from '../../../assets/navbarIcons/home-icon.svg'
import profileIcon from '../../../assets/navbarIcons/profile-icon.svg'
import logoutIcon from '../../../assets/navbarIcons/logout-icon.svg'
type NavOptions = {
        id: 'home' | 'analytics' | 'profile' | 'friends' | 'logout';
        image: string;
        route: string | null;
        active: boolean;
}

export const navOptions: NavOptions[] = [
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

export default navOptions;