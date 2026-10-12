import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { ProductFormDialog } from '../product-form-dialog';
import { ProductStockDialog } from '../product-stock-dialog';

const TABLE_HEAD = [
  { id: 'name', label: 'Product', width: '32%' },
  { id: 'sku', label: 'SKU', width: '13%' },
  { id: 'category', label: 'Category / Brand', width: '15%' },
  { id: 'price', label: 'Price', width: '12%' },
  { id: 'inventory', label: 'Stock', width: '12%', sx: { textAlign: 'center' } },
  { id: 'status', label: 'Status', width: '10%', sx: { textAlign: 'center' } },
  { id: '', label: 'Actions', width: '10%', sortBy: false, sx: { textAlign: 'right' } },
];

export function ProductListView() {
  const table = useTable({ defaultOrderBy: 'name', defaultOrder: 'asc' });
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load auxiliary data
  const loadLookups = useCallback(async () => {
    try {
      const [catsRes, brandsRes] = await Promise.all([
        ApiService.getCategoryListAsync(),
        ApiService.getBrandListAsync(),
      ]);
      if (catsRes?.data) setCategories(catsRes.data);
      if (brandsRes?.data) setBrands(brandsRes.data);
    } catch (e) {
      console.warn('Error loading lookups', e);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filterCategory) params.categoryId = filterCategory;
      if (filterBrand) params.brandId = filterBrand;
      if (filterStatus) params.status = filterStatus;

      const { data, errors } = await ApiService.getProductListAsync(params);
      if (data) {
        setRows(data);
      } else if (errors?.length) {
        toast.error(errors[0]?.msg || 'Could not load products.');
      }
    } catch (error) {
      toast.error('Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, filterBrand, filterStatus]);

  useEffect(() => {
    loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return [...rows]
      .sort(getComparator(table.order, table.orderBy))
      .filter((row) => {
        if (!query) return true;
        return (
          row.name?.toLowerCase().includes(query) ||
          row.sku?.toLowerCase().includes(query) ||
          row.model?.toLowerCase().includes(query) ||
          row.brand?.name?.toLowerCase().includes(query)
        );
      });
  }, [rows, searchTerm, table.order, table.orderBy]);

  const handleOpenForm = (product = null) => {
    setEditingProduct(product);
    setFormDialogOpen(true);
  };

  const handleOpenStock = (product) => {
    setStockProduct(product);
    setStockDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const result = await ApiService.deleteProductAsync(productToDelete.id);
      if (result?.data !== false) {
        setRows((prev) => prev.filter((p) => p.id !== productToDelete.id));
        toast.success('Product deleted.');
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } else {
        toast.error('Could not delete product.');
      }
    } catch (e) {
      toast.error('Could not delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStatusChip = (status, isInStock) => {
    if (!isInStock || status === 'OUT_OF_STOCK') {
      return <Chip label="Out of Stock" size="small" color="error" variant="soft" />;
    }
    if (status === 'ACTIVE') {
      return <Chip label="Active" size="small" color="success" variant="soft" />;
    }
    if (status === 'INACTIVE') {
      return <Chip label="Inactive" size="small" color="default" variant="soft" />;
    }
    return <Chip label={status} size="small" color="warning" variant="soft" />;
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
        {/* Header & Quick Action */}
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
              Product Inventory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage complete electronics catalog, tech specs, pricing, and stock levels
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenForm()}
          >
            Add Product
          </Button>
        </Box>

        {/* Filter Bar */}
        <Box sx={{ px: 3, pb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            size="small"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, SKU, model..."
            sx={{ minWidth: 240, flex: 1 }}
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filter-cat-label">Category</InputLabel>
            <Select
              labelId="filter-cat-label"
              value={filterCategory}
              label="Category"
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="filter-brand-label">Brand</InputLabel>
            <Select
              labelId="filter-brand-label"
              value={filterBrand}
              label="Brand"
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              <MenuItem value="">All Brands</MenuItem>
              {brands.map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="filter-status-label">Status</InputLabel>
            <Select
              labelId="filter-status-label"
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
              <MenuItem value="DISCONTINUED">Discontinued</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Products Table */}
        {isLoading ? (
          <Stack alignItems="center" sx={{ py: 6, color: 'text.secondary' }}>
            Loading products...
          </Stack>
        ) : rows.length === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 6, px: 3, color: 'text.secondary' }}>
            <Iconify icon="solar:box-minimalistic-bold" width={42} sx={{ opacity: 0.4 }} />
            <Typography variant="body2" color="text.secondary">
              No products found. Click “Add Product” to add your first item.
            </Typography>
          </Stack>
        ) : (
          <TableContainer>
            <Table stickyHeader aria-label="products table">
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
                      No products match your search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => {
                    const finalPrice = row.pricing?.finalPrice ?? row.pricing?.sellingPrice ?? 0;
                    const discountPct = row.pricing?.discountPercentage ?? 0;
                    const quantity = row.inventory?.quantity ?? 0;
                    const isLowStock = row.inventory?.isLowStock ?? false;
                    const isInStock = row.inventory?.isInStock ?? (quantity > 0);

                    return (
                      <TableRow key={row.id} hover>
                        {/* Name & Image */}
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              src={row.featuredImageUrl}
                              alt={row.name}
                              variant="rounded"
                              sx={{ width: 48, height: 48, bgcolor: 'background.neutral' }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" noWrap sx={{ maxWidth: 260 }}>
                                {row.name}
                              </Typography>
                              {row.model && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Model: {row.model}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>

                        {/* SKU */}
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {row.sku}
                        </TableCell>

                        {/* Category & Brand */}
                        <TableCell>
                          <Typography variant="body2">{row.category?.name || '—'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.brand?.name || '—'}
                          </Typography>
                        </TableCell>

                        {/* Price */}
                        <TableCell>
                          <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                            ${Number(finalPrice).toFixed(2)}
                          </Typography>
                          {discountPct > 0 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              ${Number(row.pricing?.originalPrice ?? row.pricing?.sellingPrice).toFixed(2)}
                            </Typography>
                          )}
                        </TableCell>

                        {/* Stock */}
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                            <Typography variant="body2" fontWeight={600}>
                              {quantity}
                            </Typography>
                            {isLowStock && (
                              <Tooltip title="Low stock threshold reached">
                                <Box component="span" sx={{ color: 'warning.main', display: 'flex' }}>
                                  <Iconify icon="solar:danger-triangle-bold" width={16} />
                                </Box>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>

                        {/* Status */}
                        <TableCell align="center">
                          {renderStatusChip(row.status, isInStock)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right">
                          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                            <Tooltip title="Update Stock">
                              <IconButton color="default" size="small" onClick={() => handleOpenStock(row)}>
                                <Iconify icon="solar:box-minimalistic-bold" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Product">
                              <IconButton color="primary" size="small" onClick={() => handleOpenForm(row)}>
                                <Iconify icon="solar:pen-bold" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Product">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => {
                                  setProductToDelete(row);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        row={editingProduct}
        categories={categories}
        brands={brands}
        onSuccess={loadProducts}
      />

      {/* Stock Update Dialog */}
      <ProductStockDialog
        open={stockDialogOpen}
        onClose={() => setStockDialogOpen(false)}
        product={stockProduct}
        onSuccess={loadProducts}
      />

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
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &ldquo;{productToDelete?.name}&rdquo;? This will remove all pricing and specs associated with this product.
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
