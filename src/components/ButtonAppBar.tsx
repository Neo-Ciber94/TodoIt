import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export function ButtonAppBar() {
  const { user, error, isLoading } = useUser();
  const isLogin = user && !isLoading;
  const [menuOpen, setMenuOpen] = useState(false);

  const onMenuClose = () => {
    setMenuOpen(false);
  };

  // https://github.com/auth0/nextjs-auth0/issues/520#issuecomment-945756557
  const goToLogin = () => window.location.assign("/api/auth/login");
  const goToLogout = () => window.location.assign("/api/auth/logout");

  if (error) {
    console.error(error);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" className="bg-black">
          <Toolbar>
            <Box>
              <IconButton onClick={() => setMenuOpen(true)}>
                <MenuIcon className="text-white" />
              </IconButton>
            </Box>
            <Box className="flex flex-row ml-auto">
              {user && (
                <div className="flex flex-col justify-center">
                  <Typography className="uppercase text-red-400 select-none">
                    {`${user.name} - `}
                  </Typography>
                </div>
              )}
              {!isLogin && (
                <Button color="inherit" className="ml-auto" onClick={goToLogin}>
                  Login
                </Button>
              )}
              {isLogin && (
                <Button
                  color="inherit"
                  className="ml-auto"
                  onClick={goToLogout}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Offset />
      </Box>
      <Drawer
        anchor={"left"}
        open={menuOpen}
        onClose={onMenuClose}
        PaperProps={{
          className: "bg-gray-800 w-64",
        }}
      >
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon className="text-white">
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText className="text-white" primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
