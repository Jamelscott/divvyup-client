import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import friendsReducer from '../slices/friendsSlice';

const store = configureStore({
        reducer: {
                user: userReducer,
                friends: friendsReducer,
                // expenses: expensesReducer,
                //TODO   analytics: analyticsReducer, 
        },
        devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
