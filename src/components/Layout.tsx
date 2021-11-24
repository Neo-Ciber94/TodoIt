import { Box } from "@mui/material";
import { ButtonAppBar } from "./ButtonAppBar";

export const Layout: React.FC = ({ children }) => {
  return (
    <Box
      className="bg-orange-100"
      sx={{
        height: "100vh",
        paddingTop: 10,
      }}
    >
      <ButtonAppBar />
      {children}
    </Box>
  );
};
