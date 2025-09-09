import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks, removeBookmark } from '../store/slices/bookmarksSlice';
import moment from 'moment';

const BookmarkCard = ({ article, onPress, onRemove }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(article)}>
      {article.imageUrl ? (
        <Image source={{ uri: article.imageUrl }} style={styles.cardImage} />
      ) : null}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {article.title}
        </Text>
        {!!(article.description || article.summary) && (
          <Text style={styles.cardDescription} numberOfLines={3}>
            {article.description || article.summary}
          </Text>
        )}
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardSource}>
            {article.source?.displayName || article.source?.name || article.source}
          </Text>
          {article.publishedAt && (
            <Text style={styles.cardDate}>{moment(article.publishedAt).fromNow()}</Text>
          )}
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(article)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BookmarksScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { bookmarks, loading } = useSelector((state) => state.bookmarks);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      await dispatch(fetchBookmarks()).unwrap();
    } catch (e) {
      // no-op
    }
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleOpenArticle = useCallback(
    (article) => {
      navigation.navigate('ArticleDetail', { article });
    },
    [navigation]
  );

  const handleRemove = useCallback(
    async (article) => {
      const id = article.id || article._id;
      try {
        await dispatch(removeBookmark(id)).unwrap();
      } catch (e) {
        // no-op
      }
    },
    [dispatch]
  );

  const renderItem = ({ item }) => (
    <BookmarkCard article={item} onPress={handleOpenArticle} onRemove={handleRemove} />
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading bookmarks...</Text>
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No bookmarks yet</Text>
        <Text style={styles.emptyHint}>Tap the ☆ on any article to save it here.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item, idx) => `${item.id || item._id || idx}`}
        renderItem={renderItem}
        contentContainerStyle={bookmarks.length === 0 ? styles.emptyContainer : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyContainer: { flex: 1 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  emptyTitle: { fontSize: 18, color: '#666', marginBottom: 8 },
  emptyHint: { fontSize: 14, color: '#888' },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  cardDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 12 },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardSource: { fontSize: 12, color: '#007AFF', fontWeight: '600' },
  cardDate: { fontSize: 12, color: '#999' },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  removeButton: { borderColor: '#ff3b30', borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  removeButtonText: { color: '#ff3b30', fontWeight: '600' },
});

export default BookmarksScreen;

