import holdingApp from "../../public/holdingApp.png";
import { Button, Popover } from "@mantine/core";
import googlePlayIcon from "../../public/googlePlayButton.png";
import appStoreIcon from "../../public/appStoreButton.png";
import progressiveIcon from "../../public/pwa.png";
import { useState } from "react";
import LoginForm from "./LoginForm/LoginForm.tsx";
import SignUpForm from "./SignUpForm/SignUpFormx.tsx";
import { useSelector } from "react-redux";
import { selectUser } from "@/slices/userSlice.ts";
import { useNavigate } from "react-router-dom";

const Landing = ({
  setIsLoggingIn,
}: {
  setIsLoggingIn: (val: boolean) => void;
}) => {
  const navigate = useNavigate();
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const user = useSelector(selectUser);

  if (user.id) {
    navigate("/home");
  }

  const closeBothForms = () => {
    openSignUp && setOpenSignUp(false);
    openLogin && setOpenLogin(false);
  };
  return (
    <>
      <div
        onClick={() => closeBothForms()}
        className="p-10 pb-0 px-40 max-xl:px-8 flex flex-col min-w-sm text-white max-h-[100vh]"
      >
        <div className="flex justify-between">
          <div className="text-5xl">
            <h1 className="text-white font-light font-[Trispace]">BILLY</h1>
          </div>
          <div className="items-center justify-end gap-5 font-[montserrat]">
            <div className="flex max-[600px]:hidden gap-5">
              <Popover
                width={250}
                trapFocus
                arrowSize={15}
                position="bottom-start"
                withArrow
                arrowPosition="center"
                offset={{ mainAxis: 15, crossAxis: -55 }}
              >
                <Popover.Target>
                  <Button radius="xs" size="sm" variant="outline" color="white">
                    <span className="text-[14px]">Login</span>
                  </Button>
                </Popover.Target>
                <Popover.Dropdown
                  className="flex max-[450px]:hidden"
                  bg="rgb(15, 36, 36)"
                >
                  <LoginForm
                    setOpenLogin={setOpenLogin}
                    setIsLoggingIn={setIsLoggingIn}
                    open={true}
                    mobile={false}
                  />
                </Popover.Dropdown>
              </Popover>
              <Popover
                width={250}
                trapFocus
                arrowSize={15}
                position="bottom-end"
                withArrow
                arrowPosition="center"
              >
                <Popover.Target>
                  <Button radius="xs" size="sm" color="#11B5E4">
                    <span className="text-[14px]">Sign Up</span>
                  </Button>
                </Popover.Target>
                <Popover.Dropdown
                  className="flex max-[450px]:hidden"
                  bg="rgb(15, 36, 36)"
                >
                  <SignUpForm mobile={false} open={true} />
                </Popover.Dropdown>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex gap-20 max-xlg:items-start mt-[75px] min-h-[450px]">
          <div className="flex flex-col gap-5 pt-20 ">
            <div className="text-7xl max-xl:text-6xl">
              <p className="font-[Exo] pb-[10px]">Split bills,</p>
              <p className="font=[Exo]">Stay friends.</p>
            </div>
            <div className="text-lg font-[montserrat]">
              <p>
                From rent to dinner, Billy makes splitting costs
                <br /> simple and hassle-free.
              </p>
            </div>
            <div className="hidden max-[600px]:flex gap-5">
              <Button
                onClick={() => setOpenLogin((prev) => !prev)}
                radius="xs"
                size="md"
                variant="outline"
                color="white"
              >
                <span className="text-[14px]">Login</span>
              </Button>
              <Button
                onClick={() => setOpenSignUp((prev) => !prev)}
                radius="xs"
                size="md"
                color="#11B5E4"
              >
                <span className="text-[14px]">Sign Up</span>
              </Button>
            </div>
            <div className="mt-10">
              <p className="font-semibold">download the app:</p>
            </div>
            <div className="flex gap-5 flex-wrap">
              <img
                className="cursor-pointer transition-transform duration-50 active:translate-y-1"
                src={googlePlayIcon}
              />
              <img
                className="cursor-pointer transition-transform duration-50 active:translate-y-1"
                src={appStoreIcon}
              />
              <img
                className="cursor-pointer transition-transform duration-50 active:translate-y-1"
                src={progressiveIcon}
              />
            </div>
          </div>
          <div className="hidden lg:flex flex-1 justify-center max-w-[500px] min-w-[500px] max-h-[585px] min-h-[585px]">
            <img src={holdingApp} />
          </div>
        </div>
      </div>
      <div className="hidden max-[450px]:flex">
        <SignUpForm mobile open={openSignUp} />
      </div>
      <div className="hidden max-[450px]:flex">
        <LoginForm
          mobile
          setOpenLogin={setOpenLogin}
          setIsLoggingIn={setIsLoggingIn}
          open={openLogin}
        />
      </div>
    </>
  );
};

export default Landing;
