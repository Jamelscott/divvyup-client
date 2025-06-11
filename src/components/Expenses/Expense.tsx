import { useState } from "react";
import { priceParser, youOweThem } from "../../utils/expenseHelpers";
import { ExpenseData, User } from "../../types";
import household from "../../../assets/expenseOptions/household.svg";
import rent from "../../../assets/expenseOptions/rent.svg";
import mortgage from "../../../assets/expenseOptions/mortgage.svg";
import diningOut from "../../../assets/expenseOptions/diningOut.svg";
import grocery from "../../../assets/expenseOptions/grocery.svg";
import pet from "../../../assets/expenseOptions/pet.svg";
import misc from "../../../assets/expenseOptions/misc.svg";
import EditExpense from "./ExpenseModal/EditExpense/EditExpense";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpense, selectUser } from "../../slices/userSlice";
import { selectFriends } from "../../slices/friendsSlice";
import StackedDate from "./components/StackedDate";
import { ExpenseListType } from "./ExpenseList";
import { AppDispatch } from "@/utils/store";
import ConfirmationModal from "@/utils/ConfirmationModal";
import classes from "./expense.module.css";

const expenseOptions = {
  household: household,
  rent: rent,
  mortgage: mortgage,
  ["dining out"]: diningOut,
  grocery: grocery,
  pet: pet,
  misc: misc,
};

function Expense({
  expense,
  sourceType,
}: {
  expense: ExpenseData;
  sourceType: ExpenseListType;
}) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const friends = useSelector(selectFriends);
  const friend = friends?.find(
    (friend) => friend.id === expense.lender || friend.id === expense.ower
  );
  const youOwe = youOweThem(expense, user.id);
  const expenseIcon = expenseOptions[`${expense.type}`];
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  // Create a Cloudinary instance and set your cloud name.
  const myImage = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUD_PROFILE,
    },
  })
    .image(friend?.photo)
    .resize(fill().width(40).height(40))
    .roundCorners(byRadius(100));

  const handleDeleteExpense = async () => {
    setOpenEditModal(false);
    await dispatch(deleteExpense({ expense, user }));
    setOpenConfirmModal(false);
  };
  return (
    <>
      <div className={classes.customContainer} key={`${expense.id}`}>
        <div className="flex gap-10">
          {sourceType === ExpenseListType.RECENT && (
            <div className="flex flex-col justify-between items-center">
              <div>
                <div className="bg-grey w-10 h-10 rounded-full border border-black">
                  <AdvancedImage cldImg={myImage} />
                </div>
              </div>
              <div>
                <p style={{ margin: "0 0" }}>{friend?.username}</p>
              </div>
            </div>
          )}
          <StackedDate date={expense.created_at} />
          {sourceType === ExpenseListType.USER_SPECIFIC && (
            <div className="flex flex-col items-center justify-center w-12">
              <img src={`${expenseIcon}`} alt="" />
              <p style={{ margin: "0 0" }}>{expense.type}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-20 text-center text-lg font-bold leading-6">
          <p style={{ margin: "0 0" }}>{expense.name}</p>
        </div>
        <div className="flex gap-10 w-fit">
          {sourceType === ExpenseListType.USER_SPECIFIC && (
            <>
              {!youOwe ? (
                <div className="flex flex-col justify-center text-nowrap">
                  <p style={{ margin: "0 0" }}>You paid</p>
                  <div className="text-center">
                    <p style={{ margin: "0 0" }}>{`$${expense.quantity}`}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-end justify-center text-nowrap">
                  <p style={{ margin: "0 0" }}>{friend?.username} paid</p>
                  <div className="text-center">
                    <p style={{ margin: "0 0" }}>${expense.quantity}</p>
                  </div>
                </div>
              )}
            </>
          )}
          <div className="flex flex-col items-end justify-center text-nowrap w-fit">
            <p style={{ margin: "0 0" }}>
              {!youOwe
                ? `${friend?.username} owes you`
                : `You owe ${friend?.username}`}
            </p>
            <p>
              <span style={{ color: `${!youOwe ? "green" : "red"}` }}>
                ${priceParser(expense)}
              </span>{" "}
              ({expense.splitpercentage}%)
            </p>
          </div>
          {sourceType === ExpenseListType.USER_SPECIFIC && (
            <div className="flex flex-col justify-between items-center">
              <Icons.edit handleOnClick={() => setOpenEditModal(true)} />
              <Icons.delete
                handleOnClick={() => setOpenConfirmModal((prev) => !prev)}
              />
            </div>
          )}
        </div>
      </div>
      {openEditModal && (
        <EditExpense
          setOpenEditModal={setOpenEditModal}
          expenseData={expense}
          friendData={friend as User}
        />
      )}
      {openConfirmModal && (
        <ConfirmationModal
          onClickNo={() => setOpenConfirmModal(false)}
          onClickYes={() => handleDeleteExpense()}
          message={"Are you sure you want to delete this expense?"}
        />
      )}
    </>
  );
}

export default Expense;

const Icons = {
  edit: ({ handleOnClick }: any) => (
    <div onClick={() => handleOnClick()}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.0505 1.94979C11.5459 1.44521 10.8751 1.16693 10.1616 1.16693C9.44823 1.16693 8.77741 1.44521 8.27283 1.94979L2.12857 8.09402C1.86898 8.3536 1.69981 8.68205 1.63973 9.04371L1.17891 11.8075C1.13224 12.0875 1.22442 12.3751 1.4245 12.5752C1.59075 12.7414 1.81648 12.833 2.04807 12.833C2.09648 12.833 2.14431 12.8289 2.19273 12.8208L4.95658 12.3599C5.31825 12.2998 5.64666 12.1307 5.90624 11.8711L12.0505 5.72686C12.5551 5.22227 12.8333 4.55084 12.8333 3.838C12.8333 3.12459 12.5551 2.45437 12.0505 1.94979ZM5.08141 11.0474C4.99507 11.1338 4.88541 11.1904 4.76525 11.2102L2.39574 11.6051L2.79066 9.23562C2.81049 9.11545 2.86707 9.00579 2.9534 8.91945L7.56524 4.30762L9.69324 6.43559L5.08141 11.0474ZM11.2257 4.90263L10.5181 5.61015L8.39007 3.48218L9.09766 2.77459C9.38175 2.4905 9.76032 2.3336 10.1616 2.3336C10.5636 2.3336 10.9416 2.4905 11.2257 2.77459C11.5098 3.05867 11.6667 3.43666 11.6667 3.83857C11.6667 4.24049 11.5098 4.61855 11.2257 4.90263Z"
          fill="#41416E"
        />
      </svg>
    </div>
  ),
  delete: ({ handleOnClick }: any) => (
    <div onClick={() => handleOnClick()}>
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.8748 3.54169H12.3539C12.0486 3.54169 11.7787 3.34762 11.6817 3.05791L11.4579 2.38494C11.2645 1.80623 10.724 1.41669 10.1141 1.41669H6.88482C6.27423 1.41669 5.73379 1.8063 5.54113 2.38572L5.31731 3.05722C5.22098 3.34692 4.95037 3.54169 4.64508 3.54169H2.12484C1.73384 3.54169 1.4165 3.85831 1.4165 4.25002C1.4165 4.64173 1.73384 4.95835 2.12484 4.95835H2.87921L3.41116 12.9384C3.50961 14.4217 4.75134 15.5834 6.23813 15.5834H10.7622C12.249 15.5834 13.4908 14.421 13.5892 12.9384L14.1212 4.95835H14.8748C15.2658 4.95835 15.5832 4.64173 15.5832 4.25002C15.5832 3.85831 15.2658 3.54169 14.8748 3.54169ZM6.88555 2.83335L10.1149 2.83266L10.3387 3.50554C10.3429 3.51829 10.3493 3.52894 10.3542 3.54169H6.64682C6.65107 3.52894 6.65817 3.5176 6.66243 3.50485L6.88555 2.83335ZM12.1754 12.8443C12.1258 13.5859 11.5053 14.1667 10.7615 14.1667H6.23744C5.4944 14.1667 4.87317 13.5859 4.82359 12.8443L4.29869 4.95835H4.64581C4.7216 4.95835 4.79595 4.94842 4.87032 4.94063C4.90078 4.94488 4.92699 4.95835 4.95886 4.95835H12.0422C12.0734 4.95835 12.1003 4.94417 12.1307 4.94063C12.2051 4.94842 12.2788 4.95835 12.3553 4.95835H12.7024L12.1754 12.8443ZM10.6248 7.79169V11.3334C10.6248 11.7251 10.3075 12.0417 9.9165 12.0417C9.5255 12.0417 9.20817 11.7251 9.20817 11.3334V7.79169C9.20817 7.39998 9.5255 7.08335 9.9165 7.08335C10.3075 7.08335 10.6248 7.39998 10.6248 7.79169ZM7.7915 7.79169V11.3334C7.7915 11.7251 7.47417 12.0417 7.08317 12.0417C6.69217 12.0417 6.37484 11.7251 6.37484 11.3334V7.79169C6.37484 7.39998 6.69217 7.08335 7.08317 7.08335C7.47417 7.08335 7.7915 7.39998 7.7915 7.79169Z"
          fill="#41416E"
        />
      </svg>
    </div>
  ),
};
