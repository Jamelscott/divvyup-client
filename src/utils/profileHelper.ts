
import { supabase } from "../supabase";
import { User } from "../types";

export const uploadProfilePhoto = async (user: User, profileId: string) => {
	const { data, error } = await supabase
		.from('profiles')
		.update({ photo: profileId })
		.eq('id', user.id)
		.select()
	if (error) throw new Error('error uploading')
	if (data) return console.log('data successful: ', data)
}