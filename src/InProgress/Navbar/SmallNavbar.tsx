import { useState } from 'react';
import {
  IconDeviceDesktopAnalytics,
  IconUsersGroup,
  IconFriends,
  IconHome2,
  IconLogout,
  IconSettings,
  IconUserCircle,
  IconDotsVertical,
} from '@tabler/icons-react';
import { Tooltip, UnstyledButton } from '@mantine/core';
import classes from './SmallNavbar.module.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/slices/userSlice';
import { expireFriends } from '@/slices/friendsSlice';
import { AppDispatch } from '@/utils/store';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="top" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon size={40} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const tabs = [
  { icon: IconHome2, label: 'Home', index: 0 },
  { icon: IconFriends, label: 'Friends', index: 1 },
  { icon: IconUsersGroup, label: 'Groups', index: 2 },
  { icon: IconUserCircle, label: 'Profile', index: 3 },
];
const Additionaltabs = [
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics', index: 4 },
  { icon: IconSettings, label: 'Settings', index: 5 },
];

export function SmallNavbar() {
        const [active, setActive] = useState(0);
        const navigate = useNavigate()
        const dispatch = useDispatch<AppDispatch>();
        const [showAdditionalLinks, setShowAdditionalLinks] = useState(false)
        const links = tabs.map((link) => (
                <NavbarLink
                {...link}
                key={link.label}
                active={link.index === active}
                onClick={() => handleLinkClick(link.index, (link.label as any).toLowerCase())}
                />
        ));
        const additionalLinks = Additionaltabs.map((link) => (
                <NavbarLink
                {...link}
                key={link.label}
                active={link.index === active}
                onClick={() => handleLinkClick(link.index, (link.label as any).toLowerCase())}
                />
        ));

        const handleLinkClick = (index:number, label?:String) => {
                setActive(index)
                if (label === 'home') return navigate('/')
                if (label) navigate((label as any))
        }
        const handleLogout = async () => {
                await dispatch(logoutUser())
                dispatch(expireFriends())
                navigate('/')
                console.log('user logged out');
                return
        };
  return (
    <nav className={`${classes.navbar}`}>
            {showAdditionalLinks && 
        <div className={`${classes.navbarAdditionalLinks}`}>
          {additionalLinks}
          <NavbarLink 
            icon={IconLogout}
            label="Logout"
		        onClick={()=> handleLogout()}
          />
        </div>
      }
      <div className={`${classes.navbarLinks}`}>
          {links}
          <NavbarLink 
            icon={IconDotsVertical}
            label="More"
		        onClick={()=> setShowAdditionalLinks((prev)=> !prev)}
          />
      </div>
    </nav>
  );
}