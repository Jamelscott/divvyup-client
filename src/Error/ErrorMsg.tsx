import { useContext, useEffect } from 'react';
import './errorMsg.css'
import { UserContext, UserContextType } from '../context/userContext';
function ErrorMsg({ message }: { message?: string }) {
        const { errorMsgs, setErrorMsgs } = useContext(UserContext) as UserContextType
        useEffect(() => {
                if (message && !errorMsgs.includes(message)) {
                        setErrorMsgs([...errorMsgs, message])
                }
        }, [])
        return (
                <div className='errorContainer'>
                        {errorMsgs.map((msg) => {
                                return <div className={`alert`}>
                                        <span className="closebtn" onClick={() => setErrorMsgs(errorMsgs.filter((m) => m !== msg))}>&times;</span>
                                        <strong>{msg}</strong>
                                </div>
                        })}
                </div>
        );
}

export default ErrorMsg;