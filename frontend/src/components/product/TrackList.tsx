import React, { useState } from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import type { Track } from '@/api/types';
import { formatDuration } from '@/utils/formatters';
import clsx from 'clsx';

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  const [expandedTracks, setExpandedTracks] = useState<Set<number>>(new Set());

  const toggleLyrics = (trackId: number) => {
    const newExpanded = new Set(expandedTracks);
    if (newExpanded.has(trackId)) {
      newExpanded.delete(trackId);
    } else {
      newExpanded.add(trackId);
    }
    setExpandedTracks(newExpanded);
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No tracks available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track) => {
        const isExpanded = expandedTracks.has(track.id);
        const hasLyrics = track.lyrics && track.lyrics.trim().length > 0;

        return (
          <div
            key={track.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all"
          >
            <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              {/* Play Button Icon */}
              <button
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                aria-label={`Play ${track.title}`}
              >
                <Play className="h-5 w-5 ml-0.5" />
              </button>

              {/* Track Number */}
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {track.track_number}
                </span>
              </div>

              {/* Track Title */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                  {track.title}
                </h4>
              </div>

              {/* Duration */}
              <div className="flex-shrink-0">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {track.duration ? formatDuration(track.duration) : '-'}
                </span>
              </div>

              {/* Lyrics Toggle */}
              {hasLyrics && (
                <button
                  onClick={() => toggleLyrics(track.id)}
                  className="flex-shrink-0 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={isExpanded ? 'Hide lyrics' : 'Show lyrics'}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>

            {/* Lyrics Section */}
            {hasLyrics && isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Lyrics
                  </h5>
                  <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans">
                    {track.lyrics}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
