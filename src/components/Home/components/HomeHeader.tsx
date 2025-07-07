import ExpenseModal from "@/components/Friends/components/ExpenseModal";
import Hr from "@/components/utils/Hr";
import { selectUser } from "@/slices/userSlice";
import { AdvancedImage } from "@cloudinary/react";
import { outline } from "@cloudinary/url-gen/actions/effect";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { Button } from "@mantine/core";
import { useState } from "react";
import { useSelector } from "react-redux";

const HomeHeader = () => {
  const { username, photo } = useSelector(selectUser);
  const [openModal, setOpenModal] = useState(false);
  const cld = new Cloudinary({
    cloud: { cloudName: import.meta.env.VITE_CLOUD_PROFILE },
  })
    .image(photo)
    .resize(fill().width(200).height(200))
    .roundCorners(byRadius(1000))
    .effect(outline().color("grey"));

  return (
    <>
      <div>
        <div className="flex items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-black border bg-slate-500">
              <AdvancedImage cldImg={cld} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-[montserrat] text-[#11B5E4]">
                Home
              </h1>
              <p className="text-lg">
                Welcome back{" "}
                {username.charAt(0).toUpperCase() + username.slice(1)}
              </p>
            </div>
          </div>
          <div>
            <Button
              style={{ border: "1px solid grey" }}
              size="sm"
              color="cyan"
              onClick={() => setOpenModal(true)}
            >
              add expense
            </Button>{" "}
          </div>
        </div>
        <Hr style={{ margin: "0px" }} />
      </div>
      {openModal && <ExpenseModal onClose={() => setOpenModal(false)} />}
    </>
  );
};
export default HomeHeader;
