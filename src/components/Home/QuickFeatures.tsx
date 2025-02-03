import { Button, } from "@mantine/core";
import { NeonGradientCard } from "../magicui/neon-gradient-card";
import FriendRequestForm from "../Friends/components/FriendRequestForm";
import { useState } from "react";
import Hr from "../utils/Hr";

function QuickFeatures() {
        const [openForm, setOpenForm] = useState(false)
        return (
                <>
                        {/* <NeonGradientCard className="w-7/12 justify-end text-center m-5 w-auto h-max" > */}
                        <div style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: '20px', border: '1px solid black', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', margin: '20px', padding: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                                                        <Button
                                                                style={{ border: '1px solid grey' }}
                                                        >
                                                                Add Expense
                                                        </Button>
                                                        <Button
                                                                style={{ border: '1px solid grey' }}
                                                        >
                                                                View Profile
                                                        </Button>
                                                        {/* <Button
                                                                style={{ border: '1px solid grey' }}
                                                                color="violet"
                                                                onClick={() => setOpenForm(!openForm)}
                                                        >
                                                                Add Friend
                                                        </Button> */}
                                                </div>
                                                {/* {openForm && <div>
                                                        <Hr />
                                                        <div className="flex-column gap-10">
                                                                <FriendRequestForm modalFunc={setOpenForm} modalOpen={openForm} />
                                                        </div>
                                                </div>} */}
                                        </div>
                                </div>
                        </div>
                        {/* </NeonGradientCard> */}
                </>
        );
}

export default QuickFeatures;