import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        skip: (currentPage - 1) * 20,
        limit: 20,
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get('/posts/', { params });
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        // If response is directly an array
        setPosts(response.data);
        setTotalPages(1);
      } else if (response.data.items) {
        // If response has items property
        setPosts(response.data.items || []);
        setTotalPages(response.data.pages || 1);
      } else {
        // Unknown format
        console.error('Unexpected API response format:', response.data);
        setPosts([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError('Failed to load posts');
      console.error('Fetch error:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      
      if (post.is_liked) {
        await api.delete(`/posts/${postId}/like`);
        toast.success('Post unliked');
      } else {
        await api.post(`/posts/${postId}/like`);
        toast.success('Post liked!');
      }
      
      fetchPosts();
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleFavorite = async (postId) => {
    if (!isAuthenticated) {
      toast.error('Please login to favorite posts');
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      
      if (post.is_favorited) {
        await api.delete(`/posts/${postId}/favorite`);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/posts/${postId}/favorite`);
        toast.success('Added to favorites!');
      }
      
      fetchPosts();
    } catch (err) {
      toast.error('Failed to update favorite');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          📚 Blog Posts
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Discover amazing content from our community
        </p>
        
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search posts by title or content..."
        />
      </div>

      {error && <ErrorMessage message={error} />}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No posts found. Be the first to create one!
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onFavorite={handleFavorite}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}