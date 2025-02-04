import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ExpenseData, GenericDataState, User, UserLogin, AddExpense } from "../types";
import { handleDeleteUserExpenseSession, handleLogout, handleUpdateUserExpenseSession, handleUserSession, loginEmailOrUsername } from "../utils/loginHelpers";
import { RootState } from "../utils/store";
import { handleAddExpense, handleDeleteExpense, handleEditExpense, handleFetchSingleProfileExpenses } from "../utils/expenseHelpers";
import { uploadProfilePhoto } from "../utils/profileHelper";
import { supabase } from "../supabase";

export enum DataState {
	INITIAL,
	LOADING,
	ERROR,
	FULFILLED,
}
export const getUser = createAsyncThunk(
	'user/get/fetchUser',
	async (loginCreds: UserLogin, thunkApi) => {
		const loggedUser = await loginEmailOrUsername(loginCreds);
		if (!loggedUser) {
			return thunkApi.rejectWithValue('error');
		}
		const userExpenses = await handleFetchSingleProfileExpenses(loggedUser?.id as any)
		const user = {
			...loggedUser, expenses: userExpenses
		} as User;
		sessionStorage.setItem('user', JSON.stringify(user));
		if (!loggedUser) {
			return thunkApi.rejectWithValue('error');
		}
		return user;
	}
);

export const getUserById = createAsyncThunk(
	'user/get/fetchUserById',
	async (userId: string, thunkApi) => {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single()
		const userExpenses = await handleFetchSingleProfileExpenses(data.id)
		const user = {
			...data, expenses: userExpenses
		} as User;
		if (error) {
			return thunkApi.rejectWithValue('error');
		}
		return user;
	}
);
export const getActiveSession = createAsyncThunk(
	'user/get/getActiveSession',
	async (thunkApi) => {
		const session = await supabase.auth.getSession()
		if (!session || !session.data.session) {
			return null
		}

		const { id } = session.data.session.user
		const { data: profile, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', id)
			.single()
		const userExpenses = await handleFetchSingleProfileExpenses(id as any)

		const userSessionData: User = {
			id: id,
			username: profile.username,
			email: profile.email,
			expenses: userExpenses,
			photo: profile.photo
		}
		return userSessionData
		// if (error) {
		// 	return thunkApi.rejectWithValue('error');
		// }
		// return user;
	}
);

export const updatePhoto = createAsyncThunk(
	'user/put/photo',
	async (params: { user: User, publicId: string }, thunkApi) => {
		const { user, publicId } = params;
		try {
			await uploadProfilePhoto(user, publicId)
		} catch (err) {
			console.error(err)
			return thunkApi.rejectWithValue('error');
		}
		return publicId;
	}
);

export const postExpense = createAsyncThunk(
	'user/post/expenses',
	async (params: { expenseData: AddExpense, user: User, transactionFriend: User }, thunkApi) => {
		const { user, expenseData, transactionFriend } = params;
		try {
			const newExpense = await handleAddExpense(expenseData, user, transactionFriend)
			handleUpdateUserExpenseSession(newExpense)
			return newExpense;
		} catch (err) {
			console.error(err)
			return thunkApi.rejectWithValue('error');
		}
	}
);

export const deleteExpense = createAsyncThunk(
	'user/delete/expense',
	async (params: { expense: ExpenseData, user: User }, thunkApi) => {
		const { expense, user } = params;
		try {
			await handleDeleteExpense(expense, user)
			handleDeleteUserExpenseSession(expense)
			return expense
		} catch (err) {
			console.error(err)
			return thunkApi.rejectWithValue('error');
		}
	}
)

export const editExpense = createAsyncThunk(
	'user/edit/expense',
	async (params: { newExpenseData: ExpenseData, expenseId: string }, thunkApi) => {
		const { newExpenseData, expenseId } = params;
		try {
			const updatedExpenses = await handleEditExpense(newExpenseData, expenseId)
			return updatedExpenses
		} catch (err) {
			console.error(err)
			return thunkApi.rejectWithValue('error');
		}
	}
)

export const logoutUser = createAsyncThunk(
	'user/logout',
	async (_params, thunkApi) => {
		try {
			await handleLogout()
			return;
		} catch (err) {
			console.error(err)
			return thunkApi.rejectWithValue('error');
		}
	}
);

const initialState: GenericDataState<User> = {
	data: {
		id: '',
		username: '',
		email: '',
		expenses: [],
		photo: '',
	},
	dataState: DataState.INITIAL,
	error: null
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		userSession(state) {
			const potentialUser = handleUserSession()
			if (potentialUser) {
				state.data = potentialUser;
				state.dataState = DataState.FULFILLED;
			} else {
				state.data = initialState.data;
				state.dataState = DataState.INITIAL;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUser.pending, (state) => {
				state.dataState = DataState.LOADING;
			})
			.addCase(
				getUser.fulfilled,
				(state, action: PayloadAction<User | undefined>) => {
					state.data = action.payload ?? ({} as User);
					state.dataState = DataState.FULFILLED;
				}
			)
			.addCase(getUser.rejected, (state, action) => {
				if (action.payload) {
					state.error = action.payload;
				} else {
					state.error = 'err';
				}
				state.dataState = DataState.ERROR;
			})
			.addCase(getUserById.pending, (state) => {
				state.dataState = DataState.LOADING;
			})
			.addCase(
				getUserById.fulfilled,
				(state, action: PayloadAction<User | undefined>) => {
					state.data = action.payload ?? ({} as User);
					state.dataState = DataState.FULFILLED;
				}
			)
			.addCase(getUserById.rejected, (state, action) => {
				if (action.payload) {
					state.error = action.payload;
				} else {
					state.error = 'err';
				}
				state.dataState = DataState.ERROR;
			})
			.addCase(updatePhoto.pending, (state) => {
				state.dataState = DataState.LOADING;
			})
			.addCase(
				updatePhoto.fulfilled,
				(state, action: PayloadAction<string>) => {
					state.data.photo = action.payload;
					state.dataState = DataState.FULFILLED;
				}
			)
			.addCase(updatePhoto.rejected, (state, action) => {
				if (action.payload) {
					state.error = action.payload;
				} else {
					state.error = 'err';
				}
				state.dataState = DataState.ERROR;
			})
			.addCase(postExpense.pending, (state) => {
				state.dataState = DataState.LOADING;
			})
			.addCase(
				postExpense.fulfilled,
				(state, action: PayloadAction<ExpenseData>) => {
					state.data.expenses.unshift(action.payload);
					state.dataState = DataState.FULFILLED;
				}
			)
			.addCase(postExpense.rejected, (state, action) => {
				if (action.payload) {
					state.error = action.payload;
				} else {
					state.error = 'err';
				}
				state.dataState = DataState.ERROR;
			})
			.addCase(logoutUser.pending, (state) => {
				state.dataState = DataState.LOADING;
			})
			.addCase(
				logoutUser.fulfilled,
				(state) => {
					state.data = initialState.data;
					state.dataState = DataState.INITIAL
				}
			)
			.addCase(logoutUser.rejected, (state, action) => {
				if (action.payload) {
					state.error = action.payload;
				} else {
					state.error = 'err';
				}
				state.dataState = DataState.ERROR;
			})
			.addCase(getActiveSession.pending, (state) => {
				state.dataState = DataState.LOADING;
			})
			.addCase(
				getActiveSession.fulfilled,
				(state, action) => {
					state.data = action.payload ?? ({} as User);
					state.dataState = DataState.FULFILLED
				}
			)
			.addCase(getActiveSession.rejected, (state, action) => {
				if (action.payload) {
					state.error = action.payload;
				} else {
					state.error = 'err';
				}
				state.dataState = DataState.ERROR;
			})
			.addCase(deleteExpense.pending, (state) => {
				state.dataState = DataState.LOADING;
			})
			.addCase(
				deleteExpense.fulfilled,
				(state, action) => {
					state.data.expenses = state.data.expenses.filter((expense) => expense.id !== action.payload.id)
					state.dataState = DataState.FULFILLED
				}
			)
			.addCase(deleteExpense.rejected, (state, action) => {
				if (action.payload) {
					state.error = action.payload;
				} else {
					state.error = 'err';
				}
				state.dataState = DataState.ERROR;
			})
			.addCase(editExpense.pending, (state) => {
				state.dataState = DataState.LOADING;
			})
			.addCase(
				editExpense.fulfilled,
				(state, action) => {
					if (action.payload) {
						const pos = state.data.expenses.map(e => e.id).indexOf(action.payload.id);
						state.data.expenses[pos] = action.payload
						state.dataState = DataState.FULFILLED
					}
				}
			)
			.addCase(editExpense.rejected, (state, action) => {
				if (action.payload) {
					state.error = action.payload;
				} else {
					state.error = 'err';
				}
				state.dataState = DataState.ERROR;
			})
	},
});

export default userSlice.reducer;

export const { userSession } = userSlice.actions;

export const selectUserState = (state: RootState) =>
	state.user.dataState;

export const selectUser = (state: RootState) =>
	state.user.data as User || initialState.data;
export const selectExpenses = (state: RootState) =>
	state.user.data?.expenses || [];

export const selectExpenseUserPaidFor = (state: RootState) =>
	state.user.data?.expenses.filter(expense => expense.lender === state.user.data.id).sort();