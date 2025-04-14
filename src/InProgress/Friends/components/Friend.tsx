import { FriendSourceType } from "@/components/Home/Home";
import { deleteFriend, setActiveExpenseList } from "@/slices/friendsSlice";
import { selectUser, settleUpExpenses } from "@/slices/userSlice";
import { User } from "@/types";
import { friendOwingDiff } from "@/utils/friendHelpers";
import { AdvancedImage } from "@cloudinary/react";
import { outline } from "@cloudinary/url-gen/actions/effect";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { Cloudinary } from "@cloudinary/url-gen/instance/Cloudinary";
import { Modal, Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import PriceDiff from "./PriceDiff";
import { useState } from "react";
import { AppDispatch } from "@/utils/store";
import { Image } from "@mantine/core";
function Friend({
  friend,
  sourceType,
  handleOpenExpenseModal,
}: {
  friend: User;
  sourceType: FriendSourceType;
  handleOpenExpenseModal: (friend: User) => void;
}) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [showSettleUpModal, setShowSettleUpModal] = useState(false);
  const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false);
  const cld = new Cloudinary({
    cloud: { cloudName: import.meta.env.VITE_CLOUD_PROFILE },
  })
    .image(friend.photo)
    .resize(fill().width(100).height(100))
    .format("png")
    .roundCorners(byRadius(100))
    .effect(outline().color("grey"));
  const { totalSpent, friendSpent, userSpent, userPayments, friendPayments } =
    friendOwingDiff(user, user.expenses, friend);
  const noExpenses = totalSpent === 0;

  const handleUserSettleUp = () => {
    dispatch(
      settleUpExpenses({
        expenses: user.expenses,
        friendId: friend.id,
        userId: user.id,
      })
    );
    setShowSettleUpModal(false);
  };
  const handleRemoveUserFriend = () => {
    dispatch(deleteFriend({ friendId: friend.id, userId: user.id }));
    setShowRemoveFriendModal(false);
  };
  const friendSplitBar = (friendSpent / totalSpent) * 100;
  const userSplitBar = (userSpent / totalSpent) * 100;
  console.log(friendOwingDiff(user, user.expenses, friend));
  console.log(userSplitBar, friendSplitBar);
  return (
    <div className="flex flex-col grow font-[Trispace] bg-[#D9D9D9] bg-opacity-5 h-fit p-5 gap-4 min-w-[350px] max-w-[500px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-center">
          <div className="w-10 height-10 rounded-full border-black border bg-slate-500">
            <AdvancedImage cldImg={cld} />
          </div>
          <h4 className="text-[22px]">
            {friend.username.charAt(0).toUpperCase() + friend.username.slice(1)}
          </h4>
        </div>
        <PriceDiff friend={friend} noExpenses={noExpenses} />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Button
            variant="transparent"
            size="sm"
            className="!p-0"
            onClick={() => handleOpenExpenseModal(friend)}
          >
            <Image src="../../../public/plusSquare.svg" />{" "}
          </Button>
          {sourceType === FriendSourceType.FRIENDS_PAGE && (
            <div className="relative">
              <Button
                variant="transparent"
                size="sm"
                disabled={noExpenses}
                className="!p-0"
                onClick={() => dispatch(setActiveExpenseList(friend.id))}
              >
                <Image src="../../../public/expensePaper.svg" />{" "}
              </Button>
              <div className="absolute top-[-5px] right-0 text-[10px] text-[#74C0FC]">
                <p>{userPayments.length + friendPayments.length}</p>
              </div>
            </div>
          )}
          <Button
            size="sm"
            variant="transparent"
            disabled={noExpenses}
            className="!p-0"
            onClick={() => setShowSettleUpModal(true)}
          >
            <Image src="../../../public/checkSquare.svg" />{" "}
          </Button>
        </div>
        <div>
          {sourceType === FriendSourceType.FRIENDS_PAGE && (
            <Button
              size="sm"
              variant="transparent"
              className="!p-0"
              onClick={() => setShowRemoveFriendModal(true)}
            >
              <Image src="../../../public/removeFriend.svg" />{" "}
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <p>${userSpent.toFixed(0)} Paid</p>
          <p>${friendSpent.toFixed(0)} Borrowed</p>
        </div>
        {friendPayments.length > 0 || userPayments.length > 0 ? (
          <div className="flex w-full rounded-lg">
            <div
              style={{ width: `${userSplitBar}%` }}
              className={`w-[${userSplitBar}%] h-2 bg-[#509F33] rounded${
                friendSplitBar === 0 ? "" : "-l"
              }-lg`}
            ></div>
            <div
              style={{ width: `${friendSplitBar}%` }}
              className={`h-2 bg-[#D96161] rounded${
                userSplitBar === 0 ? "" : "-r"
              }-lg`}
            ></div>
          </div>
        ) : (
          <div
            className={`w-[100%] h-2 bg-[#c9c9c9] opacity-[0.5] rounded-lg`}
          ></div>
        )}
      </div>
      <Modal
        opened={showSettleUpModal}
        onClose={() => setShowSettleUpModal(false)}
        title={`Settle up with ${friend.username}?`}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2>All expenses will be removed (forever)</h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <Button color="red" onClick={() => setShowSettleUpModal(false)}>
              No
            </Button>
            <Button color="green" onClick={handleUserSettleUp}>
              Yes
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={showRemoveFriendModal}
        onClose={() => setShowRemoveFriendModal(false)}
        title={`Remove Friend: ${friend.username}.`}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2>This will remove the user and all expenses with that user.</h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <Button color="red" onClick={() => setShowRemoveFriendModal(false)}>
              No
            </Button>
            <Button color="green" onClick={handleRemoveUserFriend}>
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Friend;
