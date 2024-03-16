import { supabase } from "../../utils/supabase";

function Navbar({user}: any) {

    const handleSignOut =  async () => {
        if (user) {
            let { error } = await supabase.auth.signOut()
            if (error) return console.log(error)
            console.log('user logged out')
        } else {
            console.log('no user is signed in')
        }
    }
    if (user) {
        return  <button onClick={handleSignOut}>Sign Out</button>
    }

    return ( 
        <></>
     );
}

export default Navbar;