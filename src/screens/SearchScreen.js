import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { searchArticles, clearSearchResults } from '../store/slices/articlesSlice';
import moment from 'moment';

const SearchResultCard = ({ article, onPress }) => {
  return (
    <TouchableOpacity style={styles.resultCard} onPress={() => onPress(article)}>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.resultDescription} numberOfLines={2}>
          {article.description || article.summary}
        </Text>
        <View style={styles.resultMeta}>
          <Text style={styles.resultSource}>{article.source}</Text>
          <Text style={styles.resultDate}>
            {moment(article.publishedAt).fromNow()}
          </Text>
        </View>
      </View>
      {article.imageUrl && (
        <Image source={{ uri: article.imageUrl }} style={styles.resultImage} />
      )}
    </TouchableOpacity>
  );
};

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.articles);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  const handleSearch = useCallback(
    async (query = searchQuery, page = 1) => {
      if (!query.trim()) return;

      setIsSearching(true);
      try {
        await dispatch(searchArticles({ query, page, limit: 20 })).unwrap();
        
        // Add to search history
        setSearchHistory((prev) => {
          const filtered = prev.filter((item) => item !== query);
          return [query, ...filtered].slice(0, 10);
        });
        
        setSearchPage(page);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch, searchQuery]
  );

  const handleLoadMore = useCallback(() => {
    if (!isSearching && searchQuery) {
      handleSearch(searchQuery, searchPage + 1);
    }
  }, [isSearching, searchQuery, searchPage, handleSearch]);

  const handleArticlePress = useCallback(
    (article) => {
      navigation.navigate('ArticleDetail', { article });
    },
    [navigation]
  );

  const handleHistoryItemPress = useCallback(
    (query) => {
      setSearchQuery(query);
      handleSearch(query, 1);
    },
    [handleSearch]
  );

  const renderSearchResult = ({ item }) => (
    <SearchResultCard article={item} onPress={handleArticlePress} />
  );

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleHistoryItemPress(item)}
    >
      <Text style={styles.historyIcon}>🔍</Text>
      <Text style={styles.historyText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (loading || isSearching) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.searchingText}>Searching...</Text>
        </View>
      );
    }

    if (searchQuery && !isSearching) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsText}>No results found</Text>
          <Text style={styles.tryAgainText}>Try a different search term</Text>
        </View>
      );
    }

    if (searchHistory.length > 0) {
      return (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recent Searches</Text>
          <FlatList
            data={searchHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => `history-${index}`}
          />
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.promptText}>Search for car news</Text>
        <Text style={styles.hintText}>
          Try searching for brands, models, or topics
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search car news..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery, 1)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery('');
                dispatch(clearSearchResults());
              }}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch(searchQuery, 1)}
          disabled={!searchQuery.trim() || isSearching}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.id || item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={searchResults.length === 0 ? styles.emptyContainer : null}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  searchIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  promptText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  searchingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tryAgainText: {
    fontSize: 14,
    color: '#666',
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultContent: {
    flex: 1,
    marginRight: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultSource: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  resultDate: {
    fontSize: 12,
    color: '#999',
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  historyContainer: {
    flex: 1,
    padding: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
  },
  historyIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchScreen;