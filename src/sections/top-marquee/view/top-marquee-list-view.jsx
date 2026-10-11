import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
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
import { TopMarqueeFormDialog } from '../top-marquee-form-dialog';

const TABLE_HEAD = [
  { id: 'id', label: '#ID', width: '10%' },
  { id: 'title', label: 'Announcement Text', width: '63%' },
  { id: 'isActive', label: 'Active Status', width: '15%', sx: { textAlign: 'center' } },
  { id: '', label: 'Actions', width: '12%', sortBy: false, sx: { textAlign: 'right' } },
];

export function TopMarqueeListView() {
  const table = useTable({ defaultOrderBy: 'id', defaultOrder: 'asc' });
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

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
    const query = searchTerm.trim().toLowerCase();
    return [...rows]
      .sort(getComparator(table.order, table.orderBy))
      .filter(
        (row) =>
          !query ||
          String(row.id).includes(query) ||
          row.title?.toLowerCase().includes(query)
      );
  }, [rows, searchTerm, table.order, table.orderBy]);

  const openDialog = (row = null) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleToggleActive = async (row, checked) => {
    setUpdatingId(row.id);
    try {
      const payload = {
        title: row.title,
        isActive: checked,
      };
      const updateRequest = checked
        ? ApiService.updateTopMarqueeAsync(row.id, payload)
        : ApiService.deleteTopMarqueeAsync(row.id, { isActive: false });
      const { data, errors } = await updateRequest;
      if (data) {
        setRows((previousRows) =>
          previousRows.map((item) =>
            item.id === row.id ? { ...item, ...data, isActive: checked } : item
          )
        );
        toast.success(checked ? 'Announcement is active.' : 'Announcement is inactive.');
      } else {
        toast.error(errors?.[0]?.msg || 'Could not update announcement status.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update announcement status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardContent
      sx={{
        minHeight: '100%',
        color: '#f8fafc',
        background:
          'radial-gradient(circle at 50% 0%, rgba(15, 23, 42, 0.92) 0%, #080c14 68%)',
        '& .MuiTypography-root': { color: '#f8fafc' },
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
      }}
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
              Top Marquee Announcements
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: 1, sm: 'auto' } }}>
            <TextField
              size="small"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search announcements"
              sx={{ minWidth: { sm: 250 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: '#94a3b8' }} />
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
              Add Announcement
            </Button>
          </Stack>
        </Box>
        {isLoading ? (
          <Stack alignItems="center" sx={{ py: 5, color: '#64748b' }}>
            Loading announcements...
          </Stack>
        ) : rows.length === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 6, px: 3, color: '#64748b' }}>
            <Iconify icon="solar:megaphone-bold" width={36} sx={{ opacity: 0.45 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              No marquee announcements found. Click “Add Announcement” to create one.
            </Typography>
          </Stack>
        ) : (
          <TableContainer>
            <Table stickyHeader aria-label="top marquee announcements">
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
                    <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 5, color: '#64748b' }}>
                      No announcements match your search.
                    </TableCell>
                  </TableRow>
                ) : filteredRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>#{row.id}</TableCell>
                    <TableCell sx={{ maxWidth: 0, whiteSpace: 'normal', color: '#f8fafc' }}>
                      {row.title}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        size="small"
                        checked={Boolean(row.isActive)}
                        disabled={updatingId === row.id}
                        onChange={(event) => handleToggleActive(row, event.target.checked)}
                        inputProps={{ 'aria-label': `Toggle announcement ${row.id}` }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                        <Tooltip title="Edit announcement" arrow>
                          <IconButton color="primary" onClick={() => openDialog(row)}>
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <TopMarqueeFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        row={editingRow}
        onSuccess={loadRows}
      />

    </DashboardContent>
  );
}
