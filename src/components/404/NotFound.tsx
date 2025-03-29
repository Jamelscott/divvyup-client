import { Button } from '@mantine/core';
import { IconError404 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
        const navigate = useNavigate();
        return (
                <div className='flex flex-col gap-1 justify-center items-center w-full'>
                       <IconError404 stroke={1} size={200} />
                       <h1 className="text-white font-light font-[Trispace]">
			        Well this is awkward..
			</h1>
                </div>
        )
}

export default NotFound