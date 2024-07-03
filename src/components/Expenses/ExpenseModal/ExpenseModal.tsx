import { useForm } from 'react-hook-form';
import './expenseModal.css'
import { editExpense, handleAddExpense } from '../../../utils/expenseHelpers';
import { ExpenseData, User, addExpense } from '../../../types';
import { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../../../context/userContext';
import { itemTypes } from '../../../utils/expenseHelpers';
import EditExpense from './EditExpense/EditExpense';
function ExpenseModal({
	setOpenModal,
}: {
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
	expenseData?: ExpenseData,
}) {
	const { user, friends, setUpdateContext } = useContext(UserContext) as UserContextType;
	const { register, handleSubmit, formState, getValues, setValue } = useForm({
		defaultValues: {
			lender: user.id,
			splitpercentage: '50',
			quantity: null,
			name: '',
			type: '',
		}
	});
	const [transactionFriend, setTransactionFriend] = useState<User | null>(null)
	const isDirty = !!Object.keys(formState.dirtyFields).length || formState.dirtyFields;
	const [ower, setOwer] = useState<User | null>(null)
	const readyToSubmit = isDirty && transactionFriend && getValues().lender && getValues().quantity && getValues().splitpercentage && getValues().name && getValues().type

	const submitting = (data: any) => {
		handleAddExpense(data as addExpense, user, transactionFriend)
		setUpdateContext(true)
		setOpenModal(false)
	}
	console.log(getValues())
	return (
		<div className='container'>
			<form onSubmit={handleSubmit((data) => submitting(data))}>
				<label htmlFor="friend">Friend: </label>
				<select defaultValue={'selectFriend'} onChange={(e) => {
					const foundFriend = friends?.find((friend) => friend.id === e.target.value)
					if (!foundFriend) throw new Error('bug finding friend in list')
					setTransactionFriend(foundFriend)
					return
				}
				} required name="friendsList" id="friendsList">
					<option value='selectFriend' disabled> Select a friend</option>
					{friends?.map((friend, idx) => {
						return <option key={idx} value={friend.id} >{friend.username}</option>
					})}
				</select>
				<br />
				<label htmlFor="name">Purchase Name: </label>
				<input required {...register('name', { required: "Please enter the expense name." })} />
				<br />
				<label htmlFor="type">type: </label>
				<select onChange={(e) => setValue('type', e.target.value)} defaultValue={'selectType'} required>
					<option value='selectType' disabled>Select a type</option>
					{itemTypes.map((item, idx) => {
						return <option key={idx} value={item} >{item}</option>
					})}
				</select>
				<br />
				<label htmlFor="quantity">Price ($): </label>
				<input {...register('quantity')} required type="number" min="0.01" step="0.01" />
				<br />
				<label htmlFor="purchasedBy">Purchased by: </label>
				<select onChange={(e) => setValue('lender', e.target.value)} id="lenderOrOwer" required>
					<option onClick={() => setOwer(user)} value={user.id}>Myself</option>
					{transactionFriend && <option onClick={() => setValue('lender', transactionFriend.id)} value={transactionFriend?.id}>{transactionFriend?.username}</option>}
				</select>
				<label htmlFor="splitpercentage">Taking on: </label>
				<select defaultValue={formState.defaultValues?.splitpercentage} required onChange={(e) => setValue('lender', e.target.value)} id="splitpercentage">
					<option value="50">50%</option>
					<option value="100">100%</option>
				</select>
				<br />
				<input disabled={!readyToSubmit} type="submit" />
			</form >
			<input type="button" value='close' onClick={() => setOpenModal(false)} />
		</div>
	);
}

export default ExpenseModal;