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
import { Button } from "@mantine/core";
import { TextInput } from "@mantine/core";

function ExpenseModal({
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
      quantity: null,
      name: "",
      type: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [_ower, setOwer] = useState<User | null>(null);
  const [transactionFriend, setTransactionFriend] = useState<User | undefined>(
    selectedFriend
  );

  const isDirty =
    !!Object.keys(formState.dirtyFields).length || formState.dirtyFields;
  const readyToSubmit = isDirty && isValid;
  // !!transactionFriend &&
  // !!getValues().lender &&
  // !!getValues().quantity &&
  // !!getValues().splitpercentage &&
  // !!getValues().name &&
  // !!getValues().type

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
    <div className="">
      <form onSubmit={handleSubmit((data) => submitting(data))}>
        <label htmlFor="friend">Friend: </label>
        <select
          id="friends"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          defaultValue={"selectFriend"}
          onChange={(e) => {
            const foundFriend = friends?.find(
              (friend) => friend.id === e.target.value
            );
            if (!foundFriend) throw new Error("bug finding friend in list");
            setTransactionFriend(foundFriend);
            return;
          }}
          required
          name="friendsList"
        >
          {selectedFriend ? (
            <option value={selectedFriend.id} selected>
              {selectedFriend.username}
            </option>
          ) : (
            friends?.map((friend, idx) => {
              return (
                <option key={idx} value={friend.id}>
                  {friend.username}
                </option>
              );
            })
          )}
        </select>
        <br />
        <label htmlFor="name">Purchase Name: </label>
        <TextInput required {...register("name", { required: true })} />
        <br />
        <label htmlFor="type">type: </label>
        <select
          {...register("type", { required: "Please enter an expense type." })}
          id="type"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          // onChange={(e) => setValue('type', e.target.value)}
          defaultValue={"selectType"}
          required
        >
          <option value="selectType" disabled>
            Select a type
          </option>
          {itemTypes.map((item, idx) => {
            return (
              <option key={idx} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <br />
        <label htmlFor="quantity">Price ($): </label>
        <TextInput
          {...register("quantity", { required: true })}
          // onChange={(e) => setValue('quantity', e.target.value)}
          required
          type="number"
          min="0.01"
          step="0.01"
        />
        <br />
        <label htmlFor="purchasedBy">Purchased by: </label>
        <select
          {...register("lender", { required: true })}
          // onChange={(e) => setValue('lender', e.target.value)}
          id="lenderOrOwer"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        >
          <option onClick={() => setOwer(user)} value={user.id}>
            Myself
          </option>
          {transactionFriend && (
            <option
              // onClick={() => setValue('lender', transactionFriend.id)}
              value={transactionFriend?.id}
            >
              {transactionFriend?.username}
            </option>
          )}
        </select>
        <label htmlFor="splitpercentage">Taking on: </label>
        <select
          {...register("splitpercentage")}
          id="splitpercentage"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          defaultValue={formState.defaultValues?.splitpercentage}
          required
        >
          <option value="50">50%</option>
          <option value="100">100%</option>
        </select>
        <br />
        <div className="flex justify-between">
          <Button loading={isLoading} disabled={!readyToSubmit} type="submit">
            Submit
          </Button>
          <Button disabled={isLoading} onClick={() => onClose()} type="button">
            Close
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseModal;
