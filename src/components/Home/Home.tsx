import { useEffect } from 'react';
import ExpenseList, { ExpenseListType } from '../Expenses/ExpenseList';
import ProfileData from './ProfileData';
import { getFriendRequests, selectFriends, selectFriendsState, setActiveExpenseList } from '@/slices/friendsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { DataState, selectUser } from '@/slices/userSlice';
import { AppDispatch } from '@/utils/store';
import FriendsList from '../Friends/components/FriendsList';
import FriendRequests from '../Friends/components/FriendRequests';

export enum FriendSourceType {
    FRIENDS_PAGE,
    HOME_PAGE
}

function Home() {
    const friends = useSelector(selectFriends)
    const user = useSelector(selectUser)
    const friendsState = useSelector(selectFriendsState)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (friendsState === DataState.INITIAL && user) {
            dispatch(getFriendRequests(user))
        }
        if (friendsState === DataState.FULFILLED && friends.length > 0) {
            dispatch(setActiveExpenseList(friends[0].id))
        }
    }, [])
    return (
        <>
            <div className={`flex p-5 gap-5 w-full ${friends.length > 0 ? 'justify-between' : 'justify-center'}`} style={{ height: '98vh', overflow: 'hidden' }}>
                {friends.length > 0 && <div className='grow max-w-4xl'>
                    <ExpenseList sourceType={ExpenseListType.RECENT} />
                </div>}
                <div className={`flex flex-col max-w-2xl gap-5 items-end ${friends.length > 0 ? '' : 'items-center'}`} >
                    <ProfileData />
                    {/* <QuickFeatures /> */}
                    {/* <FriendRequests /> */}
                    {friends.length > 0 ? <FriendsList sourceType={FriendSourceType.HOME_PAGE} /> : <FriendRequests />}
                </div>
            </div >
        </>
    );
}

export default Home;
