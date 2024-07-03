import { useForm } from 'react-hook-form';
import { editExpense, itemTypes, youOweThem } from '../../../../utils/expenseHelpers';
import { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../../../../context/userContext';
import { ExpenseData, User } from '../../../../types';

function EditExpense({
	expenseData,
	friendData,
	setOpenEditModal
}: {
	expenseData: ExpenseData,
	friendData: User,
	setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const { user, setUpdateContext } = useContext(UserContext) as UserContextType;
	const { register, handleSubmit, formState, setValue } = useForm({
		defaultValues: {
			lender: expenseData.lender,
			splitpercentage: expenseData.splitpercentage,
			quantity: expenseData.quantity,
			name: expenseData.name,
			type: expenseData.type,
			ower: expenseData.ower
		}
	});

	const isDirty = !!Object.keys(formState.dirtyFields).length;

	const handleLenderChange = (e: string) => {
		setValue('lender', e, { shouldDirty: true })
		setValue('ower', e === user.id ? friendData.id : user.id, { shouldDirty: true })
	}

	const submitting = (data: any) => {
		if (formState.dirtyFields.ower === data.lender) throw new Error('you cant lend money to yourself')
		editExpense({ ...data }, expenseData.id)
		setUpdateContext(true)
		setOpenEditModal(false)
	}
	console.log('userId: ', user.id)
	console.log(formState.defaultValues)
	return (
		<div className='container'>
			<form onSubmit={handleSubmit((data) => submitting(data))}>
				<label htmlFor="friend">Friend: </label>
				<select>
					<option value={friendData?.id} >{friendData?.username}</option>
				</select>
				<br />
				<label htmlFor="name">Purchase Name: </label>
				<input required {...register('name')} defaultValue={expenseData.name} />
				<br />
				<label htmlFor="type">type: </label>
				<select required id="type" {...register('type')} >
					{itemTypes.map((item, idx) => {
						return <option key={idx} value={item} >{item}</option>
					})}
				</select>
				<br />
				<label htmlFor="quantity">Price ($): </label>
				<input {...register('quantity')} required type="number" min="0.01" step="0.01" defaultValue={expenseData.quantity} />
				<br />
				<label htmlFor="purchasedBy">Purchased by: </label>
				<select defaultValue={expenseData.lender} onChange={(e) => handleLenderChange(e.target.value)} id="lenderOrOwer" required>
					{[user, friendData].map((data) => <option key={data.id} value={data.id}>{data.id === user.id ? 'Myself' : data.username}</option>)}
				</select>
				<label htmlFor="splitpercentage"> Taking on: </label>
				<select defaultValue={'50'} required {...register('splitpercentage')} id="splitpercentage">
					<option value="50">50%</option>
					<option value="100">100%</option>

				</select>
				<br />
				<input disabled={!friendData || !isDirty} type="submit" />
			</form >
			<input type="button" value='close' onClick={() => setOpenEditModal(false)} />
		</div>
	);
}

export default EditExpense;