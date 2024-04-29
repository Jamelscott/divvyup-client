import { useContext } from "react";
import { UserContext, UserContextType } from "../context/userContext";
import { friendOwingDiff } from "../utils/friendHelpers";

function FriendsList() {
        const { user, friends, expenses } = useContext(UserContext) as UserContextType
        return (
                <div>
                        <hr />
                        <h2>Friends List</h2>
                        {friends?.map((friend, idx) => {
                                const friendDiff = friendOwingDiff(user, expenses, friend)
                                console.log(friendDiff)
                                const noExpenses = friendDiff.totalSpent === 0
                                const youSpentMore = friendDiff.yourSpent > friendDiff.friendSpent
                                const friendSpentMore = friendDiff.friendSpent > friendDiff.yourSpent

                                return (
                                        <div key={idx}>
                                                <h4>{friend.username}
                                                        <span style={{ color: noExpenses ? 'black' : youSpentMore ? 'green' : 'red' }}>{noExpenses ? ' is square with you' : youSpentMore ? ' owes you' : ' lent you'}</span>
                                                        {' '}

                                                        {!noExpenses && youSpentMore ? friendDiff.yourSpent : !noExpenses && friendSpentMore ? friendDiff.friendSpent : ''}
                                                </h4>
                                                {/* <h3 style={{ color: green ? 'green' : 'red' }}>{friendDiff.yourSpent}</h3> */}
                                        </div>
                                )
                        })}
                </div >
        );
}

export default FriendsList;