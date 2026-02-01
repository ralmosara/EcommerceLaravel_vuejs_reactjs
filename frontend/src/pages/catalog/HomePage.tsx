import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAlbums } from '@/hooks/api/useAlbums';
import { AlbumCard } from '@/components/product/AlbumCard';
import { useState, useRef } from 'react';
import type { Album } from '@/api/types';

// Hero Featured Album Component
function HeroSection({ album }: { album?: Album }) {
  return (
    <section className="relative bg-punk-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,107,53,0.1) 10px,
            rgba(255,107,53,0.1) 20px
          )`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Album Info */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <span className="inline-block px-4 py-1 bg-punk-orange text-white text-xs font-bold uppercase tracking-wider mb-4">
              Featured Release
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
              {album?.title || 'MODERN NOSTALGIA'}
            </h1>
            <p className="text-xl text-punk-orange font-medium mb-2">
              {album?.artist?.name || 'The Echoes'}
            </p>
            <p className="text-gray-400 mb-6 max-w-md mx-auto lg:mx-0">
              {album?.description || 'A groundbreaking fusion of classic punk energy with modern production, featuring explosive riffs and anthemic choruses.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to={album ? `/albums/${album.slug}` : '/albums'}
                className="btn-punk text-center"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <button className="btn-punk-outline flex items-center justify-center">
                <Play className="mr-2 h-4 w-4" />
                Preview
              </button>
            </div>
          </div>

          {/* Right Side - Album Cover */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Vinyl Record Behind */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 vinyl-record animate-spin-slow" />

              {/* Album Cover */}
              <div className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-punk-gray shadow-2xl">
                {album?.cover_image ? (
                  <img
                    src={album.cover_image}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-punk-gray to-punk-black">
                    <span className="text-6xl font-display font-bold text-punk-orange opacity-50">
                      VINYL
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// New Drops Section with Horizontal Scroll
function NewDropsSection({ albums, isLoading }: { albums?: Album[]; isLoading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-punk-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              NEW DROPS
            </h2>
            <div className="w-20 h-1 bg-punk-orange mt-2" />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll('left')}
              className="p-2 border border-gray-600 text-gray-400 hover:border-punk-orange hover:text-punk-orange transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 border border-gray-600 text-gray-400 hover:border-punk-orange hover:text-punk-orange transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              to="/albums?sort_by=created_at&sort_order=desc"
              className="hidden sm:flex items-center text-punk-orange hover:text-punk-coral transition-colors font-medium"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Albums Horizontal Scroll */}
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48 animate-pulse">
                <div className="aspect-square bg-punk-gray mb-4" />
                <div className="h-4 bg-punk-gray w-3/4 mb-2" />
                <div className="h-3 bg-punk-gray w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          >
            {albums?.map((album) => (
              <div key={album.uuid} className="flex-shrink-0 w-48 sm:w-56">
                <AlbumCard album={album} compact />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Vinyl Exclusives Section
function VinylExclusivesSection({ albums, isLoading }: { albums?: Album[]; isLoading: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const exclusiveAlbum = albums?.[activeIndex];

  return (
    <section className="bg-punk-black py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div>
            <span className="inline-block px-3 py-1 border border-punk-orange text-punk-orange text-xs font-bold uppercase tracking-wider mb-4">
              Limited Edition
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              VINYL<br />
              <span className="text-gradient-punk">EXCLUSIVES</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Discover our hand-picked collection of rare pressings, colored vinyl,
              and limited edition releases. Each piece is a unique addition to any
              collector's library.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-punk-orange mr-3" />
                Hand-numbered limited editions
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-punk-orange mr-3" />
                Exclusive colored vinyl variants
              </li>
              <li className="flex items-center text-gray-300">
                <span className="w-2 h-2 bg-punk-orange mr-3" />
                Premium packaging & inserts
              </li>
            </ul>
            <Link
              to="/albums?format=vinyl"
              className="btn-punk inline-flex"
            >
              Explore Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Right - Featured Albums Grid */}
          <div className="relative">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-punk-gray animate-pulse" />
                ))}
              </div>
            ) : albums && albums.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {albums.slice(0, 4).map((album, index) => (
                  <Link
                    key={album.uuid}
                    to={`/albums/${album.slug}`}
                    className={`group relative aspect-square overflow-hidden bg-punk-gray ${
                      index === activeIndex ? 'ring-2 ring-punk-orange' : ''
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {album.cover_image ? (
                      <img
                        src={album.cover_image}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-punk-orange opacity-50">
                          {album.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-bold truncate">{album.title}</p>
                        <p className="text-punk-orange text-sm">{album.artist?.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                No exclusive albums available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Newsletter Section - "Join the Chaos"
function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail('');
  };

  return (
    <section className="relative bg-punk-orange py-16 lg:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.2) 10px,
            rgba(0,0,0,0.2) 20px
          )`
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
          JOIN THE CHAOS
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
          Be the first to know about new releases, exclusive drops, and members-only deals.
          No spam, just pure vinyl goodness.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 bg-white/10 border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white transition-colors"
            required
          />
          <button
            type="submit"
            className="px-8 py-4 bg-punk-black text-white font-bold uppercase tracking-wider hover:bg-punk-gray transition-colors"
          >
            Subscribe
          </button>
        </form>
        <p className="text-white/60 text-sm mt-4">
          Join 50,000+ vinyl enthusiasts. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

// Featured Categories Section
function CategoriesSection() {
  const categories = [
    { name: 'Punk Rock', slug: 'punk', image: '/images/punk.jpg' },
    { name: 'Alternative', slug: 'alternative', image: '/images/alternative.jpg' },
    { name: 'Indie', slug: 'indie', image: '/images/indie.jpg' },
    { name: 'Metal', slug: 'metal', image: '/images/metal.jpg' },
  ];

  return (
    <section className="bg-punk-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
            SHOP BY GENRE
          </h2>
          <div className="w-20 h-1 bg-punk-orange mx-auto" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/genres/${category.slug}`}
              className="group relative aspect-square overflow-hidden bg-punk-gray"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white group-hover:text-punk-orange transition-colors uppercase">
                  {category.name}
                </span>
              </div>
              <div className="absolute inset-0 bg-punk-orange/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// On Sale Section
function OnSaleSection({ albums, isLoading }: { albums?: Album[]; isLoading: boolean }) {
  return (
    <section className="bg-punk-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              HOT DEALS
            </h2>
            <div className="w-20 h-1 bg-punk-orange mt-2" />
          </div>
          <Link
            to="/albums?on_sale=true"
            className="flex items-center text-punk-orange hover:text-punk-coral transition-colors font-medium"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Albums Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-punk-gray mb-4" />
                <div className="h-4 bg-punk-gray w-3/4 mb-2" />
                <div className="h-3 bg-punk-gray w-1/2" />
              </div>
            ))}
          </div>
        ) : albums && albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {albums.slice(0, 4).map((album) => (
              <AlbumCard key={album.uuid} album={album} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            No albums on sale at the moment. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
}

// Main HomePage Component
export function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useAlbums({
    is_featured: true,
    per_page: 8,
  });

  const { data: onSale, isLoading: onSaleLoading } = useAlbums({
    on_sale: true,
    per_page: 8,
  });

  const { data: newReleases, isLoading: newReleasesLoading } = useAlbums({
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 10,
  });

  const { data: vinylExclusives, isLoading: exclusivesLoading } = useAlbums({
    format: 'vinyl',
    is_featured: true,
    per_page: 4,
  });

  // Get the first featured album for the hero
  const heroAlbum = featured?.data?.[0];

  return (
    <div className="min-h-screen bg-punk-dark">
      {/* Hero Section */}
      <HeroSection album={heroAlbum} />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* New Drops */}
      <NewDropsSection albums={newReleases?.data} isLoading={newReleasesLoading} />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Vinyl Exclusives */}
      <VinylExclusivesSection albums={vinylExclusives?.data || featured?.data} isLoading={exclusivesLoading || featuredLoading} />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Shop by Genre */}
      <CategoriesSection />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* On Sale */}
      <OnSaleSection albums={onSale?.data} isLoading={onSaleLoading} />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
