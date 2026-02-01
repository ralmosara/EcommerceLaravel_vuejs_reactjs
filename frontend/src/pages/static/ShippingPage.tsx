import React from 'react';
import { Truck, Clock, Globe, Package } from 'lucide-react';

export function ShippingPage() {
  return (
    <div className="min-h-screen bg-punk-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
          Shipping Information
        </h1>
        <div className="w-20 h-1 bg-punk-orange mb-8" />

        {/* Shipping Methods */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
            Shipping Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-punk-gray border border-punk-black p-6">
              <Truck className="h-8 w-8 text-punk-orange mb-4" />
              <h3 className="font-semibold text-white mb-2">Standard Shipping</h3>
              <p className="text-gray-400 text-sm mb-2">5-7 business days</p>
              <p className="text-lg font-bold text-punk-orange">$5.99</p>
              <p className="text-sm text-gray-500">Free on orders over $50</p>
            </div>

            <div className="bg-punk-gray border border-punk-black p-6">
              <Clock className="h-8 w-8 text-punk-orange mb-4" />
              <h3 className="font-semibold text-white mb-2">Express Shipping</h3>
              <p className="text-gray-400 text-sm mb-2">2-3 business days</p>
              <p className="text-lg font-bold text-punk-orange">$12.99</p>
              <p className="text-sm text-gray-500">Priority handling</p>
            </div>

            <div className="bg-punk-gray border border-punk-black p-6">
              <Package className="h-8 w-8 text-punk-orange mb-4" />
              <h3 className="font-semibold text-white mb-2">Overnight Shipping</h3>
              <p className="text-gray-400 text-sm mb-2">Next business day</p>
              <p className="text-lg font-bold text-punk-orange">$24.99</p>
              <p className="text-sm text-gray-500">Order by 2 PM EST</p>
            </div>
          </div>
        </section>

        {/* International Shipping */}
        <section className="mb-12">
          <div className="bg-punk-gray border border-punk-black p-6">
            <div className="flex items-start gap-4">
              <Globe className="h-8 w-8 text-punk-orange flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">
                  International Shipping
                </h2>
                <p className="text-gray-400 mb-4">
                  We ship to over 50 countries worldwide. International shipping rates and delivery
                  times vary by destination and are calculated at checkout based on your location
                  and order weight.
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>Canada & Mexico: 7-14 business days</li>
                  <li>Europe: 10-21 business days</li>
                  <li>Asia Pacific: 14-28 business days</li>
                  <li>Rest of World: 21-35 business days</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Packaging Info */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
            Packaging & Handling
          </h2>
          <div>
            <p className="text-gray-400 mb-4">
              We take great care in packaging your orders to ensure they arrive in perfect condition:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>
                <strong className="text-white">Vinyl Records:</strong> Shipped in specialized record mailers with
                cardboard stiffeners to prevent warping and corner damage.
              </li>
              <li>
                <strong className="text-white">CDs & Cassettes:</strong> Protected with bubble wrap or foam padding
                in appropriately sized boxes.
              </li>
              <li>
                <strong className="text-white">Multiple Items:</strong> Larger orders are carefully packed together
                with proper padding between items.
              </li>
            </ul>
          </div>
        </section>

        {/* Order Tracking */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
            Order Tracking
          </h2>
          <p className="text-gray-400 mb-4">
            Once your order ships, you'll receive an email with tracking information. You can
            also track your order by:
          </p>
          <ol className="list-decimal list-inside text-gray-400 space-y-2">
            <li>Logging into your account</li>
            <li>Navigating to "My Orders"</li>
            <li>Clicking on the order you want to track</li>
            <li>Using the tracking number with the carrier's website</li>
          </ol>
        </section>

        {/* Important Notes */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
            Important Notes
          </h2>
          <div className="bg-punk-orange/10 border border-punk-orange p-6">
            <ul className="text-punk-orange space-y-2">
              <li>Delivery times are estimates and do not include processing time (1-2 business days).</li>
              <li>We are not responsible for delays caused by carriers, customs, or weather conditions.</li>
              <li>P.O. boxes may only receive Standard Shipping.</li>
              <li>Signature may be required for high-value orders.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
