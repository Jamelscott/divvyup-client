import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./store";
import { selectUser, updatePhoto } from "../slices/userSlice";

declare global {
  interface Window {
    cloudinary: {
      openUploadWidget: (
        options: CloudinaryWidgetOptions,
        callback: (error: any, result: CloudinaryWidgetResult) => void
      ) => void;
      createUploadWidget: (
        options: CloudinaryWidgetOptions,
        callback: (error: any, result: CloudinaryWidgetResult) => void
      ) => CloudinaryWidgetInstance;
    };
  }
}

interface CloudinaryWidgetOptions {
  cloudName: string;
  uploadPreset: string;
  [key: string]: any; // Allow other options
}

interface CloudinaryWidgetResult {
  event: "success" | "close" | "abort" | "error";
  info?: any; // Contains details about the uploaded asset on success
}

interface CloudinaryWidgetInstance {
  open: () => void;
  close: () => void;
}

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext({});

function UploadWidget({ uwConfig, setPublicId }: any) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            dispatch(
              updatePhoto({ publicId: result.info.public_id, user: user })
            );
            console.log("Done! Here is the image info: ", result.info);
            setPublicId(result.info.public_id);
          }
        }
      );

      document.getElementById("upload_widget")?.addEventListener(
        "click",
        function () {
          myWidget.open();
        },
        false
      );
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
