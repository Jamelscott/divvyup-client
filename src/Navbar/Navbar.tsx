import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import { handleGetUser, handleLogout } from "../utils/loginHelpers";
import { User as SupaUser } from "@supabase/supabase-js";

function Navbar({user, setUser}: any) {
    const navigate = useNavigate()

    const testProfile = async () => {
        const { data, error } : any = await supabase.from("profiles").select()
        data ? console.log(data) : console.log(error)
    }

    const logout =  async (user : SupaUser) => {
        if (user) {
            const error = await handleLogout()
            if (error) return console.log(error)
            navigate('/login')
            console.log('user logged out')
            return null
        } else {
            console.log('no user is signed in')
        }
    }
    
    return ( 
        <>
            <button disabled={!user.id} onClick={() => setUser(logout(user))}>Log out</button>
            <button onClick={handleGetUser}>console log user</button>
            <button onClick={testProfile}> test profile</button>
        </>
     );
}

export default Navbar;