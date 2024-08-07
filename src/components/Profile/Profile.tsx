import { useState } from "react";
import UploadWidget from "../../utils/UploadWidget";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useSelector } from "react-redux";
import { selectUser } from "../../slices/userSlice";

function Profile() {
	const user = useSelector(selectUser)
	const [publicId, setPublicId] = useState(user.photo);
	const [cloudName] = useState(import.meta.env.VITE_CLOUD_PROFILE);
	const [uploadPreset] = useState("ml_default");
	const [uwConfig] = useState({
		cloudName,
		uploadPreset
	});
	const cld = new Cloudinary({
		cloud: {
			cloudName: import.meta.env.VITE_CLOUD_PROFILE,
		}
	});

	const myImage = cld.image(publicId);
	myImage.resize(fill().width(300))
	return (
		<div>
			<p>Hi {user.username}</p>
			<AdvancedImage cldImg={myImage} />
			<UploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
		</div>
	);
}

export default Profile;