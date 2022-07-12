import { Alert, Snackbar } from '@mui/material';
import { useState, useEffect } from 'react';

export default function useSnackbar() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState<{
    text: string;
    severity: 'success' | 'info' | 'error';
  } | null>(null);
  const [newSnackbarText, setNewSnackbarText] = useState<{
    text: string;
    severity: 'success' | 'info' | 'error';
  } | null>(null);

  useEffect(
    () => {
      if (newSnackbarText && !snackbarOpen) {
        // Set a new snack when we don't have an active one
        setSnackbarText({ ...newSnackbarText });
        setSnackbarOpen(true);
        setNewSnackbarText(null);
      } else if (snackbarOpen && newSnackbarText) {
        // Close an active snack when a new one is added
        setSnackbarOpen(false);
      }
    },
    [snackbarOpen, snackbarText, newSnackbarText],
  );

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
    setSnackbarText(null);
  };

  const snackbar = (
    <Snackbar
      key={snackbarText ? snackbarText.text : ''}
      open={snackbarOpen}
      onClose={handleSnackbarClose}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert severity={snackbarText ? snackbarText.severity : 'info'}>
        {snackbarText ? snackbarText.text : ''}
      </Alert>
    </Snackbar>
  );

  return {
    snackbar,
    setNewSnackbarText,
  };
}
