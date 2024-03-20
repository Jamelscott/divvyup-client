import { supabase } from "../../utils/supabase";

function Navbar({user, setUser}: any) {
    // const handleSignUp =  async () => {
    //     if (!user) {
    //     let { data: user, error } = await supabase.auth.signUp({
    //         email: 'someone@email.com',
    //         password: 'UIaOleFbeBkloSANDEKq'
    //         })
    //     if (error) return console.log(error)
    //     setUser(user)
    //     console.log(user)
    //     console.log('User is signed up')
    //     } else {
    //         console.log('user is already logged in')
    //     }
    // }

    // const handleLogin =  async () => {
    //     let { data: user, error } = await supabase.auth.signInWithPassword({
    //         email: 'someone@email.com',
    //         password: 'UIaOleFbeBkloSANDEKq'
    //     })
    //     if (error) return console.log(error)
    //     setUser(user)
    //     console.log('user has logged in')
    // }

    const handleLogout =  async () => {
        if (user) {
            let { error } = await supabase.auth.signOut()
            if (error) return console.log(error)
            setUser(null)
            console.log('user logged out')
        } else {
            console.log('no user is signed in')
        }
    }

    return ( 
        <>
            {/* <button disabled={user} onClick={handleSignUp}>SignUp</button> */}
            {/* <button disabled={user} onClick={handleLogin}>Log in</button> */}
            <button disabled={!user} onClick={handleLogout}>Log out</button>
        </>
     );
}

export default Navbar;