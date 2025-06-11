import { Button } from "@mantine/core";

function ConfirmationModal({
  onClickYes,
  onClickNo,
  message,
  fullscreen,
}: {
  onClickYes: () => void;
  onClickNo: () => void;
  message?: string;
  fullscreen?: boolean;
}) {
  return (
    <div
      style={
        fullscreen
          ? { transform: "translate(-50%, -50%)", top: "50%", left: "50%" }
          : {}
      }
      className={`${
        fullscreen
          ? "absolute flex items-center justify-center w-full h-full bg-opacity-50 bg-gray-600"
          : ""
      }`}
    >
      <div className="flex flex-col text-center justify-center items-center p-5 shadow-md rounded-lg bg-white">
        <h1>{message}</h1>
        <div className="flex gap-2 mt-5">
          <Button style={{ width: "4rem" }} onClick={() => onClickNo()}>
            no
          </Button>
          <Button style={{ width: "4rem" }} onClick={() => onClickYes()}>
            yes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
