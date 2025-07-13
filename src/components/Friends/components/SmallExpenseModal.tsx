import { useForm } from "react-hook-form";
import { User, AddExpense } from "../../../types";
import { useState } from "react";
import { itemTypes } from "../../../utils/expenseHelpers";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserById,
  postExpense,
  selectUser,
} from "../../../slices/userSlice";
import { selectFriends } from "../../../slices/friendsSlice";
import { AppDispatch } from "../../../utils/store";
import { Button, Select } from "@mantine/core";
import { TextInput } from "@mantine/core";

function SmallExpenseModal({
  onClose,
  selectedFriend,
}: {
  onClose: () => void;
  selectedFriend?: User;
}) {
  const user = useSelector(selectUser);
  const friends = useSelector(selectFriends);
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      lender: user.id,
      splitpercentage: "50",
      quantity: 1,
      name: "",
      type: "",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_typeValue, setTypeValue] = useState<string>("misc");

  const [_ower, _setOwer] = useState<User | null>(null);
  const [transactionFriend, _setTransactionFriend] = useState<User | undefined>(
    selectedFriend
  );

  const isDirty =
    !!Object.keys(formState.dirtyFields).length || formState.dirtyFields;
  const readyToSubmit =
    isDirty &&
    isValid &&
    !!transactionFriend &&
    !!getValues().lender &&
    !!getValues().quantity &&
    !!getValues().splitpercentage &&
    !!getValues().name &&
    !!getValues().type;

  const submitting = async (data: any) => {
    setIsLoading(true);
    await dispatch(
      postExpense({
        expenseData: data as AddExpense,
        user: user,
        transactionFriend: transactionFriend as User,
      })
    );
    await dispatch(getUserById(user.id));
    onClose();
    setIsLoading(false);
  };

  return (
    <div className="bg-[#102D27] flex justify-center p-5">
      <form onSubmit={handleSubmit((data) => submitting(data))}>
        <div className="flex justify-center w-full p-2 gap-5" onClick={onClose}>
          <img src={`../../public/down.svg`} />
          <h1>New Expense</h1>
          <img src={`../../public/down.svg`} />
        </div>
        <div className={`flex gap-10 justify-center mt-5 mb-10`}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <TextInput
                required
                {...register("name", {
                  required: true,
                })}
                style={{ boxShadow: "rgba(8, 4, 4, 0.35) 0px 5px 15px" }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="splitpercentage">Taking on</label>
              <Select
                allowDeselect={false}
                id="splitpercentage"
                defaultValue={formState.defaultValues?.splitpercentage}
                required
                rightSection={"%"}
                data={["50", "100"]}
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="purchasedBy">Purchaser</label>
              <Select
                // {...register("lender", { required: true })}
                // onChange={(e) => setValue('lender', e.target.value)}
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                id="lenderOrOwer"
                required
                allowDeselect={false}
                data={[
                  "myself",
                  transactionFriend
                    ? {
                        label: transactionFriend.username,
                        value: transactionFriend.id,
                      }
                    : "",
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="quantity">Price</label>
              <TextInput
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                {...register("quantity", { required: true })}
                onChange={(e) => {
                  if (e) {
                    setValue("quantity", Number(e.target.value));
                  }
                }}
                leftSectionPointerEvents="none"
                leftSection={"$"}
                required
                type="number"
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="friend">Friend</label>
              <Select
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                id="friends"
                searchable
                defaultValue={selectedFriend?.username || ""}
                // onChange={(value) => {
                //   const foundFriend = friends?.find(
                //     (friend) => friend.username === value
                //   );
                //   if (!foundFriend)
                //     throw new Error("bug finding friend in list");
                //   setTransactionFriend(foundFriend);
                //   return;
                // }}
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
            <div className="flex flex-col">
              <label htmlFor="type">type</label>
              <Select
                {...register("type", {
                  required: "Please enter an expense type.",
                })}
                id="type"
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                searchable
                onChange={(value) => {
                  if (value) {
                    setTypeValue(value);
                    setValue("type", value);
                  }
                }}
                defaultValue="misc"
                required
                data={itemTypes}
                allowDeselect={false}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button disabled={isLoading} onClick={() => onClose()} type="button">
            Close
          </Button>
          <Button loading={isLoading} disabled={!readyToSubmit} type="submit">
            Finished
          </Button>
          <Button
            loading={isLoading}
            disabled={!readyToSubmit}
            onClick={() => console.log("reset")}
            type="submit"
          >
            Add more
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SmallExpenseModal;
