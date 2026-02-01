import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Music, User, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchSuggestions } from '@/hooks/api/useSearch';

interface SearchAutocompleteProps {
  className?: string;
  placeholder?: string;
}

export function SearchAutocomplete({
  className = '',
  placeholder = 'Search albums, artists...',
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions, isLoading } = useSearchSuggestions(debouncedQuery, isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: { type: string; slug: string }) => {
    if (suggestion.type === 'album') {
      navigate(`/albums/${suggestion.slug}`);
    } else if (suggestion.type === 'artist') {
      navigate(`/artists/${suggestion.slug}`);
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const showDropdown = isOpen && query.length >= 2;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-punk-gray bg-punk-gray text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange focus:ring-1 focus:ring-punk-orange transition-colors"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-punk-orange transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-punk-gray border border-punk-black shadow-xl max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-400">
              Searching...
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion) => (
                <li key={`${suggestion.type}-${suggestion.id}`}>
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-punk-black transition-colors group"
                  >
                    {suggestion.type === 'album' ? (
                      <Music className="h-4 w-4 text-gray-500 group-hover:text-punk-orange flex-shrink-0 transition-colors" />
                    ) : (
                      <User className="h-4 w-4 text-gray-500 group-hover:text-punk-orange flex-shrink-0 transition-colors" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-punk-orange truncate transition-colors">
                        {suggestion.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {suggestion.type}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
              {/* View all results link */}
              <li className="border-t border-punk-black">
                <button
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full px-4 py-3 text-sm text-punk-orange hover:bg-punk-black transition-colors text-left"
                >
                  View all results for "{query}"
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
