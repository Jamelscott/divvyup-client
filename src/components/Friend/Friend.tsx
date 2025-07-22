import { useMemo, useState } from "react";
import FriendCard from "../Friends/components/FriendCard";
import { useNavigate, useParams } from "react-router-dom";
import { ExpenseListType, FriendSourceType, User } from "@/types.d";
import ExpenseList from "./components/ExpenseList";
import { Select } from "@mantine/core";
import ExpenseModal from "../Friends/components/ExpenseModal";
import useFriend from "@/utils/hooks/useFriend";

type ExpenseOrderValue = "name" | "type" | "price" | "date";

const Friend = () => {
  const navigate = useNavigate();
  const [sortByAsc, setSortByAsc] = useState(true);
  const [sortByValue, setSortByValue] = useState<ExpenseOrderValue>("date");
  const [open, setOpen] = useState(false);
  const [modalFriend, setModalFriend] = useState<User>();
  let params = useParams();

  const { friend, sharedExpenses } = useFriend({
    friendId: params.id as string,
  });

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortedFriends = useMemo(
    () =>
      sharedExpenses.sort((a, b) => {
        if (sortByValue === "date") {
          return sortByAsc
            ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime();
        } else if (sortByValue === "price") {
          return sortByAsc ? a.quantity - b.quantity : b.quantity - a.quantity;
        } else if (sortByValue === "type") {
          return sortByAsc
            ? a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        } else if (sortByValue === "name") {
          return sortByAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          return 0;
        }
      }),
    [sortByAsc, sortByValue, sharedExpenses]
  );
  const handleOpenExpenseModal = (friend: User) => {
    setModalFriend(friend);
    setOpen(true);
    return;
  };
  const handleCloseExpenseModal = () => {
    setModalFriend(undefined);
    setOpen(false);
    return;
  };

  if (!friend) {
    return <>Patient Not Found</>;
  }
  return (
    <div className="flex flex-col items-center p-[40px] gap-2 relative">
      <div className="fixed h-[full] top-[20px] left-[100px]">
        <img
          style={{
            opacity: 0.25,
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "0.5rem",
            cursor: "pointer",
          }}
          src={`../../public/arrow-back.svg`}
          onClick={() => navigate(-1)}
        />
      </div>
      <div className="fixed h-[full] bottom-[20px] right-[20px]">
        <img
          style={{
            opacity: 0.25,
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "0.5rem",
            cursor: "pointer",
          }}
          src={`../../public/arrow-narrow-up.svg`}
          onClick={() => toTop()}
        />
      </div>
      <FriendCard
        handleOpenExpenseModal={handleOpenExpenseModal}
        sourceType={FriendSourceType.FRIEND_PAGE}
        friend={friend}
      />
      <div className="w-full max-w-[700px] flex items-center justify-between m-4">
        <Select
          style={{ width: "20%" }}
          label={
            <p
              style={{
                opacity: 0.8,
              }}
            >
              Sorting By
            </p>
          }
          placeholder="List order"
          allowDeselect={false}
          defaultValue={"date"}
          data={["date", "price", "type", "name"]}
          onChange={(_value, option) =>
            setSortByValue(option.value as ExpenseOrderValue)
          }
        />
        {sortByAsc ? (
          <button
            style={{
              opacity: 0.8,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onClick={() => setSortByAsc(() => !sortByAsc)}
          >
            descending <img src="../../../public/down.svg" />
          </button>
        ) : (
          <button
            style={{
              opacity: 0.8,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onClick={() => setSortByAsc(() => !sortByAsc)}
          >
            ascending <img src="../../../public/up.svg" />
          </button>
        )}
      </div>
      <ExpenseList
        sourceType={ExpenseListType.USER_SPECIFIC}
        friendExpenses={sortedFriends}
      />
      {open && (
        <ExpenseModal
          onClose={handleCloseExpenseModal}
          selectedFriend={modalFriend}
        />
      )}
    </div>
  );
};
export default Friend;
