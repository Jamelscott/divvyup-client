import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import { postFriendRequest } from "../../../slices/friendsSlice";
import { AppDispatch } from "../../../utils/store";
import { TextInput } from "@mantine/core";
import { useRef } from "react";
import { Icon, IconPlus } from "@tabler/icons-react";
import SvgButton from "@/components/utils/SvgButton";

function FriendRequestForm({ modalFunc, modalOpen }: any) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, getValues, reset } = useForm({
    mode: "onSubmit",
  });

  const submitFriendRequest = async () => {
    const nameValue = getValues("name");

    if (nameValue) {
      await dispatch(
        postFriendRequest({
          user: user,
          usernameOrEMail: nameValue,
        })
      );
      reset();
    }
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
    <form
      className="w-full"
      onSubmit={handleSubmit(() => submitFriendRequest())}
    >
      <div className="flex justify-center gap-10 w-full ">
        <TextInput
          withAsterisk
          placeholder="email or username"
          {...register("name")}
          className="w-full"
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
