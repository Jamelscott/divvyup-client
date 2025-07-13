import { Controller, useForm } from "react-hook-form";
import { User, AddExpense, ExpenseData, ExpenseType } from "../../../types";
import { useState } from "react";
import { itemTypes } from "../../../utils/expenseHelpers";
import { useDispatch, useSelector } from "react-redux";
import {
  editExpense,
  getUserById,
  postExpense,
  selectUser,
} from "../../../slices/userSlice";
import { selectFriends } from "../../../slices/friendsSlice";
import { AppDispatch } from "../../../utils/store";
import { Button, Modal, Select } from "@mantine/core";
import { TextInput } from "@mantine/core";

function ExpenseModal({
  onClose,
  selectedFriend,
  expenseData,
  editing,
}: {
  editing?: boolean;
  expenseData?: ExpenseData;
  onClose: () => void;
  selectedFriend?: User;
}) {
  const user = useSelector(selectUser);
  const friends = useSelector(selectFriends);
  const dispatch = useDispatch<AppDispatch>();
  const isEditing = !!expenseData;
  const [addMore, setAddMore] = useState(false);
  const {
    handleSubmit,
    formState,
    control,
    reset,
    resetField,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      ower: expenseData?.ower || user.id,
      lender: expenseData?.lender || user.id,
      quantity: expenseData?.quantity || 1,
      name: expenseData?.name || "",
      type: expenseData?.type || "misc",
      purchasedBy: expenseData?.purchasedBy || "",
      splitpercentage: expenseData?.splitpercentage
        ? String(expenseData.splitpercentage)
        : "50",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typeValue, setTypeValue] = useState<string>(
    expenseData?.type || "misc"
  );

  const [_ower, _setOwer] = useState<User | null>(null);
  const [transactionFriend, setTransactionFriend] = useState<User | undefined>(
    selectedFriend
  );

  const isDirty =
    !!Object.keys(formState.dirtyFields).length || formState.dirtyFields;
  const readyToSubmit = isDirty && isValid && !!transactionFriend;
  const submitting = async (data: any) => {
    setIsLoading(true);
    if (editing) {
      const editNewExpenseData = {
        id: expenseData?.id as string,
        splitpercentage: Number(data.splitpercentage),
        ower: data.ower as string,
        lender: data.lender as string,
        name: data.name as string,
        type: data.type as ExpenseType,
        quantity: data.quantity as number,
      };
      await dispatch(
        editExpense({
          newExpenseData: editNewExpenseData as ExpenseData,
          expenseId: expenseData?.id as string,
        })
      );
    } else {
      await dispatch(
        postExpense({
          expenseData: data as AddExpense,
          user: user as User,
          transactionFriend: transactionFriend as User,
        })
      );
    }
    await dispatch(getUserById(user.id));
    if (!addMore) {
      onClose();
    }
    reset();
    setIsLoading(false);
  };

  return (
    <Modal
      opened
      onClose={onClose}
      size="xl"
      title={isEditing ? "Edit Expense" : "New Expense"}
      color="#102D27"
      withCloseButton={false}
      centered
      overlayProps={{
        opacity: 0.25,
      }}
      styles={{
        header: {
          backgroundColor: "#102D27",
          display: "flex",
          justifyContent: "center",
          fontFamily: "Trispace",
        },
        content: {
          backgroundColor: "#102D27",
          padding: "1rem",
          fontFamily: "Trispace",
          border: "1px solid black",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        },
        title: {
          fontSize: "30px",
        },
      }}
    >
      <div className="bg-[#102D27] flex gap-3 justify-center">
        <form onSubmit={handleSubmit((data) => submitting(data))}>
          <div className={`flex gap-10 justify-center mt-10 mb-10`}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label htmlFor="name">Name</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      style={{ boxShadow: "rgba(8, 4, 4, 0.35) 0px 5px 15px" }}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="splitpercentage">Taking on</label>
                <Controller
                  name="splitpercentage"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      allowDeselect={false}
                      id="splitpercentage"
                      required
                      rightSection={"%"}
                      data={["50", "100"]}
                      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="purchasedBy">Purchaser</label>
                <Controller
                  name="lender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={expenseData?.lender || user.id}
                      disabled={!transactionFriend}
                      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                      id="lenderOrOwer"
                      required
                      allowDeselect={false}
                      data={[
                        { label: "myself", value: user.id },

                        transactionFriend
                          ? {
                              label: transactionFriend.username,
                              value: transactionFriend.id,
                            }
                          : "",
                      ]}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label htmlFor="quantity">Price</label>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                      leftSectionPointerEvents="none"
                      leftSection={"$"}
                      type="number"
                      min="0.01"
                      step="0.01"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="friend">Friend</label>
                <Select
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                  id="friends"
                  searchable
                  defaultValue={selectedFriend?.username || ""}
                  onChange={(value) => {
                    resetField("lender");
                    const foundFriend = friends?.find(
                      (friend) => friend.id === value
                    );
                    if (!foundFriend)
                      throw new Error("bug finding friend in list");
                    setTransactionFriend(foundFriend);
                    return;
                  }}
                  required
                  name="friendsList"
                  allowDeselect={false}
                  data={
                    selectedFriend
                      ? [selectedFriend.username]
                      : friends.map((friend) => {
                          return { value: friend.id, label: friend.username };
                        })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              {" "}
              <>
                <div
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                  className="bg-[rgba(217,217,217,0.3)] border border-gray-700 rounded-[10px] w-[100px] h-[100px] flex justify-center items-center"
                >
                  <img
                    style={{ opacity: 1 }}
                    src={`../../public/large_expense_types/${typeValue}_large.svg`}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="type">type</label>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={expenseData?.type || "misc"}
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="type"
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                        searchable
                        data={itemTypes}
                        allowDeselect={false}
                      />
                    )}
                  />
                </div>
              </>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                loading={isLoading}
                disabled={!readyToSubmit}
                type="submit"
              >
                Finished
              </Button>
              <Button
                loading={isLoading}
                disabled={!readyToSubmit}
                onClick={() => {
                  setAddMore(true);
                }}
                type="submit"
              >
                Add more
              </Button>
            </div>
            <Button
              disabled={isLoading}
              onClick={() => onClose()}
              type="button"
            >
              Close
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ExpenseModal;
