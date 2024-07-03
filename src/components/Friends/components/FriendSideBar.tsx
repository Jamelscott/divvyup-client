import '../friends.css'
import FriendRequestForm from './FriendRequestForm';
import FriendRequests from './FriendRequests';
function FriendSideBar() {
        return (
                <div className="friends-side-bar-container">
                        <FriendRequestForm />
                        <FriendRequests />
                </div>
        );
}

export default FriendSideBar;