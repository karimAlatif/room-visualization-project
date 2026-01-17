import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";

interface LoadingScreenProps {
  open: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ open }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.default,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: "2.5rem",
            marginBottom: "2rem",
            color: theme.palette.secondary.main,
            fontWeight: "bold",
          }}
        >
          Loading Farm Scene
        </Typography>

        <Box sx={{ marginBottom: "2rem" }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: theme.palette.secondary.main,
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingScreen;
