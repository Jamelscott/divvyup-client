import PriceDiff from "@/components/Friends/components/PriceDiff";
import { settleUpExpenses } from "@/slices/userSlice";
import { ExpenseData, User } from "@/types.d";
import { capitalizeFirstLetter } from "@/utils/friendHelpers";
import useFriend from "@/utils/hooks/useFriend";
import { AppDispatch } from "@/utils/store";
import { AdvancedImage } from "@cloudinary/react";
import { outline } from "@cloudinary/url-gen/actions/effect";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { Cloudinary } from "@cloudinary/url-gen/instance/Cloudinary";
import { Button, Modal } from "@mantine/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const FriendDetail = ({
  id,
  username,
  photo,
  userId,
  expenses,
}: {
  photo: string;
  id: string;
  username: string;
  userId: string;
  expenses: ExpenseData[];
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showSettleUpModal, setShowSettleUpModal] = useState(false);
  const { friend } = useFriend({
    friendId: id as string,
  }) as { friend: User };

  const cld = new Cloudinary({
    cloud: { cloudName: import.meta.env.VITE_CLOUD_PROFILE },
  })
    .image(photo)
    .resize(fill().width(200).height(200))
    .roundCorners(byRadius(1000))
    .effect(outline().color("grey"));

  const handleUserSettleUp = () => {
    dispatch(
      settleUpExpenses({
        expenses: expenses,
        friendId: id,
        userId: userId,
      })
    );
    setShowSettleUpModal(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full border-black border bg-slate-500">
        <AdvancedImage cldImg={cld} />
      </div>
      <div className="flex-1 flex justify-between items-center">
        <div className="flex flex-col">
          <p
            className=" hover:underline cursor-pointer"
            onClick={() => navigate(`/friends/${id}`)}
          >
            {capitalizeFirstLetter(username)}
          </p>
          <PriceDiff friend={friend} noExpenses={false} />
        </div>
        <Button
          size="xs"
          onClick={() => setShowSettleUpModal(true)}
          className="cursor-pointer text-sm"
        >
          settle
        </Button>
      </div>
      <Modal
        opened={showSettleUpModal}
        onClose={() => setShowSettleUpModal(false)}
        title={`Settle up with ${username}?`}
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
    </div>
  );
};
export default FriendDetail;
