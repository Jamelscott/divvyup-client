import { FriendSourceType } from "@/components/Home/Home";
import { setActiveExpenseList } from "@/slices/friendsSlice";
import { selectUser } from "@/slices/userSlice";
import { User } from "@/types";
import { friendOwingDiff } from "@/utils/friendHelpers";
import { AdvancedImage } from "@cloudinary/react";
import { outline } from "@cloudinary/url-gen/actions/effect";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { Cloudinary } from "@cloudinary/url-gen/instance/Cloudinary";
import { Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import PriceDiff from "./PriceDiff";

function Friend({ friend, sourceType, handleOpenExpenseModal }: { friend: User, sourceType: FriendSourceType, handleOpenExpenseModal: (friend: User) => void }) {
        const user = useSelector(selectUser)
        const dispatch = useDispatch()
        const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUD_PROFILE, } }).image(friend.photo).resize(fill().width(100).height(100)).roundCorners(byRadius(100)).effect(outline().color("grey"))
        const friendDiff = friendOwingDiff(user, user.expenses, friend)
        const noExpenses = friendDiff.totalSpent === 0

        const handleAddActiveFriendList = (friendId: string) => {
                dispatch(setActiveExpenseList(friendId))
        }

        return (
                <div>
                        <div className="flex items-center justify-between">
                                <div className="flex-column justify-center text-center m-2">
                                        <div className="w-10 height-10 rounded-full border-black border bg-slate-500">
                                                <AdvancedImage cldImg={cld} />
                                        </div>
                                        <h4>{friend.username}</h4>
                                </div>
                                <PriceDiff friend={friend} noExpenses={noExpenses} />
                        </div>
                        <div className="flex gap-2 justify-between">
                                <Button
                                        style={{ border: '1px solid grey' }}
                                        size="sm"
                                        color="cyan"
                                        onClick={() => handleOpenExpenseModal(friend)}
                                >
                                        add expense
                                </Button>
                                {sourceType === FriendSourceType.FRIENDS_PAGE && <Button
                                        style={{ border: '1px solid grey' }}
                                        size="sm"
                                        color="yellow"
                                        disabled={noExpenses}
                                        onClick={() => handleAddActiveFriendList(friend.id)}
                                >
                                        view expenses
                                </Button>}
                                <Button
                                        style={{ border: '1px solid grey' }}
                                        size="sm"
                                        color="orange"
                                        disabled={noExpenses}
                                >
                                        settle up
                                </Button>
                                {sourceType === FriendSourceType.FRIENDS_PAGE && <Button
                                        style={{ border: '1px solid grey' }}
                                        size="sm"
                                        color="pink"
                                >
                                        remove friend
                                </Button>}
                        </div>
                </div>
        )
}

export default Friend;