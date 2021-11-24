import { Box } from "@mui/material";
import { ButtonAppBar } from "./ButtonAppBar";

export const Layout: React.FC = ({ children }) => {
  return (
    <Box>
      <ButtonAppBar />
      {children}
    </Box>
  );
};
