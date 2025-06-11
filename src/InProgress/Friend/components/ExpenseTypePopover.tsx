import { Popover } from "@mantine/core";
import { useState } from "react";

const ExpenseTypePopover = ({
  expenseIcon,
  expenseName,
}: {
  expenseIcon: string;
  expenseName: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover position="top-start" withArrow shadow="md" opened={open}>
      <Popover.Target>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <img src={`${expenseIcon}`} alt="" />
        </div>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }}>
        <p>{expenseName}</p>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ExpenseTypePopover;
