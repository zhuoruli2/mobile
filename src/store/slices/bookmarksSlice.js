import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import articleService from '../../services/articleService';

// Async thunks
export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async () => {
    const response = await articleService.getBookmarks();
    return response;
  }
);

export const addBookmark = createAsyncThunk(
  'bookmarks/addBookmark',
  async (articleId) => {
    const response = await articleService.addBookmark(articleId);
    return { articleId, ...response };
  }
);

export const removeBookmark = createAsyncThunk(
  'bookmarks/removeBookmark',
  async (articleId) => {
    await articleService.removeBookmark(articleId);
    return articleId;
  }
);

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    bookmarks: [],
    bookmarkedIds: new Set(),
    loading: false,
    error: null,
  },
  reducers: {
    clearBookmarks: (state) => {
      state.bookmarks = [];
      state.bookmarkedIds = new Set();
    },
  },
  extraReducers: (builder) => {
    // Fetch bookmarks
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload;
        state.bookmarkedIds = new Set(action.payload.map(b => b.id));
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Add bookmark
    builder
      .addCase(addBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarkedIds.add(action.payload.articleId);
        // Optionally add the full article to bookmarks array
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Remove bookmark
    builder
      .addCase(removeBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarkedIds.delete(action.payload);
        state.bookmarks = state.bookmarks.filter(b => b.id !== action.payload);
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;