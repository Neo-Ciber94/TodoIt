import {
  Box,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";

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
    </Box>
  );
}
