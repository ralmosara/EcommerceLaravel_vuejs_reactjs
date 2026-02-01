import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu, X, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/api/useCart';
import { UserRole } from '@/api/types';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import clsx from 'clsx';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { data: cart } = useCart();
  const cartItemsCount = cart?.items_count ?? 0;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-punk-black border-b border-punk-gray sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2">
              {/* Vinyl icon */}
              <div className="w-8 h-8 rounded-full bg-punk-orange flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-punk-black"></div>
              </div>
              <span className="text-2xl font-display font-bold tracking-tight text-white">
                VINYL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/albums"
              className="text-sm font-medium text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide"
            >
              Shop
            </Link>
            <Link
              to="/albums?is_featured=true"
              className="text-sm font-medium text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide"
            >
              Featured
            </Link>
            <Link
              to="/albums?on_sale=true"
              className="text-sm font-medium text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide"
            >
              Deals
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide"
            >
              About
            </Link>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchAutocomplete className="w-full" />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-punk-orange transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="p-2 text-gray-400 hover:text-punk-orange transition-colors"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-gray-400 hover:text-punk-orange transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-punk-orange text-white text-xs font-bold rounded-full">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-punk-orange transition-colors">
                  <User className="h-5 w-5" />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-punk-gray rounded-lg shadow-xl border border-punk-gray opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-punk-black hover:text-punk-orange transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-punk-black hover:text-punk-orange transition-colors"
                  >
                    My Orders
                  </Link>
                  {user?.role === UserRole.ADMIN && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-punk-black hover:text-punk-orange transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-punk-black hover:text-punk-orange transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold bg-punk-orange text-white hover:bg-punk-coral transition-colors uppercase tracking-wide"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-punk-orange transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-4 bg-punk-black">
          <SearchAutocomplete className="w-full" />
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={clsx(
          'md:hidden bg-punk-black border-t border-punk-gray transition-all duration-300 overflow-hidden',
          mobileMenuOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <nav className="px-4 py-4 space-y-2">
          <Link
            to="/albums"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide font-medium"
          >
            Shop
          </Link>
          <Link
            to="/albums?is_featured=true"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide font-medium"
          >
            Featured
          </Link>
          <Link
            to="/albums?on_sale=true"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide font-medium"
          >
            Deals
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-300 hover:text-punk-orange transition-colors uppercase tracking-wide font-medium"
          >
            About
          </Link>
          {!isAuthenticated && (
            <>
              <div className="pt-4 border-t border-punk-gray space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-punk-orange transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 bg-punk-orange text-white text-center font-bold uppercase tracking-wide"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
