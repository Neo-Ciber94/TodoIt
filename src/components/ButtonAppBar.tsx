import {
  Box,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";

export function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="bg-fuchsia-500">
        <Toolbar>
          <Button color="inherit" className="ml-auto">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
