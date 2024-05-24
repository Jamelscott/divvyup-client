import { useForm } from 'react-hook-form';
import './styles/testModal.css'
import { handleAddExpense } from '../utils/expenseHelpers';
import { User, addExpense } from '../types';
import { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../context/userContext';
import { itemTypes } from '../utils/expenseHelpers';
function TestModal({ setOpenModal }: { setOpenModal: React.Dispatch<React.SetStateAction<boolean>> }) {
        const { register, handleSubmit, setValue } = useForm();
        const { user, friends, setUpdateContext } = useContext(UserContext) as UserContextType;
        const [splitWith, setSplitWith] = useState<User | null>(null);
        const handleSetFriend = (e: any) => {
                if (friends) {
                        const friendData = friends.find((friend) => friend.id === e.target.value)
                        setValue('friendId', e.target.value)
                        setSplitWith(friendData as User)
                }
        }

        const submitting = (data: any) => {
                handleAddExpense(data as addExpense, user)
                setUpdateContext(true)
                setOpenModal(false)
        }
        return (
                <div className='container'>
                        <form onSubmit={handleSubmit((data) => submitting(data))}>
                                <label htmlFor="friend">Friend: </label>
                                <select onChange={(e) => handleSetFriend(e)} name="fiendsList" id="friendsList">
                                        <option value="hi">Select a friend</option>
                                        {friends?.map((friend, idx) => <option key={idx} value={friend.id} >{friend.username}</option>)}
                                </select>
                                <br />
                                <label htmlFor="name">Purchase Name: </label>
                                <input required {...register('name')} />
                                <br />
                                <label htmlFor="type">type: </label>
                                <select required id="type" {...register('type')}>
                                        {itemTypes.map((item, idx) => {
                                                return <option key={idx} defaultValue={item} >{item}</option>
                                        })}
                                </select>
                                <br />
                                <label htmlFor="quantity">Price ($): </label>
                                <input {...register('quantity')} required type="number" min="0.01" step="0.01" />
                                <br />
                                <label htmlFor="purchasedBy">Purchased by: </label>
                                <select {...register('purchasedBy')} id="lenderOrOwer" required>
                                        <option selected value={user.id}>Myself</option>
                                        {splitWith !== null ? <option value={splitWith.id}>{splitWith.username}</option> : <></>}
                                </select>
                                <label htmlFor="splitpercentage"> Taking on: </label>
                                <select defaultValue={'50'} required {...register('splitpercentage')} id="splitpercentage">
                                        <option value="50">50%</option>
                                        <option value="100">100%</option>

                                </select>
                                <br />
                                <input disabled={!splitWith} type="submit" />
                        </form >
                </div>
        );
}

export default TestModal;