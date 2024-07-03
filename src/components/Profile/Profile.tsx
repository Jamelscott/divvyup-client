import { useContext, useState } from "react";
import UploadWidget from "../../utils/UploadWidget";
import { UserContext, UserContextType } from "../../context/userContext";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { fill } from "@cloudinary/url-gen/actions/resize";

function Profile() {
	const { user } = useContext(UserContext) as UserContextType;
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