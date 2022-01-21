import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
  styled,
  Menu,
  Avatar,
  MenuItem,
  IconButton,
} from "@mui/material";
import { UserProfile, useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import React from "react";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CircularProgress from "@mui/material/CircularProgress";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export function ButtonAppBar() {
  const { user, error, isLoading } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isLogin = user && !isLoading;

  useEffect(() => {
    if (error) {
      const message = error.message || "Something went wrong";
      setErrorMessage(message);
    } else {
      setErrorMessage(null);
    }
  }, [error]);

  // https://github.com/auth0/nextjs-auth0/issues/520#issuecomment-945756557
  const goToLogin = () => window.location.assign("/api/auth/login");
  const goToLogout = () => window.location.assign("/api/auth/logout");

  const Login = () => (
    <Button color="inherit" className="ml-auto" onClick={goToLogin}>
      Login
    </Button>
  );

  const UserActions = React.memo(function UserActions() {
    if (isLoading) {
      return <CircularProgress sx={{ color: "gray" }} />;
    }

    if (error) {
      return <div className="text-red-600 text-xl">{errorMessage}</div>;
    }

    return (
      <>
        {!isLogin && <Login />}
        {isLogin && <Me user={user!} handleLogout={goToLogout} />}
      </>
    );
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Box className="flex flex-row ml-auto">
            <UserActions />
          </Box>
        </Toolbar>
      </AppBar>
      <Offset />
    </Box>
  );
}

export interface MeProps {
  user: UserProfile;
  handleLogout: () => void;
}

function Me({ user, handleLogout }: MeProps) {
  const { email, picture, name } = user;
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={name || "User"} src={picture || ""} />
        </IconButton>
      </Tooltip>
      <Menu
        PaperProps={{ sx: { backgroundColor: "black" } }}
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {email && (
          <MenuItem onClick={handleCloseUserMenu}>
            <EmailRoundedIcon sx={{ color: "white", marginRight: 1 }} />
            <Typography textAlign="center" sx={{ color: "white" }}>
              {email}
            </Typography>
          </MenuItem>
        )}

        {name && (
          <MenuItem onClick={handleCloseUserMenu}>
            <AccountCircleRoundedIcon sx={{ color: "white", marginRight: 1 }} />
            <Typography textAlign="center" sx={{ color: "white" }}>
              {name}
            </Typography>
          </MenuItem>
        )}

        <MenuItem onClick={handleCloseUserMenu}>
          <LogoutRoundedIcon sx={{ color: "white", marginRight: 1 }} />
          <Typography
            textAlign="center"
            sx={{ color: "white" }}
            onClick={handleLogout}
          >
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
