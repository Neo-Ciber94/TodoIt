import { Box } from "@mui/material";
import { PageColorProvider } from "src/contexts/PageColorContext";
import { HeaderAppBar } from "./HeaderAppBar";

export const Layout: React.FC = ({ children }) => {
  return (
    <PageColorProvider>
      <Box>
        <HeaderAppBar />
        {children}
      </Box>
    </PageColorProvider>
  );
};
