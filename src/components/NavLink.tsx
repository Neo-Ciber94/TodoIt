import Link from "next/link";
import { Button, ButtonProps } from "@mui/material";

export type NavLinkProps = ButtonProps & {
  href: string;
};

export const NavLink: React.FC<NavLinkProps> = ({
  children,
  href,
  ...rest
}) => {
  return (
    <Link href={href} passHref>
      <Button variant="contained" {...rest}>{children}</Button>
    </Link>
  );
};
