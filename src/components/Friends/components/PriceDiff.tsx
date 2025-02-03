import { selectUser } from "@/slices/userSlice";
import { User } from "@/types";
import { friendOwingDiff } from "@/utils/friendHelpers";
import { useSelector } from "react-redux";

function PriceDiff({ friend, noExpenses }: { friend: User, noExpenses: boolean }) {
        const user = useSelector(selectUser)
        const friendDiff = friendOwingDiff(user, user.expenses, friend)
        const youSpentMore = friendDiff.yourSpent > friendDiff.friendSpent
        const friendSpentMore = friendDiff.friendSpent > friendDiff.yourSpent
        const priceDiff = (!noExpenses && youSpentMore ? friendDiff.yourSpent - friendDiff.friendSpent : !noExpenses && friendSpentMore ? friendDiff.friendSpent - friendDiff.yourSpent : 0).toFixed(2)

        if (noExpenses) {
                return <h4>No Shared Expenses</h4>
        }
        if (priceDiff === '0.00') {
                return <h4>You owe eachother the same amount</h4>
        }
        if (noExpenses) {
                return <h4>No shared expenses</h4>
        }
        if (youSpentMore) {
                return <h4 style={{ color: 'green' }}>
                        {friend.username} owes you ${priceDiff}

                </h4>
        }
        if (!youSpentMore) {

                return <h4 style={{ color: 'red' }}>
                        you owe {friend.username} ${priceDiff}
                </h4>
        }
        return (
                <></>
        );
}

export default PriceDiff;