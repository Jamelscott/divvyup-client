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
import { Modal, Button, Popover } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import PriceDiff from "./PriceDiff";
import { useState } from "react";
import { AppDispatch } from "@/utils/store";

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
  const [openAddExpenseTooltip, setOpenAddExpenseTooltip] = useState(false);
  const cld = new Cloudinary({
    cloud: { cloudName: import.meta.env.VITE_CLOUD_PROFILE },
  })
    .image(friend.photo)
    .resize(fill().width(100).height(100))
    .roundCorners(byRadius(100))
    .effect(outline().color("grey"));
  const friendDiff = friendOwingDiff(user, user.expenses, friend);
  const noExpenses = friendDiff.totalSpent === 0;

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
        <Popover
          position="top-start"
          withArrow
          shadow="md"
          opened={openAddExpenseTooltip}
        >
          <Popover.Target>
            <Button
              onMouseEnter={() => setOpenAddExpenseTooltip(true)}
              onMouseLeave={() => setOpenAddExpenseTooltip(false)}
              style={{ border: "1px solid grey" }}
              size="sm"
              color="cyan"
              onClick={() => handleOpenExpenseModal(friend)}
            >
              add expense
            </Button>
          </Popover.Target>
          <Popover.Dropdown style={{ pointerEvents: "none" }}>
            <p>Add an expense</p>
          </Popover.Dropdown>
        </Popover>

        <Button
          style={{ border: "1px solid grey" }}
          size="sm"
          color="cyan"
          onClick={() => handleOpenExpenseModal(friend)}
        >
          add expense
        </Button>
        {sourceType === FriendSourceType.FRIENDS_PAGE && (
          <Button
            style={{ border: "1px solid grey" }}
            size="sm"
            color="yellow"
            disabled={noExpenses}
            onClick={() => dispatch(setActiveExpenseList(friend.id))}
          >
            view expenses
          </Button>
        )}
        <Button
          style={{ border: "1px solid grey" }}
          size="sm"
          color="orange"
          disabled={noExpenses}
          onClick={() => setShowSettleUpModal(true)}
        >
          settle up
        </Button>
        {sourceType === FriendSourceType.FRIENDS_PAGE && (
          <Button
            style={{ border: "1px solid grey" }}
            size="sm"
            color="pink"
            onClick={() => setShowRemoveFriendModal(true)}
          >
            remove friend
          </Button>
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
