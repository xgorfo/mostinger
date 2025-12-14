import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Sun, Moon, LogOut, User, Home, PenSquare, BookMarked, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Rode off into the sunset');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <nav className="bg-gradient-to-r from-amber-900 to-orange-800 dark:from-gray-900 dark:to-gray-800 shadow-2xl border-b-4 border-amber-700 dark:border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-amber-100 dark:text-amber-200 tracking-wider font-western">
                  MOSTINGER
                </span>
                <span className="text-amber-300 text-sm hidden sm:inline">RDR2 Community</span>
              </Link>
              
              {isAuthenticated && (
                <div className="hidden md:flex space-x-2">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 px-4 py-2 rounded text-amber-100 hover:bg-amber-800 dark:hover:bg-gray-700 transition-colors border border-amber-700"
                  >
                    <Home size={18} />
                    <span>Saloon</span>
                  </Link>
                  <Link
                    to="/create"
                    className="flex items-center space-x-2 px-4 py-2 rounded text-amber-100 hover:bg-amber-800 dark:hover:bg-gray-700 transition-colors border border-amber-700"
                  >
                    <PenSquare size={18} />
                    <span>Write Story</span>
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center space-x-2 px-4 py-2 rounded text-amber-100 hover:bg-amber-800 dark:hover:bg-gray-700 transition-colors border border-amber-700"
                  >
                    <BookMarked size={18} />
                    <span>Saved</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
  to="/users"
  className="flex items-center space-x-2 px-4 py-2 rounded text-amber-100 hover:bg-amber-800 dark:hover:bg-gray-700 transition-colors border border-amber-700"
>
  <Users size={18} />
  <span>Outlaws</span>
</Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-amber-100 hover:bg-amber-800 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 rounded text-amber-100 hover:bg-amber-800 dark:hover:bg-gray-700 transition-colors border border-amber-700"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline">{user?.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded bg-red-800 text-amber-100 hover:bg-red-900 transition-colors border border-red-900"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Leave</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 text-amber-100 hover:bg-amber-800 dark:hover:bg-gray-700 rounded border border-amber-700 transition-colors"
                  >
                    Join
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-orange-700 text-amber-50 rounded hover:bg-orange-800 border-2 border-orange-900 transition-colors shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-r from-amber-900 to-orange-800 dark:from-gray-900 dark:to-gray-800 border-t-4 border-amber-700 dark:border-amber-600 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-amber-100">
          <p className="font-western">Est. 2025 | Mostinger Outlaw Community</p>
        </div>
      </footer>
    </div>
  );
}