import { Button } from "@mantine/core";
import { ReactNode } from "react";

const SvgButton = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) => {
  return (
    <Button onClick={onClick} variant="transparent" type="submit" size="2xs">
      {children}
    </Button>
  );
};

export default SvgButton;
