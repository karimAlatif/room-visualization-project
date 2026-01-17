import React, { useEffect } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";
import useStyles from "./styles";

const NotFound = () => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Typography variant="h2" className={classes.title}>
          404
        </Typography>

        <Typography variant="h6" className={classes.subtitle}>
          Oops! Page not found
        </Typography>

        <Link component={RouterLink} to="/" className={classes.link}>
          Return to Home
        </Link>
      </Box>
    </Box>
  );
};

export default NotFound;
