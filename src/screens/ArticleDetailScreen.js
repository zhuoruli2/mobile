import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../store/slices/bookmarksSlice';
import moment from 'moment';

const ArticleDetailScreen = ({ route, navigation }) => {
  const { article } = route.params;
  const dispatch = useDispatch();
  const [showWebView, setShowWebView] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(true);
  
  const bookmarkedIds = useSelector((state) => state.bookmarks.bookmarkedIds);
  const isBookmarked = bookmarkedIds.includes(article.id || article._id);

  const handleBookmark = useCallback(async () => {
    try {
      if (isBookmarked) {
        await dispatch(removeBookmark(article.id || article._id)).unwrap();
      } else {
        await dispatch(addBookmark(article.id || article._id)).unwrap();
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }, [dispatch, isBookmarked, article]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        title: article.title,
        message: `Check out this article: ${article.title}\n\n${article.url}`,
        url: article.url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [article]);

  const handleOpenInBrowser = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(article.url);
      if (supported) {
        await Linking.openURL(article.url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  }, [article.url]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleBookmark} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>
              {isBookmarked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⎘</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleBookmark, handleShare, isBookmarked]);

  if (showWebView) {
    return (
      <View style={styles.container}>
        <View style={styles.webViewHeader}>
          <TouchableOpacity
            onPress={() => setShowWebView(false)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back to Article</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOpenInBrowser}
            style={styles.openButton}
          >
            <Text style={styles.openButtonText}>Open in Browser</Text>
          </TouchableOpacity>
        </View>
        {webViewLoading && (
          <View style={styles.webViewLoader}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
        <WebView
          source={{ uri: article.url }}
          style={styles.webView}
          onLoadEnd={() => setWebViewLoading(false)}
          startInLoadingState={true}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {article.imageUrl && (
        <Image source={{ uri: article.imageUrl }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        
        <View style={styles.meta}>
          <Text style={styles.source}>{article.source}</Text>
          <Text style={styles.date}>
            {moment(article.publishedAt).format('MMMM DD, YYYY')}
          </Text>
        </View>

        {article.author && (
          <Text style={styles.author}>By {article.author}</Text>
        )}

        <Text style={styles.description}>
          {article.description || article.summary}
        </Text>

        {article.content && (
          <Text style={styles.articleContent}>{article.content}</Text>
        )}

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => setShowWebView(true)}
        >
          <Text style={styles.readMoreButtonText}>Read Full Article</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, isBookmarked && styles.bookmarkedButton]}
            onPress={handleBookmark}
          >
            <Text style={[styles.actionButtonText, isBookmarked && styles.bookmarkedText]}>
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {article.tags && article.tags.length > 0 && (
          <View style={styles.tags}>
            <Text style={styles.tagsTitle}>Tags:</Text>
            <View style={styles.tagsList}>
              {article.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 32,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  source: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  author: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 20,
  },
  articleContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
    marginBottom: 24,
  },
  readMoreButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  readMoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  bookmarkedButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bookmarkedText: {
    color: 'white',
  },
  tags: {
    marginTop: 20,
  },
  tagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginHorizontal: 8,
    padding: 8,
  },
  headerButtonText: {
    fontSize: 20,
    color: '#007AFF',
  },
  webView: {
    flex: 1,
  },
  webViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  openButton: {
    padding: 8,
  },
  openButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  webViewLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    zIndex: 1,
  },
});

export default ArticleDetailScreen;