import React from 'react';
import { ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import type { Review, PaginatedResponse } from '@/api/types';
import { formatRelativeTime } from '@/utils/formatters';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/common/Button';
import clsx from 'clsx';

interface ReviewListProps {
  reviews: Review[];
  pagination?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  onPageChange?: (page: number) => void;
}

export function ReviewList({ reviews, pagination, onPageChange }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No reviews yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Be the first to review this album!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {review.user.name}
                    </h4>
                    {review.is_verified_purchase && (
                      <div
                        className="flex items-center gap-1 text-green-600 dark:text-green-400"
                        title="Verified Purchase"
                      >
                        <BadgeCheck className="h-4 w-4" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <RatingStars value={review.rating} size="sm" readonly />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(review.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Title */}
            {review.title && (
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {review.title}
              </h5>
            )}

            {/* Review Body */}
            {review.body && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.body}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing{' '}
            <span className="font-medium">
              {((pagination.current_page - 1) * pagination.per_page) + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
            </span>{' '}
            of <span className="font-medium">{pagination.total}</span> reviews
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => onPageChange?.(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {generatePageNumbers(pagination.current_page, pagination.last_page).map(
                (page, index) =>
                  page === '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-2 text-gray-500 dark:text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => onPageChange?.(Number(page))}
                      className={clsx(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        pagination.current_page === page
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      {page}
                    </button>
                  )
              )}
            </div>

            <Button
              onClick={() => onPageChange?.(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(currentPage: number, lastPage: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const delta = 2; // Number of pages to show on each side of current page

  for (let i = 1; i <= lastPage; i++) {
    if (
      i === 1 ||
      i === lastPage ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return pages;
}
