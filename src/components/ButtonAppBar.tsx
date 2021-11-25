import { Box, Button, AppBar, Toolbar, styled } from "@mui/material";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="bg-black">
        <Toolbar>
          <Button color="inherit" className="ml-auto">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Offset />
    </Box>
  );
}
