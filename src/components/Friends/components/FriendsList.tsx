import { friendOwingDiff } from "../../../utils/friendHelpers";
import { getUser, selectUser } from "../../../slices/userSlice";
import { DataState, getFriends, selectFriends, selectFriendsState } from "../../../slices/friendsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch } from "../../../utils/store";

function FriendsList() {
        const friends = useSelector(selectFriends)
        const friendsDataState = useSelector(selectFriendsState)
        const user = useSelector(selectUser)
        const dispatch = useDispatch<AppDispatch>()

        useEffect(() => {
                if (user.id && friendsDataState === DataState.INITIAL) {
                        dispatch(getFriends(user.id))
                }
        }, [user])
        return (
                <div>
                        <h2>Friends List</h2>
                        {user.expenses && friends?.map((friend, idx) => {
                                const friendDiff = friendOwingDiff(user, user.expenses, friend)
                                const noExpenses = friendDiff.totalSpent === 0
                                const youSpentMore = friendDiff.yourSpent > friendDiff.friendSpent
                                const friendSpentMore = friendDiff.friendSpent > friendDiff.yourSpent
                                return (
                                        <div key={idx}>
                                                <h4>{friend.username}
                                                        <span style={{ color: noExpenses ? 'black' : youSpentMore ? 'green' : 'red' }}>
                                                                {noExpenses ? ' is square with you' : youSpentMore ? ' owes you' : ' lent you'}
                                                        </span>
                                                        {' $'}
                                                        {!noExpenses && youSpentMore ? friendDiff.yourSpent - friendDiff.friendSpent : !noExpenses && friendSpentMore ? friendDiff.friendSpent - friendDiff.yourSpent : ''}
                                                </h4>
                                                <input type="button" value="see expenses" />
                                                <input type="button" value="settle up" />
                                                <input type="button" value="remove friend" />
                                        </div>
                                )
                        })}
                </div >
        );
}

export default FriendsList;