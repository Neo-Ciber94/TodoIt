import { Box } from "@mui/material";
import { PageColorProvider } from "src/contexts/PageColorContext";
import { ButtonAppBar } from "./ButtonAppBar";

export const Layout: React.FC = ({ children }) => {
  return (
    <PageColorProvider>
      <Box>
        <ButtonAppBar />
        {children}
      </Box>
    </PageColorProvider>
  );
};
