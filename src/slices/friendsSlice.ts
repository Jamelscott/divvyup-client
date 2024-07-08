import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FriendRequest, FriendSliceData, GenericDataState, User } from "../types";
import { RootState } from "../utils/store";
import { acceptFriendRequest, deleteFriendRequest, fetchFriendRequests, fetchFriends, handleRequestFriend } from "../utils/friendHelpers";

export enum DataState {
        INITIAL,
        LOADING,
        ERROR,
        FULFILLED,
}
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

export const getFriendRequests = createAsyncThunk(
        'friends/get/fetchFriendRequests',
        async (user: User, thunkApi) => {
                const friendRequests = await fetchFriendRequests(user);
                if (!friendRequests) {
                        return thunkApi.rejectWithValue('error');
                }
                return friendRequests;
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
        async (requestId: string, thunkApi) => {
                const approvedRequest = await acceptFriendRequest(requestId);
                if (!approvedRequest) {
                        return thunkApi.rejectWithValue('error');
                }
                return approvedRequest;
        }
);


const initialState: GenericDataState<FriendSliceData> = {
        data: {
                friends: [],
                friendRequests: [],
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
                        .addCase(postFriendRequest.fulfilled, (state, action: PayloadAction<FriendRequest>) => {
                                state.data.friendRequests = [...state.data.friendRequests, action.payload] ?? [];
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
                        .addCase(approveFriendRequest.fulfilled, (state, action: PayloadAction<FriendRequest>) => {
                                const index = state.data.friendRequests.map((request) => request.id).indexOf(action.payload.id)
                                state.data.friendRequests.splice(index, 1, action.payload)
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
        },
});

export default friendsSlice.reducer;

export const { expireFriends } = friendsSlice.actions;

export const selectFriendsState = (state: RootState) =>
        state.friends.dataState;

export const selectFriends = (state: RootState) =>
        state.friends.data.friends || initialState.data.friends;

export const selectFriendRequests = (state: RootState) =>
        state.friends.data.friendRequests || initialState.data.friendRequests;
