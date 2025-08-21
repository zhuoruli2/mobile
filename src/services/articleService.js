import apiClient from './apiService';
import { API_ENDPOINTS } from '../config/api';

const articleService = {
  // Get all articles with pagination
  getArticles: async (page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_ARTICLES, {
        params: { page, limit }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single article by ID
  getArticleById: async (articleId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_ARTICLE(articleId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search articles
  searchArticles: async (query, page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SEARCH_ARTICLES, {
        params: { q: query, page, limit }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get articles by category
  getArticlesByCategory: async (category, page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.GET_ARTICLES_BY_CATEGORY(category),
        { params: { page, limit } }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get news sources
  getSources: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_SOURCES);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add bookmark
  addBookmark: async (articleId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADD_BOOKMARK(articleId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove bookmark
  removeBookmark: async (articleId) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.REMOVE_BOOKMARK(articleId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user bookmarks
  getBookmarks: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_BOOKMARKS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default articleService;