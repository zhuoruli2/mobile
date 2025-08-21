import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../store/slices/articlesSlice';
import moment from 'moment';

const ArticleCard = ({ article, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(article)}>
      {article.imageUrl && (
        <Image source={{ uri: article.imageUrl }} style={styles.cardImage} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={3}>
          {article.description || article.summary}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardSource}>
            {article.source?.displayName || article.source}
          </Text>
          <Text style={styles.cardDate}>
            {moment(article.publishedAt).fromNow()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { articles, loading, error, currentPage, hasMore, refreshing } = useSelector(
    (state) => state.articles
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadArticles(1);
  }, []);

  const loadArticles = useCallback(
    async (page = 1) => {
      try {
        await dispatch(fetchArticles({ page, limit: 20 })).unwrap();
      } catch (error) {
        console.error('Error loading articles:', error);
      }
    },
    [dispatch]
  );

  const handleRefresh = useCallback(() => {
    loadArticles(1);
  }, [loadArticles]);

  const handleLoadMore = useCallback(async () => {
    if (!isLoadingMore && hasMore && !loading) {
      setIsLoadingMore(true);
      await loadArticles(currentPage + 1);
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, loading, currentPage, loadArticles]);

  const handleArticlePress = useCallback(
    (article) => {
      navigation.navigate('ArticleDetail', { article });
    },
    [navigation]
  );

  const renderArticle = ({ item }) => (
    <ArticleCard article={item} onPress={handleArticlePress} />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No articles available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (error && articles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id || item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={articles.length === 0 ? styles.emptyContainer : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSource: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;