import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import ApiService from 'src/services/ApiService';

export function ProductFormDialog({ open, onClose, row, categories = [], brands = [], onSuccess }) {
  const [tab, setTab] = useState(0);

  // General
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [model, setModel] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [description, setDescription] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  // Pricing
  const [originalPrice, setOriginalPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [discountType, setDiscountType] = useState('NONE');
  const [discountValue, setDiscountValue] = useState('');

  // Inventory
  const [quantity, setQuantity] = useState(10);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);

  // Specifications
  const [specs, setSpecs] = useState([
    { specGroup: 'Performance', specKey: 'Processor', specValue: '' },
    { specGroup: 'Memory', specKey: 'RAM', specValue: '' },
    { specGroup: 'Storage', specKey: 'Storage', specValue: '' },
  ]);

  // Gallery
  const [galleryImages, setGalleryImages] = useState(['']);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTab(0);
    if (row) {
      setName(row.name ?? '');
      setSku(row.sku ?? '');
      setModel(row.model ?? '');
      setCategoryId(row.category?.id ?? '');
      setBrandId(row.brand?.id ?? '');
      setDescription(row.description ?? '');
      setFeaturedImageUrl(row.featuredImageUrl ?? '');
      setStatus(row.status ?? 'ACTIVE');

      setOriginalPrice(row.pricing?.originalPrice ?? '');
      setSellingPrice(row.pricing?.sellingPrice ?? '');
      setDiscountType(row.pricing?.discountType ?? 'NONE');
      setDiscountValue(row.pricing?.discountValue ?? '');

      setQuantity(row.inventory?.quantity ?? 0);
      setLowStockThreshold(row.inventory?.lowStockThreshold ?? 5);

      if (row.specifications?.length) {
        setSpecs(row.specifications.map((s) => ({
          specGroup: s.specGroup || 'General',
          specKey: s.specKey || '',
          specValue: s.specValue || '',
        })));
      } else {
        setSpecs([{ specGroup: 'General', specKey: '', specValue: '' }]);
      }

      if (row.galleryImages?.length) {
        setGalleryImages([...row.galleryImages]);
      } else {
        setGalleryImages(['']);
      }
    } else {
      // Default reset
      setName('');
      setSku('');
      setModel('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setBrandId(brands.length > 0 ? brands[0].id : '');
      setDescription('');
      setFeaturedImageUrl('');
      setStatus('ACTIVE');

      setOriginalPrice('');
      setSellingPrice('');
      setDiscountType('NONE');
      setDiscountValue('');

      setQuantity(10);
      setLowStockThreshold(5);

      setSpecs([
        { specGroup: 'Performance', specKey: 'Processor', specValue: '' },
        { specGroup: 'Memory', specKey: 'RAM', specValue: '' },
        { specGroup: 'Storage', specKey: 'Storage', specValue: '' },
      ]);
      setGalleryImages(['']);
    }
  }, [open, row, categories, brands]);

  // Computed final price preview
  const sellingNum = parseFloat(sellingPrice) || 0;
  const originalNum = parseFloat(originalPrice) || sellingNum;
  const discountValNum = parseFloat(discountValue) || 0;
  let finalPrice = sellingNum;
  if (discountType === 'PERCENTAGE' && discountValNum > 0) {
    finalPrice = Math.max(0, sellingNum - (sellingNum * discountValNum) / 100);
  } else if (discountType === 'FIXED' && discountValNum > 0) {
    finalPrice = Math.max(0, sellingNum - discountValNum);
  }
  const discountPct = originalNum > 0 && originalNum > finalPrice
    ? Math.round(((originalNum - finalPrice) / originalNum) * 100)
    : 0;

  const handleAddSpec = () => {
    setSpecs([...specs, { specGroup: 'General', specKey: '', specValue: '' }]);
  };

  const handleRemoveSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleAddGallery = () => {
    setGalleryImages([...galleryImages, '']);
  };

  const handleRemoveGallery = (index) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleGalleryChange = (index, value) => {
    const updated = [...galleryImages];
    updated[index] = value;
    setGalleryImages(updated);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error('Product name is required.');
      setTab(0);
      return;
    }
    if (!sku.trim()) {
      toast.error('SKU is required.');
      setTab(0);
      return;
    }
    if (!featuredImageUrl.trim()) {
      toast.error('Featured image URL is required.');
      setTab(0);
      return;
    }
    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      toast.error('Valid selling price is required.');
      setTab(1);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        model: model.trim() || null,
        categoryId: categoryId || null,
        brandId: brandId || null,
        description: description.trim() || null,
        featuredImageUrl: featuredImageUrl.trim(),
        status,
        pricing: {
          originalPrice: originalNum,
          sellingPrice: sellingNum,
          discountType,
          discountValue: discountValNum,
        },
        inventory: {
          quantity: parseInt(quantity, 10) || 0,
          lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
        },
        specifications: specs
          .filter((s) => s.specKey.trim() && s.specValue.trim())
          .map((s, index) => ({
            specGroup: s.specGroup.trim() || 'General',
            specKey: s.specKey.trim(),
            specValue: s.specValue.trim(),
            displayOrder: index,
          })),
        galleryImages: galleryImages.filter((url) => url.trim()),
      };

      const result = row
        ? await ApiService.updateProductAsync(row.id, payload)
        : await ApiService.saveProductAsync(payload);

      if (result?.data) {
        toast.success(row ? 'Product updated successfully.' : 'Product created successfully.');
        await onSuccess();
        onClose();
      } else {
        toast.error(result?.errors?.[0]?.msg || 'Could not save product.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      fullWidth
      maxWidth="md"
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
        '& .MuiTabs-indicator': {
          backgroundColor: theme.vars.palette.primary.main,
        },
        '& .MuiTab-root': {
          color: theme.vars.palette.text.secondary,
          '&.Mui-selected': {
            color: theme.vars.palette.primary.main,
            fontWeight: 700,
          },
        },
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
        <DialogTitle sx={{ pb: 1 }}>{row ? 'Edit Product' : 'New Product'}</DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={tab} onChange={(e, val) => setTab(val)} variant="scrollable" scrollButtons="auto">
            <Tab label="1. General Info" />
            <Tab label="2. Pricing & Discounts" />
            <Tab label="3. Stock & Inventory" />
            <Tab label="4. Tech Specs" />
            <Tab label="5. Gallery" />
          </Tabs>
        </Box>

        <DialogContent sx={{ minHeight: 380 }}>
          {/* TAB 0: GENERAL */}
          {tab === 0 && (
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                autoFocus
                fullWidth
                required
                label="Product Name"
                placeholder="e.g. Apple MacBook Pro 16\"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  required
                  label="SKU / Item Code"
                  placeholder="e.g. APL-MBP16-M3M-01"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  helperText="Unique product stock identifier"
                />
                <TextField
                  fullWidth
                  label="Model Number"
                  placeholder="e.g. A2991 / 2024"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={categoryId}
                    label="Category"
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="brand-select-label">Brand</InputLabel>
                  <Select
                    labelId="brand-select-label"
                    value={brandId}
                    label="Brand"
                    onChange={(e) => setBrandId(e.target.value)}
                  >
                    {brands.map((b) => (
                      <MenuItem key={b.id} value={b.id}>
                        {b.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <TextField
                fullWidth
                required
                label="Featured Image URL"
                placeholder="https://example.com/product-image.jpg"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
              />

              {featuredImageUrl && (
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
                  <Avatar src={featuredImageUrl} variant="rounded" sx={{ width: 64, height: 64 }} />
                  <Typography variant="caption" color="text.secondary">
                    Main catalog thumbnail
                  </Typography>
                </Box>
              )}

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Description"
                placeholder="Detailed product information..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>
          )}

          {/* TAB 1: PRICING */}
          {tab === 1 && (
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Original / List Price (MSRP)"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  helperText="Standard reference price"
                />
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Selling Price"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  helperText="Base store price before active discount"
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="discount-type-label">Discount Type</InputLabel>
                  <Select
                    labelId="discount-type-label"
                    value={discountType}
                    label="Discount Type"
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <MenuItem value="NONE">No Discount</MenuItem>
                    <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
                    <MenuItem value="FIXED">Fixed Amount ($)</MenuItem>
                  </Select>
                </FormControl>

                {discountType !== 'NONE' && (
                  <TextField
                    fullWidth
                    type="number"
                    label={discountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    InputProps={{
                      startAdornment: discountType === 'FIXED' ? <InputAdornment position="start">$</InputAdornment> : null,
                      endAdornment: discountType === 'PERCENTAGE' ? <InputAdornment position="end">%</InputAdornment> : null,
                    }}
                  />
                )}
              </Stack>

              <Box
                sx={(theme) => ({
                  p: 2,
                  bgcolor: theme.vars.palette.background.neutral,
                  borderRadius: 2,
                  border: `1px solid ${theme.vars.palette.divider}`,
                })}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Price Summary Preview
                </Typography>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary">Final Customer Price</Typography>
                    <Typography variant="h5" color="primary.main" fontWeight={700}>
                      ${finalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                  {discountPct > 0 && (
                    <Chip label={`${discountPct}% OFF`} color="success" size="small" />
                  )}
                </Stack>
              </Box>
            </Stack>
          )}

          {/* TAB 2: INVENTORY */}
          {tab === 2 && (
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Available Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  helperText="Units in warehouse"
                  inputProps={{ min: 0 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Low Stock Alert Threshold"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  helperText="Triggers low-stock warnings"
                  inputProps={{ min: 1 }}
                />
              </Stack>

              <FormControl fullWidth>
                <InputLabel id="product-status-label">Product Status</InputLabel>
                <Select
                  labelId="product-status-label"
                  value={status}
                  label="Product Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="ACTIVE">Active (Available in store)</MenuItem>
                  <MenuItem value="INACTIVE">Inactive (Hidden from customers)</MenuItem>
                  <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
                  <MenuItem value="DISCONTINUED">Discontinued</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}

          {/* TAB 3: TECH SPECS */}
          {tab === 3 && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Technical Specifications</Typography>
                <Button size="small" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleAddSpec}>
                  Add Spec
                </Button>
              </Box>

              {specs.map((spec, index) => (
                <Stack direction="row" spacing={1.5} alignItems="center" key={index}>
                  <TextField
                    size="small"
                    placeholder="Group (e.g. Performance)"
                    value={spec.specGroup}
                    onChange={(e) => handleSpecChange(index, 'specGroup', e.target.value)}
                    sx={{ width: '28%' }}
                  />
                  <TextField
                    size="small"
                    placeholder="Key (e.g. Chip / RAM)"
                    value={spec.specKey}
                    onChange={(e) => handleSpecChange(index, 'specKey', e.target.value)}
                    sx={{ width: '32%' }}
                  />
                  <TextField
                    size="small"
                    placeholder="Value (e.g. Apple M3 Max)"
                    value={spec.specValue}
                    onChange={(e) => handleSpecChange(index, 'specValue', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton size="small" color="error" onClick={() => handleRemoveSpec(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}

          {/* TAB 4: GALLERY */}
          {tab === 4 && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2">Extra Gallery Images</Typography>
                <Button size="small" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleAddGallery}>
                  Add Image URL
                </Button>
              </Box>

              {galleryImages.map((imgUrl, index) => (
                <Stack direction="row" spacing={1.5} alignItems="center" key={index}>
                  <Avatar src={imgUrl} variant="rounded" sx={{ width: 40, height: 40 }} />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="https://example.com/gallery-photo.jpg"
                    value={imgUrl}
                    onChange={(e) => handleGalleryChange(index, e.target.value)}
                  />
                  <IconButton size="small" color="error" onClick={() => handleRemoveGallery(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={saving}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={saving}>
            {row ? 'Update Product' : 'Create Product'}
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
