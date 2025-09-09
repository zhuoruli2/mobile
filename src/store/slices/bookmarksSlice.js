import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@carnews/bookmarks';

// Async thunks
export const fetchBookmarks = createAsyncThunk('bookmarks/fetchBookmarks', async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : { bookmarks: [] };
  return parsed.bookmarks;
});

export const addBookmark = createAsyncThunk(
  'bookmarks/addBookmark',
  async (article, { getState }) => {
    const state = getState();
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : { bookmarks: [] };

    // Avoid duplicates by id
    const id = article.id || article._id;
    if (!parsed.bookmarks.find((b) => (b.id || b._id) === id)) {
      parsed.bookmarks.unshift(article);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return { article };
  }
);

export const removeBookmark = createAsyncThunk('bookmarks/removeBookmark', async (articleId) => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : { bookmarks: [] };
  parsed.bookmarks = parsed.bookmarks.filter((b) => (b.id || b._id) !== articleId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  return articleId;
});

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    bookmarks: [],
    bookmarkedIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBookmarks: (state) => {
      state.bookmarks = [];
      state.bookmarkedIds = [];
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
        state.bookmarkedIds = action.payload.map((b) => b.id || b._id);
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
        const id = action.payload.article.id || action.payload.article._id;
        if (!state.bookmarkedIds.includes(id)) {
          state.bookmarkedIds.push(id);
          state.bookmarks.unshift(action.payload.article);
        }
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
        state.bookmarkedIds = state.bookmarkedIds.filter(id => id !== action.payload);
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
