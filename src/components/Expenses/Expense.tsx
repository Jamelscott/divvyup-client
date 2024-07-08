import { useContext, useState } from "react";
import { deleteExpense, priceParser, youOweThem } from "../../utils/expenseHelpers";
import { UserContext, UserContextType } from "../../context/userContext";
import { ExpenseData, User } from "../../types";
import "./expense.css"
import household from '../../../assets/expenseOptions/household.svg'
import rent from '../../../assets/expenseOptions/rent.svg'
import mortgage from '../../../assets/expenseOptions/mortgage.svg'
import diningOut from '../../../assets/expenseOptions/diningOut.svg'
import grocery from '../../../assets/expenseOptions/grocery.svg'
import pet from '../../../assets/expenseOptions/pet.svg'
import misc from '../../../assets/expenseOptions/misc.svg'
import TestModal from "./ExpenseModal/ExpenseModal";
import EditExpense from "./ExpenseModal/EditExpense/EditExpense";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { useSelector } from "react-redux";
import { selectUser } from "../../slices/userSlice";
import { selectFriends } from "../../slices/friendsSlice";


const expenseOptions = {
    household: household,
    rent: rent,
    mortgage: mortgage,
    ['dining out']: diningOut,
    grocery: grocery,
    pet: pet,
    misc: misc
}

function Expense({ expense }: { expense: ExpenseData }) {
    const user = useSelector(selectUser)
    const friends = useSelector(selectFriends)
    const friend = friends?.find((friend) => friend.id === expense.lender || friend.id === expense.ower)
    const negative = youOweThem(expense, user.id)
    const expenseIcon = expenseOptions[`${expense.type}`]
    const splitAmount = priceParser(expense)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    // Create a Cloudinary instance and set your cloud name.
    const cld = new Cloudinary({
        cloud: {
            cloudName: import.meta.env.VITE_CLOUD_PROFILE,
        }
    });

    // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
    const myImage = cld.image(friend?.photo);

    // Resize to 250 x 250 pixels using the 'fill' crop mode.
    myImage.resize(fill().width(40).height(40)).roundCorners(byRadius(100));

    const Values = () => {
        if (!negative) {
            return (
                <div>
                    <p style={{ margin: '0 0' }}>You paid - ${expense.quantity}</p>
                    <p style={{ margin: '0 0' }}>{friend?.username} owes you = <span style={{ color: 'green' }}>${splitAmount}</span> ({expense.splitpercentage}%) </p>
                </div>
            )
        } else {
            return (
                <div>
                    <p style={{ margin: '0 0' }}>{friend?.username} paid - ${expense.quantity}</p>
                    <p style={{ margin: '0 0' }}>You owe = <span style={{ color: 'red' }}>${priceParser(expense)}</span> ({expense.splitpercentage}%) </p>
                </div>
            )
        }
    }
    const handleDeleteExpense = () => {
        deleteExpense(expense, user)
    }
    return (
        <>
            <div className="single-container" key={`${expense.id}`}>
                <div className="single-friend-container">
                    <div>
                        <div style={{ backgroundColor: 'grey', width: '40px', height: '40px', borderRadius: '100px', border: '1px solid black' }}>
                            <AdvancedImage cldImg={myImage} />
                        </div>
                    </div>
                    <div className="single-friend-name">
                        <p style={{ margin: '0 0' }}>{friend?.username}</p>
                    </div>
                </div>
                <div className="single-type-container">
                    <div className="single-type-image">
                        <img src={`${expenseIcon}`} alt="" />
                    </div>
                    <div className="single-type-name">
                        <p style={{ margin: '0 0' }}>{expense.name}</p>
                    </div>
                </div>
                <div className="single-values-container">
                    <Values />
                    <input type="button" value='edit' onClick={() => setOpenEditModal(true)} />
                    <input type="button" value='delete' onClick={handleDeleteExpense} />
                </div>
                {openModal && <TestModal setOpenModal={setOpenModal} />}
                {openEditModal && <EditExpense setOpenEditModal={setOpenEditModal} expenseData={expense} friendData={friend as User} />}
            </div>
        </>
    );
}

export default Expense;