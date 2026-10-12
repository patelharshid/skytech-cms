import axios from 'axios';

async function loginAsync(payload) {
  const config = {
    method: 'post',
    url: '/auth/login',
    data: payload,
  };
  return await axios(config);
}

async function renewSessionAsync(payload) {
  const config = {
    method: 'post',
    url: '/auth/renew-session',
    data: payload,
  };
  return await axios(config);
}

// Top marquee
async function getTopMarqueeListAsync() {
  const config = {
    method: 'get',
    url: '/api/topmarquee/getTopMarquee',
  };
  return await axios(config);
}

async function saveTopMarqueeAsync(payload) {
  const config = {
    method: 'post',
    url: '/api/topmarquee',
    data: payload,
  };
  return await axios(config);
}

async function updateTopMarqueeAsync(id, payload) {
  const config = {
    method: 'put',
    url: `/api/topmarquee/${id}`,
    data: payload,
  };
  return await axios(config);
}

async function deleteTopMarqueeAsync(id, payload) {
  const config = {
    method: 'delete',
    url: `/api/topmarquee/${id}`,
    data: payload,
  };
  return await axios(config);
}

// Categories
async function getCategoryListAsync() {
  const config = {
    method: 'get',
    url: '/api/category',
  };
  return await axios(config);
}

async function getCategoryByIdAsync(id) {
  const config = {
    method: 'get',
    url: `/api/category/${id}`,
  };
  return await axios(config);
}

async function saveCategoryAsync(payload) {
  const config = {
    method: 'post',
    url: '/api/category',
    data: payload,
  };
  return await axios(config);
}

async function updateCategoryAsync(id, payload) {
  const config = {
    method: 'put',
    url: `/api/category/${id}`,
    data: payload,
  };
  return await axios(config);
}

async function deleteCategoryAsync(id) {
  const config = {
    method: 'delete',
    url: `/api/category/${id}`,
  };
  return await axios(config);
}

// Brands
async function getBrandListAsync(params) {
  const config = {
    method: 'get',
    url: '/api/brand',
    params,
  };
  return await axios(config);
}

async function getBrandByIdAsync(id) {
  const config = {
    method: 'get',
    url: `/api/brand/${id}`,
  };
  return await axios(config);
}

async function saveBrandAsync(payload) {
  const config = {
    method: 'post',
    url: '/api/brand',
    data: payload,
  };
  return await axios(config);
}

async function updateBrandAsync(id, payload) {
  const config = {
    method: 'put',
    url: `/api/brand/${id}`,
    data: payload,
  };
  return await axios(config);
}

async function deleteBrandAsync(id) {
  const config = {
    method: 'delete',
    url: `/api/brand/${id}`,
  };
  return await axios(config);
}

// Products
async function getProductListAsync(params) {
  const config = {
    method: 'get',
    url: '/api/product',
    params,
  };
  return await axios(config);
}

async function getProductByIdAsync(id) {
  const config = {
    method: 'get',
    url: `/api/product/${id}`,
  };
  return await axios(config);
}

async function getProductBySkuAsync(sku) {
  const config = {
    method: 'get',
    url: `/api/product/sku/${sku}`,
  };
  return await axios(config);
}

async function saveProductAsync(payload) {
  const config = {
    method: 'post',
    url: '/api/product',
    data: payload,
  };
  return await axios(config);
}

async function updateProductAsync(id, payload) {
  const config = {
    method: 'put',
    url: `/api/product/${id}`,
    data: payload,
  };
  return await axios(config);
}

async function updateProductStockAsync(id, payload) {
  const config = {
    method: 'patch',
    url: `/api/product/${id}/stock`,
    data: payload,
  };
  return await axios(config);
}

async function updateProductStatusAsync(id, status) {
  const config = {
    method: 'patch',
    url: `/api/product/${id}/status`,
    params: { status },
  };
  return await axios(config);
}

async function deleteProductAsync(id) {
  const config = {
    method: 'delete',
    url: `/api/product/${id}`,
  };
  return await axios(config);
}

export default {
  loginAsync,
  renewSessionAsync,

  getTopMarqueeListAsync,
  saveTopMarqueeAsync,
  updateTopMarqueeAsync,
  deleteTopMarqueeAsync,

  getCategoryListAsync,
  getCategoryByIdAsync,
  saveCategoryAsync,
  updateCategoryAsync,
  deleteCategoryAsync,

  getBrandListAsync,
  getBrandByIdAsync,
  saveBrandAsync,
  updateBrandAsync,
  deleteBrandAsync,

  getProductListAsync,
  getProductByIdAsync,
  getProductBySkuAsync,
  saveProductAsync,
  updateProductAsync,
  updateProductStockAsync,
  updateProductStatusAsync,
  deleteProductAsync,

  // Inquiries
  getInquiryListAsync,
  getInquiryByIdAsync,
  createInquiryAsync,
  updateInquiryStatusAsync,
  deleteInquiryAsync,
};

// Inquiries
async function getInquiryListAsync(params) {
  const config = {
    method: 'get',
    url: '/api/inquiry',
    params,
  };
  return await axios(config);
}

async function getInquiryByIdAsync(id) {
  const config = {
    method: 'get',
    url: `/api/inquiry/${id}`,
  };
  return await axios(config);
}

async function createInquiryAsync(payload) {
  const config = {
    method: 'post',
    url: '/api/inquiry',
    data: payload,
  };
  return await axios(config);
}

async function updateInquiryStatusAsync(id, status) {
  const config = {
    method: 'patch',
    url: `/api/inquiry/${id}/status`,
    params: { status },
  };
  return await axios(config);
}

async function deleteInquiryAsync(id) {
  const config = {
    method: 'delete',
    url: `/api/inquiry/${id}`,
  };
  return await axios(config);
}



