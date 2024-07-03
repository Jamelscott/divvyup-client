import FriendsList from './components/FriendsList';
import FriendRequestForm from './components/FriendRequestForm';
import './friends.css'
import SideBar from '../Sidebar/Sidebar';
import FriendSideBar from './components/FriendSideBar';
function Friends() {
        return (
                <div className='friends-container'>
                        <div>
                                <FriendsList />
                        </div>
                        <SideBar sideBarComponent={<FriendSideBar />} />
                </div>
        );
}

export default Friends;