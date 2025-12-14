import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { User, Search } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/users/', {
        params: { search: searchQuery }
      });
      
      setUsers(response.data);
      setSearched(true);
    } catch (err) {
      setError('Failed to search users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 mb-4 font-western">
          FIND OUTLAWS
        </h1>
        <p className="text-amber-700 dark:text-amber-300 mb-6">
          Search for fellow gunslingers in the frontier
        </p>

        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or email..."
              className="w-full px-4 py-3 pl-12 border-2 border-amber-300 dark:border-amber-700 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-orange-700 text-amber-50 rounded-lg hover:bg-orange-800 border-2 border-orange-900 transition-colors shadow-lg disabled:opacity-50 font-western"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading && <Loading />}

      {!loading && searched && users.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-amber-300 dark:border-amber-700">
          <p className="text-amber-700 dark:text-amber-300 text-lg">
            No outlaws found matching your search.
          </p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => (
            <Link
              key={user.id}
              to={`/user/${user.id}`}
              className="block bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 hover:shadow-xl transition-all border-2 border-amber-300 dark:border-amber-700 hover:border-amber-500 dark:hover:border-amber-500"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-amber-700 dark:bg-amber-600 rounded-full flex items-center justify-center">
                  <User size={32} className="text-amber-100" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 font-western">
                    {user.username}
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300">
                    {user.email}
                  </p>
                  {user.bio && (
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-amber-300 dark:border-amber-700">
          <User size={48} className="mx-auto mb-4 text-amber-700 dark:text-amber-400" />
          <p className="text-amber-700 dark:text-amber-300 text-lg">
            Start searching to find fellow outlaws
          </p>
        </div>
      )}
    </div>
  );
}