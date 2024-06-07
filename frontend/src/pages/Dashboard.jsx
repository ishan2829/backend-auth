import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [message, setErrorMessage] = useState(false);

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getName = async () => {
      try {
        const response = await axios.get("/user/dashboard", {
          headers: {
            "csrf-token": Cookies.get("CSRF-TOKEN"),
          },
        });
        setIsLoading(false);
        setName(response.data.name);
      } catch (error) {
        let errorMessage = error.message;
        if (error instanceof axios.AxiosError)
          errorMessage = error.response.data.message;

        setErrorMessage(`${errorMessage}. Redirecting to SignIn Page`);
        setOpen(true);
        setTimeout(() => {
          navigate("/signIn");
        }, 3000);
      }
    };

    getName();
  }, [navigate]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "/user/logout",
        {},
        {
          headers: {
            "csrf-token": Cookies.get("CSRF-TOKEN"),
          },
        }
      );
      navigate("/signIn");
    } catch (error) {
      let errorMessage = error.message;
      if (error instanceof axios.AxiosError)
        errorMessage = error.response.data.message;

      setErrorMessage(errorMessage);
      setOpen(true);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            {!isLoading && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography component="h1" variant="h5">
                Weclome {name}
              </Typography>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
