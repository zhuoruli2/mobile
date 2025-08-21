import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import articleService from '../../services/articleService';

// Async thunks
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ page = 1, limit = 20 }) => {
    const response = await articleService.getArticles(page, limit);
    return response;
  }
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (articleId) => {
    const response = await articleService.getArticleById(articleId);
    return response;
  }
);

export const searchArticles = createAsyncThunk(
  'articles/searchArticles',
  async ({ query, page = 1, limit = 20 }) => {
    const response = await articleService.searchArticles(query, page, limit);
    return response;
  }
);

export const fetchArticlesByCategory = createAsyncThunk(
  'articles/fetchArticlesByCategory',
  async ({ category, page = 1, limit = 20 }) => {
    const response = await articleService.getArticlesByCategory(category, page, limit);
    return response;
  }
);

export const fetchSources = createAsyncThunk(
  'articles/fetchSources',
  async () => {
    const response = await articleService.getSources();
    return response;
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    currentArticle: null,
    searchResults: [],
    sources: [],
    loading: false,
    error: null,
    currentPage: 1,
    hasMore: true,
    refreshing: false,
  },
  reducers: {
    clearArticles: (state) => {
      state.articles = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setCurrentArticle: (state, action) => {
      state.currentArticle = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch articles
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        if (data.pagination.page === 1) {
          state.articles = data.articles;
        } else {
          state.articles = [...state.articles, ...data.articles];
        }
        state.currentPage = data.pagination.page;
        state.hasMore = data.pagination.page < data.pagination.pages;
        state.refreshing = false;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.refreshing = false;
      });

    // Fetch article by ID
    builder
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArticle = action.payload.data;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Search articles
    builder
      .addCase(searchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        if (data.pagination.page === 1) {
          state.searchResults = data.articles;
        } else {
          state.searchResults = [...state.searchResults, ...data.articles];
        }
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Fetch articles by category
    builder
      .addCase(fetchArticlesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticlesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        if (data.pagination.page === 1) {
          state.articles = data.articles;
        } else {
          state.articles = [...state.articles, ...data.articles];
        }
        state.currentPage = data.pagination.page;
        state.hasMore = data.pagination.page < data.pagination.pages;
      })
      .addCase(fetchArticlesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Fetch sources
    builder
      .addCase(fetchSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = action.payload.data;
      })
      .addCase(fetchSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearArticles, clearSearchResults, setCurrentArticle } = articlesSlice.actions;
export default articlesSlice.reducer;