import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import {
  approveFriendRequest,
  rejectFriendRequest,
  selectFriendRequests,
} from "../../../slices/friendsSlice";
import { AppDispatch } from "../../../utils/store";
import FriendRequestForm from "./FriendRequestForm";
import { useRef, useState } from "react";
import { Collapse, Image } from "@mantine/core";
import SvgButton from "@/components/utils/SvgButton";

function SmallFriendRequests() {
  const user = useSelector(selectUser);
  const friendRequests = useSelector(selectFriendRequests);
  const [openForm, setOpenForm] = useState(false);
  const circleNum = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleRejectRequest = (requestId: string) => {
    dispatch(rejectFriendRequest(requestId));
  };
  const handleAcceptRequest = (id: string) => {
    dispatch(approveFriendRequest({ requestId: id, userId: user.id }));
  };
  return (
    <>
      <Collapse in={open}></Collapse>
      <div
        className={`flex flex-col ${
          friendRequests.length > 0 && "gap-5"
        } px-4 items-center font-[Trispace] bg-[#D9D9D9] bg-opacity-5 p-4 w-full h-full rounded-[10px]`}
      >
        <div
          onClick={() => setOpen(!open)}
          className="flex justify-between w-full"
        >
          <img
            src={`../../public/${open ? "up" : "down"}.svg`}
            className="scale-150"
          />
          <h3>
            <span
              ref={circleNum}
              style={{
                border: "2px solid grey",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                width: "32px",
                height: "32px",
                padding: "5px",
                borderRadius: "50%",
                color: "#87F71E",
              }}
            >
              {friendRequests.length}
            </span>{" "}
            Requests
          </h3>
          <img
            className="scale-150"
            src={`../../public/${open ? "up" : "down"}.svg`}
          />
        </div>
        <Collapse style={{ width: "100%" }} in={open}>
          {friendRequests.length > 0 && (
            <>
              {friendRequests?.map((request) => (
                <div
                  className="flex justify-between items-center gap-2 w-full"
                  key={request.id}
                >
                  <p>
                    {request.requester_uuid === user.id
                      ? request.requestee_username
                      : request.requester_username}
                  </p>
                  <div>
                    {request.requester_uuid !== user.id && (
                      <SvgButton
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        <Image src="../../../public/fi_plus-circle.svg" />
                      </SvgButton>
                    )}

                    <SvgButton onClick={() => handleRejectRequest(request.id)}>
                      <Image src="../../../public/fi_x-circle.svg" />
                    </SvgButton>
                  </div>
                </div>
              ))}
            </>
          )}
          <div className="flex-column items-center gap-10 p-4 pb-2 w-full">
            <FriendRequestForm modalFunc={setOpenForm} modalOpen={openForm} />
          </div>
        </Collapse>
      </div>
    </>
  );
}

export default SmallFriendRequests;
