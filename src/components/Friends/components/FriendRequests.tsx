import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import { approveFriendRequest, rejectFriendRequest, selectFriendRequests } from "../../../slices/friendsSlice";
import { AppDispatch } from "../../../utils/store";
import { Button } from "@mantine/core";
import FriendRequestForm from "./FriendRequestForm";
import { useState } from "react";
import Hr from "@/components/utils/Hr";

function FriendRequests() {
	const user = useSelector(selectUser)
	const friendRequests = useSelector(selectFriendRequests)
	const [openForm, setOpenForm] = useState(false)

	const dispatch = useDispatch<AppDispatch>()

	const handleRejectRequest = (requestId: string) => {
		dispatch(rejectFriendRequest(requestId))
	}
	const handleAcceptRequest = (id: string) => {
		dispatch(approveFriendRequest({requestId:id, userId: user.id}))
	}
	return <>
		<div className=" flex flex-col gap-5 items-center bg-white md:shadow-xl border rounded-3xl border border-black p-5 w-fit">
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
				<h3><b>Add a Friend</b></h3>
				<div className="flex-column gap-10">
					<FriendRequestForm modalFunc={setOpenForm} modalOpen={openForm} />
				</div>
			</div>
			{friendRequests.length > 0 &&
				<>
					<Hr />
					<div className="text-center" >
						<div style={{ marginBottom: '10px' }}>
							<h3 ><b>Pending Friend Requests</b></h3>
						</div>
						<div>
							{friendRequests?.map((request) => (
								<div className="flex justify-between items-center m-5 gap-2" key={request.id}>
									<p>{request.requester_uuid === user.id ? request.requestee_username : request.requester_username}</p>
									<div>
										{request.requester_uuid !== user.id && <Button
											style={{ border: '1px solid grey' }}
											color="cyan"
											onClick={() => handleAcceptRequest(request.id)}
											size="sx"
										>
											{request.requester_uuid === user.id ? 'pending' : 'accept'}
										</Button>}
										<Button
											style={{ border: '1px solid grey' }}
											color="pink"
											onClick={() => handleRejectRequest(request.id)}
											size="sx"
										>
											{request.requester_uuid === user.id ? 'remove' : 'reject'}
										</Button>
									</div>
								</div>))}
						</div>
					</div>
				</>
			}
		</div >

	</>
		;
}

export default FriendRequests;
