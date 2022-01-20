import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export function ButtonAppBar() {
  const { user, error, isLoading } = useUser();
  const isLogin = user && !isLoading;

  // https://github.com/auth0/nextjs-auth0/issues/520#issuecomment-945756557
  const goToLogin = () => window.location.assign("/api/auth/login");
  const goToLogout = () => window.location.assign("/api/auth/logout");

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
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
    </>
  );
}
