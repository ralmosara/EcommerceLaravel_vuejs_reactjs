import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-punk-black border-t border-punk-gray">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-punk-orange flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-punk-black"></div>
              </div>
              <span className="text-2xl font-display font-bold text-white">
                VINYL
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Your destination for rare vinyl, limited editions, and punk rock essentials.
              Curated for collectors, by collectors.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 bg-punk-gray text-gray-400 hover:bg-punk-orange hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-punk-gray text-gray-400 hover:bg-punk-orange hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-punk-gray text-gray-400 hover:bg-punk-orange hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-punk-gray text-gray-400 hover:bg-punk-orange hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/albums"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  All Albums
                </Link>
              </li>
              <li>
                <Link
                  to="/albums?is_featured=true"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link
                  to="/albums?on_sale=true"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  On Sale
                </Link>
              </li>
              <li>
                <Link
                  to="/albums?format=vinyl"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Vinyl Only
                </Link>
              </li>
              <li>
                <Link
                  to="/albums?sort_by=created_at&sort_order=desc"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Column */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">
              Info
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-punk-orange transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-punk-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} VINYL. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {/* Payment Icons Placeholder */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 bg-punk-gray rounded flex items-center justify-center">
                  <span className="text-[8px] text-gray-400 font-bold">VISA</span>
                </div>
                <div className="w-10 h-6 bg-punk-gray rounded flex items-center justify-center">
                  <span className="text-[8px] text-gray-400 font-bold">MC</span>
                </div>
                <div className="w-10 h-6 bg-punk-gray rounded flex items-center justify-center">
                  <span className="text-[8px] text-gray-400 font-bold">AMEX</span>
                </div>
                <div className="w-10 h-6 bg-punk-gray rounded flex items-center justify-center">
                  <span className="text-[8px] text-gray-400 font-bold">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
