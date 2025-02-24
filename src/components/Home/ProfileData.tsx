import { selectExpenses, selectUser } from "@/slices/userSlice";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { calcTotalExpenseDiff } from "@/utils/expenseHelpers";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import SparklesText from "../magicui/sparkles-text";
import { outline } from "@cloudinary/url-gen/actions/effect";
import { selectFriends } from "@/slices/friendsSlice";

function ProfileData() {
        const user = useSelector(selectUser)
        const expenses = useSelector(selectExpenses)
        const expenseDiff = useMemo(() => calcTotalExpenseDiff(expenses, user), [expenses])
        const friends = useSelector(selectFriends)

        const getTotalNum = (num: number) => {
                return Number(Math.round(parseFloat(Math.abs(num) + 'e' + 2)) + 'e-' + 2).toFixed(2);
        }
        const checkOwing = useMemo(() => {
                if (expenseDiff > 0) {
                        return <h3 style={{ color: 'green' }}>Overall, you are owed ${expenseDiff.toFixed(2)}</h3>
                } else if (expenseDiff < 0) {
                        return <h3 style={{ color: 'red' }}>Overall, you owe ${getTotalNum(expenseDiff)}</h3>
                } else if (expenseDiff === 0 && expenses.length > 1) {
                        return <h3 style={{ color: 'black' }}>You are all squared up</h3>
                } else {
                        return <></>
                }
        }, [friends])
        const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUD_PROFILE, } }).image(user.photo).resize(fill().width(100).height(100)).roundCorners(byRadius(100)).effect(outline().color("grey"))
        const adjsutedName = user.username.replace(user.username.charAt(0), user.username.charAt(0).toUpperCase())
        return (
                <div className=" flex flex-col gap-5 items-center py-3 px-16 w-fit border border-black rounded-3xl shadow-xl bg-white">
                        <div className="flex-column items-center text-center gap-5">
                                <div className="flex items-center gap-5">
                                        <AdvancedImage cldImg={cld} />
                                        <SparklesText sparklesCount={4} className="loginText" text={adjsutedName} />
                                </div>
                                <div>
                                        {checkOwing}
                                </div>
                        </div>
                </div>
        );
}

export default ProfileData;