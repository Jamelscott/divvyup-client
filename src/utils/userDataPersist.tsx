import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DataState, getFriends, selectFriendsState } from "../slices/friendsSlice"
import { AppDispatch } from "./store"
import { selectUser } from "../slices/userSlice"
import { User } from "../types"

const useDataPersist = async () => {
        const user = useSelector(selectUser)
        const friendsDataState = useSelector(selectFriendsState)
        const dispatch = useDispatch<AppDispatch>()
        const [friends, setFriends] = useState<User[]>()

        if (user.id && friendsDataState === DataState.INITIAL) {
                await dispatch(getFriends(user.id))
        }
        return;
}

export default useDataPersist