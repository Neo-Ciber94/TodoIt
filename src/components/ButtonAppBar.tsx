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
import GitHubIcon from "@mui/icons-material/GitHub";
import Image from "next/image";
import Link from "next/link";

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

  const Login = () => (
    <Link passHref href="/api/auth/login">
      <Button color="inherit" className="ml-auto">
        Login
      </Button>
    </Link>
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
        {isLogin && <Me user={user!} />}
      </>
    );
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-row items-center">
              <IconButton
                href="https://github.com/Neo-Ciber94/NextJS-TodoApp"
                target="_black"
                rel="noopener noreferrer"
              >
                <GitHubIcon sx={{ color: "white" }} />
              </IconButton>
              <Link href={"/"} passHref>
                <div className="w-16 h-auto leading-[0px] mx-2 cursor-pointer">
                  <Image
                    src="/logo.png"
                    alt="TodoIt"
                    width={366}
                    height={101}
                  />
                </div>
              </Link>
            </div>

            <UserActions />
          </div>
        </Toolbar>
      </AppBar>
      <Offset />
    </Box>
  );
}

export interface MeProps {
  user: UserProfile;
}

function Me({ user }: MeProps) {
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
          <Avatar
            alt={name || "User"}
            src={picture || ""}
            imgProps={{
              referrerPolicy: "no-referrer",
            }}
          />
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

        <Link passHref href="/api/auth/logout">
          <MenuItem onClick={handleCloseUserMenu}>
            <LogoutRoundedIcon sx={{ color: "white", marginRight: 1 }} />
            <Typography textAlign="center" sx={{ color: "white" }}>
              Logout
            </Typography>
          </MenuItem>
        </Link>
      </Menu>
    </Box>
  );
}
