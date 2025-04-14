import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import { postFriendRequest } from "../../../slices/friendsSlice";
import { AppDispatch } from "../../../utils/store";
import { Button, TextInput } from "@mantine/core";
import { useRef, useState } from "react";
import { Icon, IconPlus } from "@tabler/icons-react";
import SvgButton from "@/components/utils/SvgButton";

function FriendRequestForm({ modalFunc, modalOpen }: any) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm({
    mode: "onSubmit",
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submitFriendRequest = async () => {
    setLoading(true);
    if (inputRef.current?.value) {
      await dispatch(
        postFriendRequest({
          user: user,
          usernameOrEMail: inputRef.current.value,
        })
      );
      inputRef.current.value = "";
    }
    setLoading(false);
    modalFunc(!modalOpen);
  };

  const plusIcon = useRef<Icon | null>(null);

  const handleOver = () => {
    if (plusIcon.current) {
      (plusIcon.current as any as HTMLElement).style.opacity = "1";
    }
  };

  const handleExit = () => {
    if (plusIcon.current) {
      (plusIcon.current as any as HTMLElement).style.opacity = "0.5";
    }
  };

  return (
    <form onSubmit={handleSubmit(() => submitFriendRequest())}>
      <div className="flex justify-center gap-10 ">
        <TextInput
          withAsterisk
          placeholder="email or username"
          {...register("name")}
          ref={inputRef}
          rightSection={
            <SvgButton>
              <IconPlus
                ref={plusIcon}
                color="grey"
                opacity={0.5}
                onMouseOver={handleOver}
                onMouseLeave={handleExit}
              />
            </SvgButton>
          }
        />
      </div>
    </form>
  );
}

export default FriendRequestForm;
