import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { handleGetUser, handleLogout, handleUserSession } from '../utils/loginHelpers';
import { Profile, User } from '../utils/types';
import { useContext } from 'react';
import { UserContext, UserContextType } from '../context/userContext';

function Navbar() {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const testProfile = async () => {
        const { data, error } = await supabase.from('profiles').select();
        if (error) {
            console.log(error);
        } else {
            const profiles: Profile[] = data;
            console.log('profiles: ', profiles);
        }
    };

    const logout = async (): Promise<User> => {
        const error = await handleLogout();
        if (error) throw new Error(`error logging in: ${error}`);
        navigate('/login');
        console.log('user logged out');
        return handleUserSession();
    };

    return (
        <>
            <button disabled={!user.id} onClick={async () => setUser(await logout())}>Log out</button>
            <button onClick={handleGetUser}>console log user</button>
            <button onClick={testProfile}> test profile</button>
        </>
    );
}

export default Navbar;