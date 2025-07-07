import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserState,
  userSession,
} from "./slices/userSlice.ts";
import { useEffect, useState } from "react";
import { DataState, User } from "./types.d";
import {
  getFriendRequests,
  getFriends,
  selectFriendsState,
} from "./slices/friendsSlice.ts";
import { AppDispatch } from "./utils/store.ts";
import "./globals.css";
import "@mantine/core/styles.css";
import { LoadingOverlay } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Landing from "./components/Landing.tsx";
import { NavbarMinimal as Navbar } from "./components/Navbar/Navbar.tsx";
import { SmallNavbar } from "./components/Navbar/SmallNavbar.tsx";
import Friends from "./components/Friends/FriendsPage.tsx";
import Friend from "./components/Friend/Friend.tsx";
import Home from "./components/Home/Home.tsx";
import LoadingHourglass from "./components/Loading/LoadingHourglass.tsx";
import NotFound from "./components/404/NotFound.tsx";
import Profile from "./components/Profile/Profile.tsx";
import Logout from "./components/Logout/Logout.tsx";

function App() {
  const userDataState = useSelector(selectUserState);
  const friendsDataState = useSelector(selectFriendsState);
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [_currentUser, setCurrentUser] = useState<User>(user);
  const isLoading =
    userDataState === DataState.LOADING ||
    friendsDataState === DataState.LOADING;
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  useEffect(() => {
    if (user.id) {
      setCurrentUser(user);
      dispatch(getFriends(user.id));
      dispatch(getFriendRequests(user));
    }
  }, [userDataState]);
  useEffect(() => {
    if (!user.id) {
      dispatch(userSession());
    }
  }, []);

  return (
    <BrowserRouter>
      <LoadingOverlay
        visible={isLoggingIn || isLoading}
        overlayProps={{ opacity: 0, blur: 0 }}
        loaderProps={{ children: <LoadingHourglass /> }}
      />
      <div className="flex max-[600px]:flex-col">
        {user.id && (
          <>
            <div className="hidden max-[600px]:flex">
              <SmallNavbar />
            </div>
            <div className="flex max-[600px]:hidden fixed h-[100%]">
              <Navbar />
            </div>
          </>
        )}
        <div
          className={
            user.id
              ? `pl-[80px] w-full max-[600px]:p-0`
              : "flex justify-center w-[100%]"
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                user.id ? <Home /> : <Landing setIsLoggingIn={setIsLoggingIn} />
              }
            />
            <Route path="/analytics" element={<NotFound />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/friends/:id" element={<Friend />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Notifications color="grape" className="absolute bottom-5 right-5" />
    </BrowserRouter>
  );
}

export default App;
