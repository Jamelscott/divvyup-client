import FriendsList from './components/FriendsList';
import FriendSideBar from './components/FriendSideBar';
import FriendRequestForm from './components/FriendRequestForm';
import './friends.css'
function Friends() {
        return (
                <div className='friends-container'>
                        <div>
                                <FriendRequestForm />
                                <FriendsList />
                        </div>
                        <FriendSideBar />
                </div>
        );
}

export default Friends;