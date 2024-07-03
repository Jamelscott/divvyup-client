import { useContext } from "react";
import { UserContext, UserContextType } from "../../../context/userContext";
import { friendOwingDiff } from "../../../utils/friendHelpers";

function FriendsList() {
        const { user, friends, expenses } = useContext(UserContext) as UserContextType
        return (
                <div>
                        <h2>Friends List</h2>
                        {expenses && friends?.map((friend, idx) => {
                                const friendDiff = friendOwingDiff(user, expenses, friend)
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