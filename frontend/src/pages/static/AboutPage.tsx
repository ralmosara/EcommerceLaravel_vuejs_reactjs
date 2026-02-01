import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Users, Award, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-punk-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
          About Punk Records
        </h1>
        <div className="w-20 h-1 bg-punk-orange mb-8" />

        <div>
          <p className="text-lg text-gray-300 mb-8">
            Welcome to Punk Records, your premier destination for vinyl records, CDs, cassettes,
            and digital music. We're passionate about connecting music lovers with the albums
            they love in their preferred format.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="bg-punk-gray border border-punk-black p-6">
              <Music className="h-8 w-8 text-punk-orange mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Wide Selection
              </h3>
              <p className="text-gray-400">
                Browse thousands of albums across all genres, from classic rock to modern indie,
                jazz to electronic.
              </p>
            </div>

            <div className="bg-punk-gray border border-punk-black p-6">
              <Award className="h-8 w-8 text-punk-orange mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-gray-400">
                Every item is carefully inspected before shipping. We stand behind the quality
                of our products.
              </p>
            </div>

            <div className="bg-punk-gray border border-punk-black p-6">
              <Users className="h-8 w-8 text-punk-orange mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Community Driven
              </h3>
              <p className="text-gray-400">
                Join our community of music enthusiasts. Read reviews from fellow collectors
                and share your thoughts.
              </p>
            </div>

            <div className="bg-punk-gray border border-punk-black p-6">
              <Heart className="h-8 w-8 text-punk-orange mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Passion for Music
              </h3>
              <p className="text-gray-400">
                We're music lovers first. Our team curates collections and helps you discover
                new favorites.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
            Our Story
          </h2>
          <p className="text-gray-400 mb-4">
            Punk Records was founded with a simple mission: to make it easy for everyone to enjoy
            music in their preferred format. Whether you're a vinyl collector, a casual listener,
            or somewhere in between, we've got something for you.
          </p>
          <p className="text-gray-400 mb-8">
            We believe that physical media offers a listening experience that can't be replicated
            by streaming alone. There's something special about holding an album in your hands,
            reading the liner notes, and experiencing music the way the artist intended.
          </p>

          <div className="bg-punk-orange/10 border border-punk-orange p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Ready to start exploring?
            </h3>
            <p className="text-gray-300 mb-4">
              Browse our collection and find your next favorite album.
            </p>
            <Link
              to="/albums"
              className="inline-flex items-center px-6 py-3 bg-punk-orange text-white font-bold uppercase tracking-wider hover:bg-punk-coral transition-colors"
            >
              Browse Albums
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
