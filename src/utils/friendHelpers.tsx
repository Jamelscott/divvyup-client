import { supabase } from '../../utils/supabase';
import { FriendRequest, User } from './types';

export const handleRequestFriend = async (usernameOrEmail: string, user: User): Promise<boolean | undefined> => {
    const isEmail = usernameOrEmail.includes('@');
    const { id: userId, username } = user;

    if (isEmail) {
        try {
            const newFriend = await supabase
                .from('profiles')
                .select('*')
                .eq('email', usernameOrEmail);
            if (newFriend.error) throw new Error(`error finding friend profile with email: ${newFriend.error}`);
            if (newFriend.data) {
                const { error } = await supabase
                    .from('friends')
                    .insert([
                        { type: 'pending', user_one_uuid: userId, user_two_uuid: newFriend.data[0].id, user_one_username: username, user_two_username: newFriend.data[0].username },
                    ])
                    .select();
                if (error) throw new Error(`error inserting friend: ${error}`);
                return true;
            }
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    } else {
        try {
            const newFriend = await supabase
                .from('profiles')
                .select('*')
                .eq('username', usernameOrEmail);
            if (newFriend.error) throw new Error(`error finding friend profile with username: ${newFriend.error}`);
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
                    .select();
                if (error) {
                    if (error.code === '23505') {
                        console.log('friend request pending or youre already friends');
                        return;
                    }
                    throw new Error(`error inserting friend: ${error}`);
                }
                return true;
            }
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    }
};

export const getFriendRequests = async (user: User): Promise<FriendRequest[]> => {
    const { data: pendingRequests, error } = await supabase
        .from('friends')
        .select('*')
        .or(`requester_uuid.eq.${user.id},requestee_uuid.eq.${user.id}`)
        .eq('type', 'pending');

    if (error) {
        console.log(error);
    }
    return pendingRequests as FriendRequest[];
};

export const acceptFriendRequest = async (requestId: string) => {
    const { data: newFriendData, error } = await supabase
        .from('friends')
        .update({ type: 'complete' })
        .eq('id', requestId)
        .select();

    if (error) {
        console.log(error);
    }
    return newFriendData;
};

export const rejectFriendRequest = async (requestId: string) => {
    const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', requestId);

    if (error) {
        console.log(error);
    }
    console.log('deleted');
    return true;
};

export const getFriends = async (userId: string) => {
    const { data: friendships, error } = await supabase
        .from('friends')
        .select('*')
        .or(`requester_uuid.eq.${userId},requestee_uuid.eq.${userId}`)
        .eq('type', 'complete');

    if (error) {
        return console.log(error);
    }
    let friendIds: string[] = [];

    if (friendships && friendships.length > 0) {
        friendIds = friendships.map((friend) => {
            if (friend.requester_uuid === userId) {
                return friend.requestee_uuid
            } else if (friend.requestee_uuid === userId) {
                return friend.requester_uuid
            } else {
                throw new Error('user id not found.')
            }
        })
    }

    const { data: friends, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', friendIds)

    if (profilesError) {
        return console.log(error)
    }
    return friends;
};