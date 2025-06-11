import { useEffect } from "react";
import ExpenseList, { ExpenseListType } from "../Expenses/ExpenseList";
import ProfileData from "./ProfileData";
import {
  getFriendRequests,
  selectFriends,
  selectFriendsState,
  setActiveExpenseList,
} from "@/slices/friendsSlice";
import { useDispatch, useSelector } from "react-redux";
import { DataState, selectUser, selectUserState } from "@/slices/userSlice";
import { AppDispatch } from "@/utils/store";
import FriendsList from "../Friends/components/FriendsList";
import FriendRequests from "../Friends/components/FriendRequests";
import LoadingHourglass from "../Loading/LoadingHourglass";
import { LoadingOverlay } from "@mantine/core";

export enum FriendSourceType {
  FRIENDS_PAGE,
  FRIENDS_PAGE_SMALL,
  HOME_PAGE,
  HOME_PAGE_SMALL,
  FRIEND_PAGE,
}

function Home() {
  const friends = useSelector(selectFriends);
  const user = useSelector(selectUser);
  const userDataState = useSelector(selectUserState);
  const friendsState = useSelector(selectFriendsState);
  const dispatch = useDispatch<AppDispatch>();
  const showLoading = userDataState === DataState.LOADING;
  useEffect(() => {
    if (friendsState === DataState.INITIAL && user.id) {
      dispatch(getFriendRequests(user));
    }
    if (friendsState === DataState.FULFILLED && friends && friends.length > 0) {
      dispatch(setActiveExpenseList(friends?.[0].id));
    }
  }, []);

  if (showLoading)
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ children: <LoadingHourglass /> }}
        // loaderProps={{ children: <SparklesText sparklesCount={8} className="loginText" text="Loading..." />}}
      />
    );

  return (
    <>
      <div
        className={`flex p-5 gap-5 w-full ${
          friends.length > 0 ? "justify-between" : "justify-center"
        }`}
        style={{ height: "98vh", overflow: "hidden" }}
      >
        {friends.length > 0 && (
          <div className="grow max-w-4xl">
            <ExpenseList sourceType={ExpenseListType.RECENT} />
          </div>
        )}
        <div
          className={`flex flex-col max-w-2xl gap-5 items-end ${
            friends.length > 0 ? "" : "items-center"
          }`}
        >
          <ProfileData />
          {/* <QuickFeatures /> */}
          {/* <FriendRequests /> */}
          {friends.length > 0 ? (
            <FriendsList sourceType={FriendSourceType.HOME_PAGE} />
          ) : (
            <FriendRequests />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
