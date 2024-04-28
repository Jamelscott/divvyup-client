import { useContext } from "react";
import { UserContext, UserContextType } from "../context/userContext";
import { friendOwingDiff } from "../utils/friendHelpers";

function FriendsList() {
        const { user, friends, expenses } = useContext(UserContext) as UserContextType
        return (
                <div>
                        <hr />
                        <h2>Friends List</h2>
                        {friends?.map((friend) => {
                                const friendDiff = friendOwingDiff(user, expenses, friend)
                                console.log('friendDiff: ', friendDiff)
                                const green = friendDiff.yourSpent > friendDiff.friendSpent

                                return (
                                        <>
                                                <h4>{friend.username}</h4>
                                                <h3>{friendDiff.yourSpent}</h3>
                                        </>
                                )
                        })}
                </div>
        );
}

export default FriendsList;