import { MouseEventHandler, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import './accordion.css'
import { useSelector } from "react-redux";
import { selectFriends } from "@/slices/friendsSlice";
import { selectUser } from "@/slices/userSlice";
import { FriendOwingDiff, friendOwingDiff } from "@/utils/friendHelpers";
import { ExpenseData, User } from "@/types";
import Expense from "@/components/Expenses/Expense";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";

type AccordionItemProps = {
	friend: User,
	diff: FriendOwingDiff,
	sharedExpenses: ExpenseData[],
	isOpen: boolean,
	onClick: MouseEventHandler<HTMLButtonElement>
}

const AccordionItem = ({ friend, diff, sharedExpenses, isOpen, onClick }: AccordionItemProps) => {
	const contentHeight = useRef<HTMLDivElement>(null);
	// const { yourPayments, yourSpent, friendPayments, friendSpent, totalSpent } = diff;

	return (
		<div className="wrapper">
			<button
				className={`question-container ${isOpen ? "active" : ""}`}
				onClick={onClick}
			>
				<p className="question-content">{friend.username}</p>
				<RiArrowDropDownLine className={`arrow ${isOpen ? "active" : ""}`} />
			</button>
			<div
				ref={contentHeight}
				className="answer-container"
				style={
					isOpen
						? { height: contentHeight?.current?.scrollHeight }
						: { height: "0px" }
				}
			>
				{sharedExpenses.map((expense) => <Expense expense={expense} sourceType='userSpecfic' />)}
			</div>
		</div>
	);
};

const Accordion = () => {
	const friends = useSelector(selectFriends)
	const user = useSelector(selectUser)
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const handleItemClick = (index: number) => {
		setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
	};

	return (
		<div className="accordion-container" style={{ display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
			<NeonGradientCard className="max-w-sm items-center justify-center text-center">
				{[...friends, ...friends].map((friend, index) => {
					const friendDiff = friendOwingDiff(user, user.expenses, friend)
					const sharedExpenses = user.expenses.filter((expense) => expense.lender === user.id || expense.ower === user.id)

					return <AccordionItem
						key={index}
						friend={friend}
						diff={friendDiff}
						sharedExpenses={sharedExpenses}
						isOpen={activeIndex === index}
						onClick={() => handleItemClick(index)}
					/>
				}
				)}
			</NeonGradientCard>
		</div>
	);
};

export default Accordion;
