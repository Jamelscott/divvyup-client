import { useMemo, useState } from "react";
import {
  handleDeleteExpense,
  priceParser,
  youOweThem,
} from "../../../utils/expenseHelpers";
import household from "../../../../assets/small_expense_icons/home.svg";
import rent from "../../../../assets/small_expense_icons/rent.svg";
import mortgage from "../../../../assets/small_expense_icons/mortgage.svg";
import diningOut from "../../../../assets/small_expense_icons/dining_out.svg";
import grocery from "../../../../assets/small_expense_icons/grocery.svg";
import pet from "../../../../assets/small_expense_icons/pet.svg";
import misc from "../../../../assets/small_expense_icons/misc.svg";

import { useDispatch, useSelector } from "react-redux";
import { getActiveSession, selectUser } from "../../../slices/userSlice";
import { selectFriends } from "../../../slices/friendsSlice";
import ConfirmationModal from "@/utils/ConfirmationModal";
import ExpenseTypePopover from "./ExpenseTypePopover";
import ExpenseModal from "@/components/Friends/components/ExpenseModal";
import onEnterOrSpaceKey from "@/utils/enterOrSpaceKey";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/utils/store";
import Hr from "@/components/utils/Hr";
import { ExpenseData, ExpenseListType, User } from "@/types.d";

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
  const navigate = useNavigate();
  const friends = useSelector(selectFriends);
  const dispatch = useDispatch<AppDispatch>();
  const friend = useMemo(
    () =>
      friends?.find(
        (friend) => friend.id === expense.lender || friend.id === expense.ower
      ),
    [friends, expense]
  );
  const youOwe = youOweThem(expense, user.id);
  const expenseIcon = expenseOptions[`${expense.type}`];
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const date = new Date(expense.created_at).toLocaleDateString();

  return (
    <>
      <div
        className="grid grid-cols-5 w-full font-[trispace]"
        key={`${expense.id}`}
      >
        <div>
          <h2
            style={{
              color: `${!youOwe ? "#509F33" : "#D96161"}`,
              fontSize: "20px",
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}
          >
            ${priceParser(expense)}
          </h2>
          <p
            style={{
              color: "#FFFFFF",
              fontSize: "15px",
              opacity: 0.3,
            }}
          >
            ({expense.splitpercentage}%)
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-12">
          <ExpenseTypePopover
            expenseIcon={expenseIcon}
            expenseName={expense.type}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-20 text-center text-lg font-bold leading-6">
          <p className="break-words" style={{ margin: "0 0" }}>
            {expense.name}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <p className="break-words">{date}</p>
        </div>
        {sourceType === ExpenseListType.USER_SPECIFIC ? (
          <div className="flex gap-5 justify-around items-center">
            <Icons.edit handleOnClick={() => setOpenEditModal(true)} />
            <Icons.delete
              handleOnClick={() => setOpenConfirmModal((prev) => !prev)}
            />
          </div>
        ) : (
          <div className="flex gap-5 justify-around items-center">
            <p
              className=" m-0 hover:underline cursor-pointer"
              onClick={() => navigate("/friends/" + friend?.id)}
            >
              {friend?.username &&
                friend.username.charAt(0).toUpperCase() +
                  friend.username.slice(1)}
            </p>
          </div>
        )}
      </div>
      {openEditModal && (
        <ExpenseModal
          editing
          onClose={() => setOpenEditModal(false)}
          expenseData={expense}
          selectedFriend={friend as User}
        />
      )}
      {openConfirmModal && (
        <ConfirmationModal
          onClickNo={() => setOpenConfirmModal(false)}
          onClickYes={async () => {
            await handleDeleteExpense(expense, user);
            await dispatch(getActiveSession());
            setOpenConfirmModal(false);
          }}
          message={"Are you sure you want to delete this expense?"}
        />
      )}
      <Hr width="100%" />
    </>
  );
}

export default Expense;

const Icons = {
  edit: ({ handleOnClick }: any) => (
    <div
      onKeyDown={(e) => onEnterOrSpaceKey(e, () => handleOnClick())}
      tabIndex={0}
      onClick={() => handleOnClick()}
      style={{ cursor: "pointer" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFDCB5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
        <path d="M16 5l3 3" />
      </svg>
    </div>
  ),
  delete: ({ handleOnClick }: any) => (
    <div
      onKeyDown={(e) => onEnterOrSpaceKey(e, () => handleOnClick())}
      tabIndex={0}
      onClick={() => handleOnClick()}
      style={{ cursor: "pointer" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D96161"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7l16 0" />
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
      </svg>{" "}
    </div>
  ),
};
