import { useState } from 'react';
import { Share2, Link2, Check, Twitter, Facebook, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
  url?: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:text-sky-500',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-blue-600',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:text-green-500',
    },
  ];

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Share:</span>

      {/* Native Share (on supported devices) */}
      {hasNativeShare && (
        <button
          onClick={handleNativeShare}
          className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
      )}

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Copy link"
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <Link2 className="h-5 w-5" />
        )}
      </button>

      {/* Social Share Links */}
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 text-gray-500 dark:text-gray-400 ${link.color} transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800`}
          title={`Share on ${link.name}`}
        >
          <link.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
