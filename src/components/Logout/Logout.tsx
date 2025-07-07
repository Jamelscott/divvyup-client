import { expireFriends } from "@/slices/friendsSlice";
import { logoutUser } from "@/slices/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/utils/store";

function Logout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    const handleLogout = async () => {
      await dispatch(logoutUser());
      dispatch(expireFriends());
      navigate("/");
      console.log("user logged out");
      return;
    };
    handleLogout();
  }, []);
  return <></>;
}

export default Logout;
