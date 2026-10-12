import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'src/components/snackbar';
import ApiService from 'src/services/ApiService';

export function CategoryFormDialog({ open, onClose, row, onSuccess }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(row?.name ?? '');
    setImageUrl(row?.imageUrl ?? '');
  }, [open, row]);

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Category name is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: trimmedName,
        imageUrl: imageUrl.trim() || null,
      };

      const result = row
        ? await ApiService.updateCategoryAsync(row.id, payload)
        : await ApiService.saveCategoryAsync(payload);

      if (result?.data) {
        toast.success(row ? 'Category updated successfully.' : 'Category created successfully.');
        await onSuccess();
        onClose();
      } else {
        toast.error(result?.errors?.[0]?.msg || 'Could not save category.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={(theme) => ({
        '& .MuiDialog-paper': {
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.vars.palette.background.paper,
          border: `1px solid ${theme.vars.palette.divider}`,
          boxShadow: theme.shadows[24],
        },
        '& .MuiOutlinedInput-root': {
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.vars.palette.background.neutral,
          '& fieldset': { borderColor: theme.vars.palette.divider },
          '&:hover fieldset': { borderColor: theme.vars.palette.text.secondary },
          '&.Mui-focused fieldset': { borderColor: theme.vars.palette.primary.main },
        },
        '& .MuiInputLabel-root': { color: theme.vars.palette.text.secondary },
      })}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{row ? 'Edit Category' : 'New Category'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              required
              label="Category Name"
              placeholder="e.g. Laptops, Desktops, Accessories"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <TextField
              fullWidth
              label="Image URL"
              placeholder="https://example.com/category-image.jpg"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              helperText="Enter direct URL for category photo"
            />

            {imageUrl && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: 'background.neutral',
                  border: (theme) => `1px dashed ${theme.vars.palette.divider}`,
                }}
              >
                <Avatar
                  src={imageUrl}
                  alt={name || 'Category'}
                  variant="rounded"
                  sx={{ width: 64, height: 64, bgcolor: 'background.paper' }}
                />
                <Box>
                  <Typography variant="subtitle2">Image Preview</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Thumbnail will appear in category showcases
                  </Typography>
                </Box>
              </Box>
            )}
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
