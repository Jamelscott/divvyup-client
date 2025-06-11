import { ReactNode } from "react";

const SmallPopover = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <div className="absolute bottom-0 height-[300px] w-full bg-[white]">
      <h1 className="flex justify-between px-5 align-center">
        {" "}
        <span>
          {" "}
          <img src={`../../public/large_expense_types/fi_skip-forward.svg`} />
        </span>
        {title} {"Modal"}
        <span>
          <img src={`../../public/large_expense_types/fi_skip-forward.svg`} />
        </span>
      </h1>
      {children}
    </div>
  );
};

export default SmallPopover;
