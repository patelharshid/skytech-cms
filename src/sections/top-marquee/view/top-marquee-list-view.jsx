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
              Add Announcement
            </Button>
          </Stack>
        </Box>
        {isLoading ? (
          <Stack alignItems="center" sx={{ py: 5, color: 'text.secondary' }}>
            Loading announcements...
          </Stack>
        ) : rows.length === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 6, px: 3, color: 'text.secondary' }}>
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
                    <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No announcements match your search.
                    </TableCell>
                  </TableRow>
                ) : filteredRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>#{row.id}</TableCell>
                    <TableCell sx={{ maxWidth: 0, whiteSpace: 'normal', color: 'text.primary' }}>
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
