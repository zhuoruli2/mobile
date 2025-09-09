// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Development API for Android emulator (10.0.2.2 maps to localhost)
  : 'https://your-production-api.com/api'; // Production API

export const API_ENDPOINTS = {
  // Articles
  GET_ARTICLES: '/articles',
  GET_ARTICLE: (id) => `/articles/${id}`,
  SEARCH_ARTICLES: '/articles/search',
  GET_ARTICLES_BY_CATEGORY: (category) => `/articles/category/${category}`,
  
  // Sources
  GET_SOURCES: '/sources',

  // Anonymous bookmarks (clientId)
  GET_BOOKMARKS: '/bookmarks',
  ADD_BOOKMARK: (articleId) => `/bookmarks/${articleId}`,
  REMOVE_BOOKMARK: (articleId) => `/bookmarks/${articleId}`,
};

export const REQUEST_TIMEOUT = 30000; // 30 seconds
