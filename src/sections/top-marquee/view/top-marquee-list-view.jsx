import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { useSetState } from 'minimal-shared/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';
import { TableToolbar } from 'src/sections/table-toolbar';
import ApiService from 'src/services/ApiService';
import dateHelper from 'src/utils/dateHelper';

const TABLE_HEAD = [
  { id: 'title', label: 'Announcement', width: '55%' },
  { id: 'createdDateTime', label: 'Created', width: '25%' },
  { id: 'isActive', label: 'Status', width: '10%' },
  { id: '', label: 'Actions', width: '10%', sortBy: false, sx: { textAlign: 'center' } },
];

export function TopMarqueeListView() {
  const table = useTable({ defaultOrderBy: 'createdDateTime', defaultOrder: 'desc' });
  const filters = useSetState({ search: '' });
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRows = useCallback(async () => {
    setIsLoading(true);
    const { data, errors } = await ApiService.getTopMarqueeListAsync();
    if (data) {
      setRows(data);
    } else if (errors?.length) {
      toast.error(errors[0]?.msg || 'Could not load announcements.');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const filteredRows = useMemo(() => {
    const search = filters.state.search.trim().toLowerCase();
    const sorted = [...rows].sort(getComparator(table.order, table.orderBy));
    return search ? sorted.filter((row) => row.title?.toLowerCase().includes(search)) : sorted;
  }, [filters.state.search, rows, table.order, table.orderBy]);

  const openDialog = (row = null) => {
    setEditingRow(row);
    setTitle(row?.title ?? '');
    setIsActive(row?.isActive ?? true);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (!isSaving) setDialogOpen(false);
  };

  const saveRow = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setIsSaving(true);
    const payload = { title: trimmedTitle, isActive };
    const result = editingRow
      ? await ApiService.updateTopMarqueeAsync(editingRow.id, payload)
      : await ApiService.saveTopMarqueeAsync(payload);
    setIsSaving(false);

    if (result.data) {
      toast.success(editingRow ? 'Announcement updated.' : 'Announcement created.');
      setDialogOpen(false);
      await loadRows();
    } else {
      toast.error(result.errors?.[0]?.msg || 'Could not save the announcement.');
    }
  };

  const deleteRow = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const { data, errors } = await ApiService.deleteTopMarqueeAsync(deleteTarget.id);
    setIsDeleting(false);
    if (data) {
      toast.success('Announcement deleted.');
      setDeleteTarget(null);
      await loadRows();
    } else {
      toast.error(errors?.[0]?.msg || 'Could not delete the announcement.');
    }
  };

  const pageRows = filteredRows.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return (
    <DashboardContent
      sx={{
        minHeight: '100%',
        color: '#f8fafc',
        background:
          'radial-gradient(circle at 50% 0%, rgba(15, 23, 42, 0.92) 0%, #080c14 68%)',
        '& .MuiTypography-root': { color: '#f8fafc' },
        '& .MuiBreadcrumbs-li': { color: '#94a3b8' },
        '& .MuiCard-root': {
          overflow: 'hidden',
          color: '#f8fafc',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(16px)',
        },
        '& .MuiTableCell-root': {
          color: '#cbd5e1',
          borderColor: 'rgba(255, 255, 255, 0.07)',
        },
        '& .MuiTableCell-head, & .MuiTableCell-stickyHeader': {
          color: '#94a3b8',
          backgroundColor: '#141f36',
          backgroundImage: 'none',
        },
        '& .MuiTableRow-root:hover .MuiTableCell-body': {
          backgroundColor: 'rgba(26, 39, 68, 0.8)',
        },
        '& .MuiOutlinedInput-root': {
          color: '#f8fafc',
          backgroundColor: 'rgba(20, 31, 54, 0.75)',
          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.24)' },
          '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
        },
        '& .MuiInputLabel-root': { color: '#94a3b8' },
        '& .MuiButton-contained': {
          color: '#090d16',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          boxShadow: '0 4px 16px rgba(245, 158, 11, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
          },
        },
        '& .MuiTablePagination-root, & .MuiTablePagination-selectIcon, & .MuiTablePagination-actions button': {
          color: '#94a3b8',
        },
        '& .MuiTablePagination-actions button.Mui-disabled': { color: '#475569' },
      }}
    >
      <CustomBreadcrumbs
        heading="Top Marquee"
        links={[{ name: 'Dashboard', href: '' }, { name: 'Top Marquee' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => openDialog()}
          >
            New Announcement
          </Button>
        }
        sx={{ mb: { xs: 2, md: 2 } }}
      />

      <Card>
        <TableToolbar
          filters={filters}
          onFilterChange={(search) => {
            filters.setState({ search });
            table.onResetPage();
          }}
          placeholder="Search announcements"
        />
        <TableContainer sx={{ height: 'calc(100vh - 40vh)' }}>
          <Box sx={{ position: 'relative' }}>
            <Table stickyHeader aria-label="top marquee announcements">
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={filteredRows.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />
              {isLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length}>
                      <Stack alignItems="center" sx={{ py: 4 }}>
                        <LinearProgress sx={{ width: '50%', maxWidth: 360 }} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  <TableNoData label="No announcements found" notFound={!filteredRows.length} />
                  {pageRows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ maxWidth: 0, whiteSpace: 'normal' }}>{row.title}</TableCell>
                      <TableCell>
                        {dateHelper.formatDateTime(row.createdDateTime) || '—'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.isActive ? 'Active' : 'Inactive'}
                          color={row.isActive ? 'success' : 'default'}
                          variant="soft"
                          sx={
                            row.isActive
                              ? {
                                  color: '#34d399',
                                  borderColor: 'rgba(16, 185, 129, 0.3)',
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                }
                              : {
                                  color: '#94a3b8',
                                  borderColor: 'rgba(255, 255, 255, 0.12)',
                                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                                }
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Edit" arrow>
                            <IconButton color="primary" onClick={() => openDialog(row)}>
                              <Iconify icon="solar:pen-bold" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton color="error" onClick={() => setDeleteTarget(row)}>
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableEmptyRows
                    height={56}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, filteredRows.length)}
                  />
                </TableBody>
              )}
            </Table>
          </Box>
        </TableContainer>
        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={filteredRows.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        sx={{
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
        }}
      >
        <Box component="form" onSubmit={saveRow}>
          <DialogTitle>{editingRow ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
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
                <Switch checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={closeDialog} color="inherit">
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSaving}>
              Save
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        title="Delete Announcement"
        content={<>Delete this top marquee announcement?</>}
        sx={{
          '& .MuiDialog-paper': {
            color: '#f8fafc',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          },
          '& .MuiButton-outlined': {
            color: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.18)',
          },
        }}
        action={
          <LoadingButton variant="contained" color="error" loading={isDeleting} onClick={deleteRow}>
            Delete
          </LoadingButton>
        }
      />
    </DashboardContent>
  );
}
