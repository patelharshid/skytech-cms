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
};

