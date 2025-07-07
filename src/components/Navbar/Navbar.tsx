import { useMemo } from "react";
import {
  IconDeviceDesktopAnalytics,
  IconUsersGroup,
  IconFriends,
  IconHome2,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import { Center, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import classes from "./Navbar.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/slices/userSlice";
import { expireFriends } from "@/slices/friendsSlice";
import { AppDispatch } from "@/utils/store";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const tabs = [
  { icon: IconHome2, label: "Home", path: "/", active: 0 },
  { icon: IconFriends, label: "Friends", path: "/friends", active: 1 },
  { icon: IconUsersGroup, label: "Groups", path: "/groups", active: 2 },
  {
    icon: IconDeviceDesktopAnalytics,
    label: "Analytics",
    path: "/analytics",
    active: 3,
  },
];

export function NavbarMinimal() {
  const navigate = useNavigate();

  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // REPLACE useState with this useMemo:
  const active = useMemo(() => {
    const currentPath = location.pathname;

    // Check main tabs first
    const tabIndex = tabs.findIndex((tab) => tab.path === currentPath);
    if (tabIndex !== -1) return tabIndex;

    // Check additional routes
    if (currentPath.startsWith("/friends")) return 1;
    if (currentPath.startsWith("/groups")) return 2;
    if (currentPath.startsWith("/analytics")) return 3;
    if (currentPath.startsWith("/profile")) return 4;
    if (currentPath.startsWith("/settings")) return 5;

    // Default to 404
    return 0;
  }, [location.pathname]);

  const links = tabs.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => navigate(link.path)} // Simplified onClick
    />
  ));

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(expireFriends());
    navigate("/");
    console.log("user logged out");
    return;
  };
  return (
    <nav className={`${classes.navbar}`}>
      <Center>
        <h1 className="text-white font-light text-4xl font-[Trispace]">B</h1>
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
          onClick={() => navigate("/profile")}
          label="Account"
        />
        <NavbarLink
          icon={IconSettings}
          label="Settings"
          active={5 === active}
          onClick={() => navigate("/settings")}
        />
        <NavbarLink
          icon={IconLogout}
          label="Logout"
          onClick={() => handleLogout()}
        />
      </Stack>
    </nav>
  );
}
