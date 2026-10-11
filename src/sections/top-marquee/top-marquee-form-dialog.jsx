import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { toast } from 'src/components/snackbar';
import ApiService from 'src/services/ApiService';

const dialogSx = {
  '& .MuiDialog-paper': {
    color: '#f8fafc',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
  },
  '& .MuiOutlinedInput-root': {
    color: '#f8fafc',
    backgroundColor: '#141f36',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.24)' },
    '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
  },
  '& .MuiInputLabel-root': { color: '#94a3b8' },
  '& .MuiButton-contained': {
    color: '#090d16',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
};

export function TopMarqueeFormDialog({ open, onClose, row, onSuccess }) {
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(row?.title ?? '');
    setIsActive(row?.isActive ?? true);
  }, [open, row]);

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setSaving(true);
    try {
      const payload = { title: trimmedTitle, isActive };
      const result = row
        ? await ApiService.updateTopMarqueeAsync(row.id, payload)
        : await ApiService.saveTopMarqueeAsync(payload);

      if (result?.data) {
        toast.success(row ? 'Announcement updated.' : 'Announcement created.');
        await onSuccess();
        onClose();
      } else {
        toast.error(result?.errors?.[0]?.msg || 'Could not save the announcement.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save the announcement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={dialogSx}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{row ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              required
              multiline
              minRows={3}
              label="Announcement text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box component="span" sx={{ typography: 'body2' }}>
                Active announcement
              </Box>
              <Switch
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                inputProps={{ 'aria-label': 'Active announcement' }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit" disabled={saving}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={saving}>
            {row ? 'Update' : 'Save'}
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
