import { Link } from 'react-router-dom';
import { Heart, MessageCircle, BookMarked } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatDate';
import clsx from 'clsx';

export default function PostCard({ post, onLike, onFavorite }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all border-2 border-amber-300 dark:border-amber-700 hover:border-amber-500 dark:hover:border-amber-500">
      <Link to={`/post/${post.id}`}>
        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2 hover:text-orange-700 dark:hover:text-orange-400 font-western">
          {post.title}
        </h2>
      </Link>
      
      <div className="flex items-center space-x-4 text-sm text-amber-700 dark:text-amber-300 mb-3 font-western">
        <Link to={`/user/${post.user_id}`} className="hover:text-orange-600 dark:hover:text-orange-400">
          {post.author_username}
        </Link>
        <span>•</span>
        <span>{formatRelativeTime(post.created_at)}</span>
      </div>

      <p className="text-gray-800 dark:text-gray-200 mb-4 line-clamp-3">
        {post.excerpt || post.content}
      </p>

      <div className="flex items-center justify-between pt-4 border-t-2 border-amber-200 dark:border-amber-800">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onLike?.(post.id)}
            className={clsx(
              'flex items-center space-x-2 transition-all hover:scale-110',
              post.is_liked
                ? 'text-red-700 dark:text-red-500'
                : 'text-amber-700 dark:text-amber-400 hover:text-red-600 dark:hover:text-red-400'
            )}
          >
            <Heart size={20} fill={post.is_liked ? 'currentColor' : 'none'} strokeWidth={2.5} />
            <span className="font-bold">{post.likes_count}</span>
          </button>

          <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400">
            <MessageCircle size={20} strokeWidth={2.5} />
            <span className="font-bold">{post.comments_count}</span>
          </div>
        </div>

        <button
          onClick={() => onFavorite?.(post.id)}
          className={clsx(
            'transition-all hover:scale-110',
            post.is_favorited
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-amber-700 dark:text-amber-400 hover:text-yellow-600 dark:hover:text-yellow-400'
          )}
        >
          <BookMarked size={20} fill={post.is_favorited ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}