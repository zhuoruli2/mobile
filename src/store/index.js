import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './slices/articlesSlice';
import bookmarksReducer from './slices/bookmarksSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    bookmarks: bookmarksReducer,
    auth: authReducer,
  },
});

export default store;