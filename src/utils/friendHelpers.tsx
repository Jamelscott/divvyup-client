import { supabase } from "../../utils/supabase"
import { User } from "./types";

export const handleRequestFriend = async (usernameOrEmail:string, user:User ) => {
    const isEmail = usernameOrEmail.includes("@")
    const { id: userId, username } = user

    if (isEmail) {
        try {
            const newFriend = await supabase
            .from('profiles')
            .select('*')
            .eq('email', usernameOrEmail) as any;
        if (newFriend.error) throw new Error(`error finding friend profile with email: ${newFriend.error}`)
        if (newFriend.data) {
            const { error } = await supabase
            .from('friends')
            .insert([
                { type: 'pending', user_one_uuid: userId, user_two_uuid: newFriend.data[0].id, user_one_username: username , user_two_username: newFriend.data[0].username },
            ])
            .select()
            if (error) throw new Error(`error inserting friend: ${error}`)
            return true
        }
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    } else {
        try {
            const newFriend = await supabase
            .from('profiles')
            .select('*')
            .eq('username', usernameOrEmail) as any;
        if (newFriend.error) throw new Error(`error finding friend profile with username: ${newFriend.error}`)
        if (newFriend.data) {
            const { error } = await supabase
            .from('friends')
            .insert([
                {
                    type: 'pending',
                    requester_uuid: userId,
                    requester_username: username,
                    requestee_uuid: newFriend.data[0].id,
                    requestee_username: newFriend.data[0].username
                },
            ])
            .select()
            if (error) {
                if (error.code === '23505') {
                   return console.log('friend request pending or youre already friends')
                }
                throw new Error(`error inserting friend: ${error}`)
            }
            return true
        }
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }
}

export const getFriendRequests = async (user: User) => {
    const { data: pendingRequests, error } = await supabase
        .from('friends')
        .select('*')
        .eq('requester_uuid', user.id)
        .eq('type', 'pending')

    if (error) {
        console.log(error)
    }
    console.log(pendingRequests)
    return pendingRequests
}

export const acceptFriendRequest = async (requestId: string) => {
    const { data: newFriendData, error } = await supabase
        .from('friends')
        .update({ type: 'complete' })
        .eq('id', requestId)
        .select()

    if (error) {
        console.log(error)
    }
    console.log(newFriendData)
    return newFriendData
}

export const rejectFriendRequest = async (requestId: string) => {
    const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', requestId)

    if (error) {
        console.log(error)
    }
    console.log('deleted')
    return true
}