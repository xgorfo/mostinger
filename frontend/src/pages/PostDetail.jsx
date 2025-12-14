import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { formatDateTime } from '../utils/formatDate';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/posts/${id}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to load comments');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      if (post.is_liked) {
        await api.delete(`/posts/${id}/like`);
      } else {
        await api.post(`/posts/${id}/like`);
      }
      fetchPost();
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      await api.post(`/posts/${id}/comments`, { content: newComment });
      setNewComment('');
      fetchComments();
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="Post not found" />;

  const canEdit = user && (user.id === post.user_id || user.is_admin);

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
            <Link 
              to={`/user/${post.user_id}`}
              className="font-medium hover:text-primary-600 dark:hover:text-primary-400"
            >
              @{post.author_username}
            </Link>
            <span>•</span>
            <span>{formatDateTime(post.created_at)}</span>
          </div>

          {canEdit && (
            <div className="flex items-center space-x-2">
              <Link
                to={`/post/${id}/edit`}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              >
                <Edit size={20} />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <div className="flex items-center space-x-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLike}
            className={clsx(
              'flex items-center space-x-2 transition-colors',
              post.is_liked
                ? 'text-red-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
            )}
          >
            <Heart size={24} fill={post.is_liked ? 'currentColor' : 'none'} />
            <span className="font-medium">{post.likes_count}</span>
          </button>

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <MessageCircle size={24} />
            <span className="font-medium">{post.comments_count}</span>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Comments ({comments.length})
        </h2>

        {isAuthenticated && (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
            />
            <button
              type="submit"
              className="mt-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    @{comment.author_username}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(comment.created_at)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}