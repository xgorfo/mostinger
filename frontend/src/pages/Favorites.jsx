import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

export default function Favorites() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/me/favorites');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load favorites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        toast.success('Post liked');
      }
      
      fetchFavorites();
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleFavorite = async (postId) => {
    try {
      await api.delete(`/posts/${postId}/favorite`);
      toast.success('Removed from favorites');
      fetchFavorites();
    } catch (err) {
      toast.error('Failed to remove favorite');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 mb-4 font-western">
          SAVED STORIES
        </h1>
        <p className="text-amber-700 dark:text-amber-300 mb-6">
          Your collection of tales from the frontier
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-amber-300 dark:border-amber-700">
          <p className="text-amber-700 dark:text-amber-300 text-lg">
            No saved stories yet. Start exploring the saloon!
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}