import { supabase } from '../supabase';
import { ExpenseData, FriendRequest, User } from '../types';

type friendOwingDiff = {
    yourSpent: number,
    friendSpent: number,
    yourPayments: ExpenseData[],
    friendPayments: ExpenseData[]
    totalSpent: number;
    friendUsername: string,
}

export const handleRequestFriend = async (usernameOrEmail: string, user: User) => {
    const isEmail = usernameOrEmail.includes('@');
    const { id: userId, username } = user;

    if (isEmail) {
        try {
            const newFriend = await supabase
                .from('profiles')
                .select('*')
                .eq('email', usernameOrEmail);
            if (newFriend.error) throw new Error(`error finding friend profile with email: ${newFriend.error}`)
            if (newFriend.data[0].id === userId) throw new Error(`you can't add yourself silly`)
            // throw new Error(`error finding friend profile with email: ${newFriend.error}`);
            if (newFriend.data) {
                const { data, error }: any = await supabase
                    .from('friends')
                    .insert([
                        { type: 'pending', user_one_uuid: userId, user_two_uuid: newFriend.data[0].id, user_one_username: username, user_two_username: newFriend.data[0].username },
                    ])
                    .select();
                if (error) {
                    throw new Error('error getting friend data')
                    // throw new Error(`error inserting friend: ${error}`);
                }
                return data;
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
            if (newFriend.error) throw new Error(`error finding friend profile with username: ${newFriend.error}`)
            if (newFriend.data[0].id === userId) throw new Error(`you can't add yourself silly`)
            // throw new Error(`error finding friend profile with username: ${newFriend.error}`);
            if (newFriend.data) {
                const { data, error }: any = await supabase
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
                        throw new Error(`friend request pending or youre already friends`)
                        // throw new Error(`friend request pending or youre already friends`);;
                    }
                    throw new Error(`error inserting friend: ${error}`)
                    // throw new Error(`error inserting friend: ${error}`);
                }
                return data;
            }
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    }
};

export const fetchFriendRequests = async (user: User): Promise<FriendRequest[]> => {
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

export const acceptFriendRequest = async (requestId: string): Promise<FriendRequest> => {
    const { data: newFriendData, error } = await supabase
        .from('friends')
        .update({ type: 'complete' })
        .eq('id', requestId)
        .select();

    if (error) {
        console.log(error);
    }
    return newFriendData as any;
};

export const deleteFriendRequest = async (requestId: string) => {
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

export const fetchFriends = async (userId: string) => {
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
            if (friend.requester_uuid === userId && friend.requester_uuid !== friend.id) {
                return friend.requestee_uuid
            } else if (friend.requestee_uuid === userId && friend.requestee_uuid !== friend.id) {
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

export const getProfile = async (profileId: string) => {
    let { data: profile, error } = await supabase
        .from('profiles')
        .select(profileId)
    if (error) throw new Error('user not found')
    return profile
}

export const friendOwingDiff = (user: User, expenses: ExpenseData[], friend: User): friendOwingDiff => {
    const friendExpenses = expenses.reduce((acc: any, curr: any) => {
        if ((curr.lender === user.id && curr.ower !== friend.id) || (curr.lender !== friend.id && curr.ower === user.id)) return acc
        if (curr.lender === user.id) {
            acc.yourPayments.push(curr)
            const paymentPercentage = (curr.splitpercentage / 100) * curr.quantity;
            acc.yourSpent += paymentPercentage
            acc.totalSpent += curr.quantity
        } else if (curr.lender === friend.id) {
            acc.friendPayments.push(curr)
            const paymentPercentage = (curr.splitpercentage / 100) * curr.quantity;
            acc.friendSpent += paymentPercentage
            acc.totalSpent += curr.quantity
        }
        return acc;
    }, {
        friendUsername: friend.username,
        yourSpent: 0,
        yourPayments: [],
        friendSpent: 0,
        friendPayments: [],
        totalSpent: 0
    })

    return friendExpenses
}

export const getLocalFriend = (friendId: string, friends: User[]) => {
    return friends.find((friend) => friendId === friend.id) ?? null
}