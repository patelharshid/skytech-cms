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
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'src/components/snackbar';
import ApiService from 'src/services/ApiService';

export function ProductStockDialog({ open, onClose, product, onSuccess }) {
  const [quantity, setQuantity] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !product) return;
    setQuantity(product?.inventory?.quantity ?? 0);
    setLowStockThreshold(product?.inventory?.lowStockThreshold ?? 5);
  }, [open, product]);

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        newQuantity: Number(quantity) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 5,
      };

      const result = await ApiService.updateProductStockAsync(product.id, payload);
      if (result?.data) {
        toast.success(`Inventory updated for ${product.name}`);
        await onSuccess();
        onClose();
      } else {
        toast.error(result?.errors?.[0]?.msg || 'Could not update inventory.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update inventory.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
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
        '& .MuiButton-contained': {
          color: theme.vars.palette.primary.contrastText,
          fontWeight: 700,
          backgroundColor: theme.vars.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.vars.palette.primary.dark,
          },
        },
      })}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Update Inventory</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {product?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                SKU: {product?.sku}
              </Typography>
            </Box>

            <TextField
              autoFocus
              fullWidth
              type="number"
              label="Available Stock Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              helperText="Items currently on hand"
              inputProps={{ min: 0 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Low-Stock Alert Threshold"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              helperText="Alerts trigger when stock falls to or below this amount"
              inputProps={{ min: 1 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleClose} color="inherit" disabled={saving}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={saving}>
            Update Stock
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
