import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, type ReviewFormData } from '@/utils/validators';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { RatingStars } from './RatingStars';
import { useCreateReview, useUpdateReview } from '@/hooks/api/useReviews';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  albumSlug: string;
  onSuccess?: () => void;
}

export function ReviewForm({ albumSlug, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      body: '',
    },
  });

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setValue('rating', newRating, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);

      await createReview.mutateAsync({
        albumSlug,
        data: {
          rating: data.rating,
          title: data.title,
          body: data.body,
        },
      });

      toast.success('Review submitted successfully!');

      // Reset form
      reset();
      setRating(0);

      // Call success callback
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to submit review';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rating Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <RatingStars
              value={rating}
              onChange={handleRatingChange}
              size="lg"
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.rating.message}
            </p>
          )}
        </div>

        {/* Title Input */}
        <div>
          <label
            htmlFor="review-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Review Title (Optional)
          </label>
          <input
            id="review-title"
            type="text"
            {...register('title')}
            placeholder="Summarize your review in a few words"
            className="block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors border-gray-300 dark:border-gray-600"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Review Body */}
        <div>
          <label
            htmlFor="review-body"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Your Review (Optional)
          </label>
          <textarea
            id="review-body"
            {...register('body')}
            rows={5}
            placeholder="Share your thoughts about this album..."
            className="block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors border-gray-300 dark:border-gray-600 resize-none"
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.body.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Minimum 10 characters, maximum 2000 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              reset();
              setRating(0);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
