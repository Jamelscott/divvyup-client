import FriendRequests from './components/FriendRequests';
import FriendsList from './components/FriendsList';
import ExpenseList, { ExpenseListType } from '../Expenses/ExpenseList';
import { useDispatch, useSelector } from 'react-redux';
import { DataState, selectFriends, selectFriendsState, setActiveExpenseList } from '@/slices/friendsSlice';
import { AppDispatch, RootState } from '@/utils/store';
import { FriendSourceType } from '../Home/Home';
import { ExpenseData } from '@/types';
import { useNavigate } from 'react-router-dom';

function Friends() {
        const navigate = useNavigate();
        const emptyArray: ExpenseData[] = []
        const activeExpenseList = useSelector(
                (state: RootState) => {
                        const friendId = state.friends.data.activeList
                        if (!friendId) return emptyArray
                        const friendExpenses = state.user.data.expenses.filter((expense) => expense.lender === friendId || expense.ower === friendId).sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf())
                        return friendExpenses
                }
        )
        const friendsState = useSelector(selectFriendsState)
        const friends = useSelector(selectFriends)
        const dispatch = useDispatch<AppDispatch>()

        // useEffect(() => {
                if (friendsState === DataState.FULFILLED && friends.length > 0) {
                        const filterOutNoExpensesFriend = friends.filter((friend) => friend.expenses && friend.expenses.length > 0)
                        
                        filterOutNoExpensesFriend.length > 0 && dispatch(setActiveExpenseList(filterOutNoExpensesFriend[0].id))
                }
        // }, [friendsState])
if (friends.length === 0) {
        navigate('/')
}
        return (
                <>
                        <div className='flex justify-between p-5 gap-5 w-full' style={{ height: '98vh', overflow: 'hidden' }}>
                                <div className='grow max-w-4xl'>
                                        {activeExpenseList.length > 0 && <ExpenseList friendExpenses={activeExpenseList} sourceType={ExpenseListType.USER_SPECIFIC} />}
                                </div>
                                <div className='flex flex-col items-end h-full gap-5 max-w-xl overflow-y-scroll' >
                                        <FriendsList sourceType={FriendSourceType.FRIENDS_PAGE} />
                                        <FriendRequests />
                                </div>
                        </div >
                </>
        );
}

export default Friends;