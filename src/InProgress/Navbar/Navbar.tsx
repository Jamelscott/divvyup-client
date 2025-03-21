import { useState } from 'react';
import {
  IconDeviceDesktopAnalytics,
  IconUsersGroup,
  IconFriends,
  IconHome2,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from './Navbar.module.css';
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
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const tabs = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconFriends, label: 'Friends' },
  { icon: IconUsersGroup, label: 'Groups' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
];

export function NavbarMinimal() {
const [active, setActive] = useState(0);
const navigate = useNavigate()
const dispatch = useDispatch<AppDispatch>();
  const links = tabs.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => handleLinkClick(index, (link.label as any).toLowerCase())}
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
      <Center>
        <h1 className="text-white font-light text-4xl font-[Trispace]">
        B
        </h1>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink 
                icon={IconUserCircle}       
                active={4 === active}
                onClick={() => handleLinkClick(4, 'profile')}
                label="Account"
         />
        <NavbarLink
                icon={IconSettings}
                label="Settings"
                active={5 === active}
                onClick={() => handleLinkClick(5)}
        />
        <NavbarLink 
                icon={IconLogout}
                label="Logout"
				onClick={()=> handleLogout()}
        />
      </Stack>
    </nav>
  );
}