import { FriendSourceType } from "@/components/Home/Home";
import { deleteFriend } from "@/slices/friendsSlice";
import { selectUser, settleUpExpenses } from "@/slices/userSlice";
import { User } from "@/types";
import { friendOwingDiff } from "@/utils/friendHelpers";
import { AdvancedImage } from "@cloudinary/react";
import { outline } from "@cloudinary/url-gen/actions/effect";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { Cloudinary } from "@cloudinary/url-gen/instance/Cloudinary";
import { Modal, Button, Popover } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import PriceDiff from "./PriceDiff";
import { useState } from "react";
import { AppDispatch } from "@/utils/store";
import { Image } from "@mantine/core";
import { useNavigate } from "react-router-dom";
function FriendCard({
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
  const [openAddExpenseTooltip, setOpenAddExpenseTooltip] = useState(false);
  const [openViewExpensesTooltip, setOpenViewExpensesTooltip] = useState(false);
  const [openSettleTooltip, setOpenSettleTooltip] = useState(false);
  const [openRemoveTooltip, setOpenRemoveTooltip] = useState(false);
  const navigate = useNavigate();
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

  return (
    <div
      className={`flex flex-col grow font-[Trispace] bg-[#D9D9D9] bg-opacity-5 h-fit p-5 gap-4 min-w-[350px] max-w-[700px] ${
        sourceType === FriendSourceType.FRIEND_PAGE && "w-full"
      }`}
    >
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
          <Popover
            position="bottom"
            withArrow
            shadow="md"
            opened={openAddExpenseTooltip}
          >
            <Popover.Target>
              <Button
                onMouseEnter={() => setOpenAddExpenseTooltip(true)}
                onMouseLeave={() => setOpenAddExpenseTooltip(false)}
                variant="transparent"
                size="sm"
                className="!p-0"
                onClick={() => handleOpenExpenseModal(friend)}
              >
                <Image src="../../../public/plusSquare.svg" />{" "}
              </Button>
            </Popover.Target>
            <Popover.Dropdown style={{ pointerEvents: "none" }}>
              <p>Add Expense</p>
            </Popover.Dropdown>
          </Popover>
          {sourceType === FriendSourceType.FRIENDS_PAGE && (
            <div className="relative">
              <Popover
                position="bottom"
                withArrow
                shadow="md"
                opened={openViewExpensesTooltip}
              >
                <Popover.Target>
                  <Button
                    onMouseEnter={() => setOpenViewExpensesTooltip(true)}
                    onMouseLeave={() => setOpenViewExpensesTooltip(false)}
                    variant="transparent"
                    size="sm"
                    disabled={noExpenses}
                    className="!p-0"
                    onClick={() => navigate(`${friend.id}`)}
                  >
                    <Image src="../../../public/expensePaper.svg" />{" "}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown style={{ pointerEvents: "none" }}>
                  <p>Expenses</p>
                </Popover.Dropdown>
              </Popover>
              <div className="absolute top-[-5px] right-0 text-[10px] text-[#74C0FC]">
                <p>{userPayments.length + friendPayments.length}</p>
              </div>
            </div>
          )}
          <Popover
            position="bottom"
            withArrow
            shadow="md"
            opened={openSettleTooltip}
          >
            <Popover.Target>
              <Button
                onMouseEnter={() => setOpenSettleTooltip(true)}
                onMouseLeave={() => setOpenSettleTooltip(false)}
                variant="transparent"
                disabled={noExpenses}
                className="!p-0"
                onClick={() => setShowSettleUpModal(true)}
              >
                <Image src="../../../public/checkSquare.svg" />{" "}
              </Button>
            </Popover.Target>
            <Popover.Dropdown style={{ pointerEvents: "none" }}>
              <p>Settle</p>
            </Popover.Dropdown>
          </Popover>
        </div>
        <div>
          <Popover
            position="bottom"
            withArrow
            shadow="md"
            opened={openRemoveTooltip}
          >
            <Popover.Target>
              <Button
                onMouseEnter={() => setOpenRemoveTooltip(true)}
                onMouseLeave={() => setOpenRemoveTooltip(false)}
                size="sm"
                variant="transparent"
                className="!p-0"
                onClick={() => setShowRemoveFriendModal(true)}
              >
                <Image src="../../../public/removeFriend.svg" />{" "}
              </Button>
            </Popover.Target>
            <Popover.Dropdown style={{ pointerEvents: "none" }}>
              <p>Remove</p>
            </Popover.Dropdown>
          </Popover>
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

export default FriendCard;
