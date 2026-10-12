import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { getComparator, TableHeadCustom, useTable } from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';
import ApiService from 'src/services/ApiService';
import { CategoryFormDialog } from '../category-form-dialog';

const TABLE_HEAD = [
  { id: 'id', label: '#ID', width: '12%' },
  { id: 'imageUrl', label: 'Image', width: '18%', sortBy: false },
  { id: 'name', label: 'Name', width: '55%' },
  { id: '', label: 'Actions', width: '15%', sortBy: false, sx: { textAlign: 'right' } },
];

export function CategoryListView() {
  const table = useTable({ defaultOrderBy: 'id', defaultOrder: 'asc' });
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRows = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, errors } = await ApiService.getCategoryListAsync();
      if (data) {
        setRows(data);
      } else if (errors?.length) {
        toast.error(errors[0]?.msg || 'Could not load categories.');
      }
    } catch (error) {
      toast.error('Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return [...rows]
      .sort(getComparator(table.order, table.orderBy))
      .filter(
        (row) =>
          !query ||
          String(row.id).includes(query) ||
          row.name?.toLowerCase().includes(query)
      );
  }, [rows, searchTerm, table.order, table.orderBy]);

  const openDialog = (row = null) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      const result = await ApiService.deleteCategoryAsync(categoryToDelete.id);
      if (result?.data !== false) {
        setRows((prev) => prev.filter((item) => item.id !== categoryToDelete.id));
        toast.success('Category deleted successfully.');
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      } else {
        toast.error('Could not delete category.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardContent
      sx={(theme) => ({
        minHeight: '100%',
        color: theme.vars.palette.text.primary,
        backgroundColor: theme.vars.palette.background.default,
        '& .MuiTypography-root': { color: theme.vars.palette.text.primary },
        '& .MuiCard-root': {
          overflow: 'hidden',
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.vars.palette.background.paper,
          border: `1px solid ${theme.vars.palette.divider}`,
          boxShadow: theme.shadows[8],
          backdropFilter: 'blur(16px)',
        },
        '& .MuiTableCell-root': {
          color: theme.vars.palette.text.secondary,
          borderColor: theme.vars.palette.divider,
        },
        '& .MuiTableCell-head, & .MuiTableCell-stickyHeader': {
          color: theme.vars.palette.text.secondary,
          backgroundColor: theme.vars.palette.background.neutral,
          backgroundImage: 'none',
        },
        '& .MuiTableRow-root:hover .MuiTableCell-body': {
          backgroundColor: theme.vars.palette.action.hover,
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
      <Card>
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Category
            </Typography>
            <Typography variant="body2" color="text.secondary">
              List of categories with ID, Name, and Image URL
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: 1, sm: 'auto' } }}>
            <TextField
              size="small"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search category..."
              sx={{ minWidth: { sm: 250 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => openDialog()}
            >
              Add Category
            </Button>
          </Stack>
        </Box>

        {isLoading ? (
          <Stack alignItems="center" sx={{ py: 5, color: 'text.secondary' }}>
            Loading categories...
          </Stack>
        ) : rows.length === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 6, px: 3, color: 'text.secondary' }}>
            <Iconify icon="solar:folder-with-files-bold" width={36} sx={{ opacity: 0.45 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              No categories found. Click “Add Category” to create one.
            </Typography>
          </Stack>
        ) : (
          <TableContainer>
            <Table stickyHeader aria-label="categories table">
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={rows.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No categories match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>#{row.id}</TableCell>
                      <TableCell>
                        <Avatar
                          src={row.imageUrl}
                          alt={row.name}
                          variant="rounded"
                          sx={{ width: 44, height: 44, bgcolor: 'background.neutral' }}
                        >
                          <Iconify icon="solar:box-minimalistic-bold" width={22} sx={{ opacity: 0.5 }} />
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                          <Tooltip title="Edit category" arrow>
                            <IconButton color="primary" onClick={() => openDialog(row)}>
                              <Iconify icon="solar:pen-bold" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete category" arrow>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setCategoryToDelete(row);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <CategoryFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        row={editingRow}
        onSuccess={loadRows}
      />

      {/* Confirmation Dialog for Deleting Category */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete category &ldquo;{categoryToDelete?.name}&rdquo;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={isDeleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
