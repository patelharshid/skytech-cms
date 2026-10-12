import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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

const TABLE_HEAD = [
  { id: 'id', label: '#ID', width: '8%' },
  { id: 'fullName', label: 'Customer', width: '22%' },
  { id: 'contact', label: 'Contact Info', width: '24%' },
  { id: 'message', label: 'Message Preview', width: '24%' },
  { id: 'status', label: 'Status', width: '12%', sx: { textAlign: 'center' } },
  { id: '', label: 'Actions', width: '10%', sortBy: false, sx: { textAlign: 'right' } },
];

export function InquiryListView() {
  const table = useTable({ defaultOrderBy: 'id', defaultOrder: 'desc' });
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // View Details Dialog
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;

      const { data, errors } = await ApiService.getInquiryListAsync(params);
      if (data) {
        setRows(data);
      } else if (errors?.length) {
        toast.error(errors[0]?.msg || 'Could not load inquiries.');
      }
    } catch (error) {
      toast.error('Failed to load inquiries.');
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return [...rows]
      .sort(getComparator(table.order, table.orderBy))
      .filter((row) => {
        if (!query) return true;
        return (
          row.fullName?.toLowerCase().includes(query) ||
          row.email?.toLowerCase().includes(query) ||
          row.phone?.toLowerCase().includes(query) ||
          row.city?.toLowerCase().includes(query) ||
          row.message?.toLowerCase().includes(query)
        );
      });
  }, [rows, searchTerm, table.order, table.orderBy]);

  const handleOpenDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setUpdatingStatus(inquiry.status || 'NEW');
    setDetailDialogOpen(true);
  };

  const handleQuickStatusChange = async (inquiryId, newStatus) => {
    try {
      const result = await ApiService.updateInquiryStatusAsync(inquiryId, newStatus);
      if (result?.data) {
        setRows((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
        }
        toast.success(`Inquiry marked as ${newStatus}.`);
      } else {
        toast.error('Could not update status.');
      }
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const handleSaveStatusInModal = async () => {
    if (!selectedInquiry) return;
    setIsUpdatingStatus(true);
    try {
      await handleQuickStatusChange(selectedInquiry.id, updatingStatus);
      setDetailDialogOpen(false);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!inquiryToDelete) return;
    setIsDeleting(true);
    try {
      const result = await ApiService.deleteInquiryAsync(inquiryToDelete.id);
      if (result?.data !== false) {
        setRows((prev) => prev.filter((item) => item.id !== inquiryToDelete.id));
        toast.success('Inquiry record deleted.');
        setDeleteDialogOpen(false);
        setInquiryToDelete(null);
      } else {
        toast.error('Could not delete inquiry.');
      }
    } catch (e) {
      toast.error('Could not delete inquiry.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStatusChip = (status) => {
    const s = (status || 'NEW').toUpperCase();
    switch (s) {
      case 'NEW':
        return <Chip label="New" size="small" color="primary" variant="soft" />;
      case 'CONTACTED':
        return <Chip label="Contacted" size="small" color="warning" variant="soft" />;
      case 'IN_PROGRESS':
        return <Chip label="In Progress" size="small" color="info" variant="soft" />;
      case 'RESOLVED':
        return <Chip label="Resolved" size="small" color="success" variant="soft" />;
      case 'CLOSED':
        return <Chip label="Closed" size="small" color="default" variant="soft" />;
      default:
        return <Chip label={status} size="small" color="info" variant="soft" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
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
        {/* Header */}
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
              Customer Inquiries
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submissions received from the “Get In Touch With Us” website contact section
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:refresh-bold" />}
            onClick={() => loadInquiries()}
            sx={{ borderColor: 'divider', color: 'text.primary' }}
          >
            Refresh
          </Button>
        </Box>

        {/* Filters Bar */}
        <Box sx={{ px: 3, pb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            size="small"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, phone, email, city..."
            sx={{ minWidth: 260, flex: 1 }}
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

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="filter-status-label">Status</InputLabel>
            <Select
              labelId="filter-status-label"
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="NEW">New</MenuItem>
              <MenuItem value="CONTACTED">Contacted</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
        {isLoading ? (
          <Stack alignItems="center" sx={{ py: 6, color: 'text.secondary' }}>
            Loading inquiries...
          </Stack>
        ) : rows.length === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 6, px: 3, color: 'text.secondary' }}>
            <Iconify icon="solar:chat-round-dots-bold" width={42} sx={{ opacity: 0.4 }} />
            <Typography variant="body2" color="text.secondary">
              No inquiries found. Incoming contact forms will appear here.
            </Typography>
          </Stack>
        ) : (
          <TableContainer>
            <Table stickyHeader aria-label="inquiries table">
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
                      No inquiries match your search filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => (
                    <TableRow key={row.id} hover>
                      {/* ID */}
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontFamily: 'monospace' }}>
                        #{row.id}
                      </TableCell>

                      {/* Customer Info */}
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {row.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          City: {row.city || '—'}
                        </Typography>
                      </TableCell>

                      {/* Contact Info */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {row.phone}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.email}
                        </Typography>
                      </TableCell>

                      {/* Message Preview */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            maxWidth: 260,
                            color: row.message ? 'text.primary' : 'text.disabled',
                            fontStyle: row.message ? 'normal' : 'italic',
                          }}
                        >
                          {row.message || 'No additional message provided'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatDate(row.createdAt)}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell align="center">
                        {renderStatusChip(row.status)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                          <Tooltip title="View Full Details">
                            <IconButton color="primary" size="small" onClick={() => handleOpenDetail(row)}>
                              <Iconify icon="solar:eye-bold" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => {
                                setInquiryToDelete(row);
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

      {/* Inquiry Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
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
        <DialogTitle sx={{ pb: 1 }}>Inquiry Details #{selectedInquiry?.id}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {/* Customer Details Box */}
            <Box
              sx={(theme) => ({
                p: 2,
                borderRadius: 2,
                bgcolor: theme.vars.palette.background.neutral,
                border: `1px solid ${theme.vars.palette.divider}`,
              })}
            >
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Customer Name
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {selectedInquiry?.fullName}
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedInquiry?.phone}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedInquiry?.email}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      City
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedInquiry?.city}
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Received At
                  </Typography>
                  <Typography variant="caption" display="block">
                    {formatDate(selectedInquiry?.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Message Box */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Inquiry Message
              </Typography>
              <Box
                sx={(theme) => ({
                  p: 2,
                  minHeight: 100,
                  borderRadius: 2,
                  bgcolor: theme.vars.palette.background.neutral,
                  border: `1px solid ${theme.vars.palette.divider}`,
                  whiteSpace: 'pre-wrap',
                  color: selectedInquiry?.message ? 'text.primary' : 'text.secondary',
                  fontStyle: selectedInquiry?.message ? 'normal' : 'italic',
                })}
              >
                {selectedInquiry?.message || 'No additional message provided by customer.'}
              </Box>
            </Box>

            {/* Status Update Control */}
            <FormControl fullWidth size="small">
              <InputLabel id="inquiry-update-status-label">Update Status</InputLabel>
              <Select
                labelId="inquiry-update-status-label"
                value={updatingStatus}
                label="Update Status"
                onChange={(e) => setUpdatingStatus(e.target.value)}
              >
                <MenuItem value="NEW">New</MenuItem>
                <MenuItem value="CONTACTED">Contacted</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)} color="inherit" disabled={isUpdatingStatus}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveStatusInModal}
            disabled={isUpdatingStatus || updatingStatus === selectedInquiry?.status}
          >
            Save Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={(theme) => ({
          '& .MuiDialog-paper': {
            color: theme.vars.palette.text.primary,
            backgroundColor: theme.vars.palette.background.paper,
            border: `1px solid ${theme.vars.palette.divider}`,
            boxShadow: theme.shadows[24],
          },
        })}
      >
        <DialogTitle>Delete Inquiry</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete inquiry #{inquiryToDelete?.id} from &ldquo;{inquiryToDelete?.fullName}&rdquo;?
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
