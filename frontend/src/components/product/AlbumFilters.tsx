import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { Genre } from '@/api/types';
import { AlbumFormat } from '@/api/types';
import { Button } from '@/components/common/Button';

export interface FilterState {
  formats: AlbumFormat[];
  genres: string[];
  priceRange: [number, number];
  sortBy: 'price' | 'release_year' | 'rating' | 'title';
  sortOrder: 'asc' | 'desc';
}

interface AlbumFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  genres: Genre[];
}

export function AlbumFilters({ filters, onFilterChange, genres }: AlbumFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormatToggle = (format: AlbumFormat) => {
    const newFormats = filters.formats.includes(format)
      ? filters.formats.filter((f) => f !== format)
      : [...filters.formats, format];

    onFilterChange({ ...filters, formats: newFormats });
  };

  const handleGenreToggle = (genreUuid: string) => {
    const newGenres = filters.genres.includes(genreUuid)
      ? filters.genres.filter((g) => g !== genreUuid)
      : [...filters.genres, genreUuid];

    onFilterChange({ ...filters, genres: newGenres });
  };

  const handlePriceRangeChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const handleClearFilters = () => {
    onFilterChange({
      formats: [],
      genres: [],
      priceRange: [0, 100],
      sortBy: 'title',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters =
    filters.formats.length > 0 ||
    filters.genres.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <h3 className="font-bold text-white uppercase tracking-wider mb-3 text-sm">
          Sort By
        </h3>
        <div className="space-y-2">
          {[
            { value: 'title', label: 'Title (A-Z)' },
            { value: 'price', label: 'Price' },
            { value: 'release_year', label: 'Release Year' },
            { value: 'rating', label: 'Rating' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="sortBy"
                value={option.value}
                checked={filters.sortBy === option.value}
                onChange={() => handleSortChange(option.value as FilterState['sortBy'])}
                className="text-punk-orange focus:ring-punk-orange bg-punk-black border-punk-gray"
              />
              <span className="text-sm text-gray-400 group-hover:text-punk-orange transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Format Filter */}
      <div>
        <h3 className="font-bold text-white uppercase tracking-wider mb-3 text-sm">
          Format
        </h3>
        <div className="space-y-2">
          {Object.values(AlbumFormat).map((format) => (
            <label
              key={format}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.formats.includes(format)}
                onChange={() => handleFormatToggle(format)}
                className="rounded text-punk-orange focus:ring-punk-orange bg-punk-black border-punk-gray"
              />
              <span className="text-sm text-gray-400 group-hover:text-punk-orange transition-colors capitalize">
                {format}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Genre Filter */}
      {genres.length > 0 && (
        <div>
          <h3 className="font-bold text-white uppercase tracking-wider mb-3 text-sm">
            Genres
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {genres.map((genre) => (
              <label
                key={genre.uuid}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.genres.includes(genre.uuid)}
                  onChange={() => handleGenreToggle(genre.uuid)}
                  className="rounded text-punk-orange focus:ring-punk-orange bg-punk-black border-punk-gray"
                />
                <span className="text-sm text-gray-400 group-hover:text-punk-orange transition-colors">
                  {genre.name}
                  {genre.albums_count !== undefined && (
                    <span className="text-gray-600 ml-1">
                      ({genre.albums_count})
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-white uppercase tracking-wider mb-3 text-sm">
          Price Range
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Min: <span className="text-punk-orange font-bold">${filters.priceRange[0]}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
              className="w-full h-1 bg-punk-black rounded-lg appearance-none cursor-pointer accent-punk-orange"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Max: <span className="text-punk-orange font-bold">${filters.priceRange[1]}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
              className="w-full h-1 bg-punk-black rounded-lg appearance-none cursor-pointer accent-punk-orange"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          onClick={handleClearFilters}
          variant="outline"
          size="sm"
          fullWidth
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          fullWidth
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-punk-orange text-white text-xs">
              Active
            </span>
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-punk-gray p-6 sticky top-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Filters
            </h2>
            {hasActiveFilters && (
              <span className="px-2 py-1 bg-punk-orange text-white text-xs font-bold">
                Active
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-punk-gray shadow-xl">
                      <div className="flex items-center justify-between px-6 py-6 border-b border-punk-black">
                        <Dialog.Title className="text-xl font-bold text-white uppercase tracking-wider">
                          Filters
                        </Dialog.Title>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-gray-400 hover:text-punk-orange transition-colors"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="p-6">
                        <FilterContent />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
