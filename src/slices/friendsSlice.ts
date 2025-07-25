import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataState, FriendRequest, FriendSliceData, GenericDataState, User } from "@/types.d";
import { RootState } from "../utils/store";
import { acceptFriendRequest, deleteFriendRequest, fetchFriendRequests, fetchFriends, handleRequestFriend } from "../utils/friendHelpers";
import { handleRemoveFriend } from "@/utils/userHelpers";
import { updateExpenses } from "./userSlice";

export const getFriends = createAsyncThunk(
        'friends/get/fetchFriends',
        async (userId: string, thunkApi) => {
                const friends = await fetchFriends(userId);
                if (!friends) {
                        return thunkApi.rejectWithValue('error');
                }
                return friends;
        }
);

export const deleteFriend = createAsyncThunk(
        'friend/delete',
        async (params: {userId: string, friendId:string}, thunkApi) => {
                try {
                        const {userId, friendId} = params;
                        await handleRemoveFriend(userId, friendId);
                        const friends = await fetchFriends(userId);
                        // update expenses to remove those of the removed friend
                        thunkApi.dispatch(updateExpenses(friendId));
                        return friends
                } catch (err) {
                        return thunkApi.rejectWithValue('error');

                }
        }
);

export const getFriendRequests = createAsyncThunk(
        'friends/get/fetchFriendRequests',
        async (user: User, thunkApi) => {
        try {
                const friendRequests = await fetchFriendRequests(user);
                if (!friendRequests) {
                        return [];
                }
                return friendRequests;
        } catch (err) {
                return thunkApi.rejectWithValue('error');

        }
        }
);

export const postFriendRequest = createAsyncThunk(
        'friends/post/fetchFriendRequest',
        async (params: { user: User, usernameOrEMail: string }, thunkApi) => {
                const { user, usernameOrEMail } = params
                const friendRequest = await handleRequestFriend(usernameOrEMail, user);
                if (!friendRequest) {
                        return thunkApi.rejectWithValue('error');
                }
                return friendRequest;
        }
);

export const rejectFriendRequest = createAsyncThunk(
        'friends/delete/fetchFriendRequest',
        async (requestId: string, thunkApi) => {
                const deleteRequest = await deleteFriendRequest(requestId);
                if (!deleteRequest) {
                        return thunkApi.rejectWithValue('error');
                }
                return requestId;
        }
);

export const approveFriendRequest = createAsyncThunk(
        'friends/put/fetchFriendRequest',
        async (params:{requestId: string, userId: string}, thunkApi) => {
                const {requestId, userId} = params;
                const approvedRequest = await acceptFriendRequest(requestId);
                if (!approvedRequest) {
                        return thunkApi.rejectWithValue('error');
                }
                const newFriendsList = await fetchFriends(userId);
                return {
                        friendRequestId: approvedRequest.id,
                        newFriendsList
                };
        }
);


const initialState: GenericDataState<FriendSliceData> = {
        data: {
                friends: [],
                friendRequests: [],
                activeList: null,
        },
        dataState: DataState.INITIAL,
        error: null
};

const friendsSlice = createSlice({
        name: 'friends',
        initialState,
        reducers: {
                expireFriends(state) {
                        state.data = initialState.data;
                        state.dataState = DataState.INITIAL;
                },
                setActiveExpenseList(state, action) {
                        state.data.activeList = action.payload
                }
        },
        extraReducers: (builder) => {
                builder
                        .addCase(getFriends.pending, (state) => {
                                state.dataState = DataState.LOADING;
                        })
                        .addCase(
                                getFriends.fulfilled,
                                (state, action: PayloadAction<User[]>) => {
                                        state.data.friends = action.payload ?? [];
                                        state.dataState = DataState.FULFILLED;
                                }
                        )
                        .addCase(getFriends.rejected, (state, action) => {
                                if (action.payload) {
                                        state.error = action.payload;
                                } else {
                                        state.error = 'err';
                                }
                                state.dataState = DataState.ERROR;
                        })
                        .addCase(getFriendRequests.pending, (state) => {
                                state.dataState = DataState.LOADING;
                        })
                        .addCase(getFriendRequests.fulfilled, (state, action: PayloadAction<FriendRequest[] | undefined>) => {
                                state.data.friendRequests = action.payload ?? [];
                                state.dataState = DataState.FULFILLED;
                        })
                        .addCase(getFriendRequests.rejected, (state, action) => {
                                if (action.payload) {
                                        state.error = action.payload;
                                } else {
                                        state.error = 'err';
                                }
                                state.dataState = DataState.ERROR;
                        })
                        .addCase(postFriendRequest.pending, (state) => {
                                state.dataState = DataState.LOADING;
                        })
                        .addCase(postFriendRequest.fulfilled, (state, action: PayloadAction<FriendRequest[]>) => {
                                state.data.friendRequests = [...state.data.friendRequests, ...action.payload];
                                state.dataState = DataState.FULFILLED;
                        })
                        .addCase(postFriendRequest.rejected, (state, action) => {
                                if (action.payload) {
                                        state.error = action.payload;
                                } else {
                                        state.error = 'err';
                                }
                                state.dataState = DataState.ERROR;
                        })
                        .addCase(rejectFriendRequest.pending, (state) => {
                                state.dataState = DataState.LOADING;
                        })
                        .addCase(rejectFriendRequest.fulfilled, (state, action: PayloadAction<string>) => {
                                state.data.friendRequests = state.data.friendRequests.filter((request) => request.id !== action.payload);
                                state.dataState = DataState.FULFILLED;
                        })
                        .addCase(rejectFriendRequest.rejected, (state, action) => {
                                if (action.payload) {
                                        state.error = action.payload;
                                } else {
                                        state.error = 'err';
                                }
                                state.dataState = DataState.ERROR;
                        })
                        .addCase(approveFriendRequest.pending, (state) => {
                                state.dataState = DataState.LOADING;
                        })
                        .addCase(approveFriendRequest.fulfilled, (state, action: PayloadAction<any>) => {
                                state.data.friendRequests = state.data.friendRequests.filter((request) => request.id !== action.payload.friendRequestId);
                                state.data.friends = action.payload.newFriendsList
                                state.dataState = DataState.FULFILLED;
                        })
                        .addCase(approveFriendRequest.rejected, (state, action) => {
                                if (action.payload) {
                                        state.error = action.payload;
                                } else {
                                        state.error = 'err';
                                }
                                state.dataState = DataState.ERROR;
                        })
                        .addCase(deleteFriend.pending, (state) => {
                                state.dataState = DataState.LOADING;
                        })
                        .addCase(deleteFriend.fulfilled, (state, action) => {
                                state.data.friends = action.payload ?? [];
                                // state.user.expenses = state.user.expenses.filter((expense) => expense.lender !==  )
                                state.dataState = DataState.FULFILLED;
                        })
                        .addCase(deleteFriend.rejected, (state, action) => {
                                if (action.payload) {
                                        state.error = action.payload;
                                } else {
                                        state.error = 'err';
                                }
                                state.dataState = DataState.ERROR;
                        })
        },
});

export default friendsSlice.reducer;

export const { expireFriends, setActiveExpenseList } = friendsSlice.actions;

export const selectFriendsState = (state: RootState) =>
        state.friends.dataState;

export const selectFriends = (state: RootState) =>
        state.friends.data.friends || initialState.data.friends;

export const selectFriendRequests = (state: RootState) =>
        state.friends.data.friendRequests || initialState.data.friendRequests;

export const selectActiveFriendExpenses = (state: RootState) => {
        const friendId = state.friends.data.activeList
        if (!friendId) return []
        const friendExpenses = state.user.data.expenses.filter((expense) => expense.lender === friendId || expense.ower === friendId).sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf())
        console.log(friendExpenses)
        return friendExpenses
}
