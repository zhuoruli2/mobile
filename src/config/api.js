// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development API
  : 'https://your-production-api.com/api'; // Production API

export const API_ENDPOINTS = {
  // Articles
  GET_ARTICLES: '/articles',
  GET_ARTICLE: (id) => `/articles/${id}`,
  SEARCH_ARTICLES: '/articles/search',
  GET_ARTICLES_BY_CATEGORY: (category) => `/articles/category/${category}`,
  
  // Sources
  GET_SOURCES: '/sources',
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // User
  GET_BOOKMARKS: '/user/bookmarks',
  ADD_BOOKMARK: (articleId) => `/user/bookmarks/${articleId}`,
  REMOVE_BOOKMARK: (articleId) => `/user/bookmarks/${articleId}`,
};

export const REQUEST_TIMEOUT = 30000; // 30 seconds