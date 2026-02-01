import React from 'react';
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ReturnsPage() {
  return (
    <div className="min-h-screen bg-punk-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
          Returns & Refunds
        </h1>
        <div className="w-20 h-1 bg-punk-orange mb-8" />

        {/* Policy Overview */}
        <section className="mb-12">
          <div className="bg-punk-orange/10 border border-punk-orange p-6 flex items-start gap-4">
            <RotateCcw className="h-8 w-8 text-punk-orange flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">
                30-Day Return Policy
              </h2>
              <p className="text-gray-300">
                We want you to be completely satisfied with your purchase. If you're not happy
                with your order, you can return eligible items within 30 days of delivery for
                a full refund.
              </p>
            </div>
          </div>
        </section>

        {/* Eligible Items */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
            What Can Be Returned
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900/20 border border-green-600 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="font-semibold text-white">Eligible for Return</h3>
              </div>
              <ul className="text-gray-400 space-y-2">
                <li>Sealed vinyl records</li>
                <li>Sealed CDs and cassettes</li>
                <li>Defective or damaged items</li>
                <li>Wrong item received</li>
                <li>Items in original packaging</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-600 p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-6 w-6 text-red-500" />
                <h3 className="font-semibold text-white">Not Eligible</h3>
              </div>
              <ul className="text-gray-400 space-y-2">
                <li>Opened/unsealed items (unless defective)</li>
                <li>Digital downloads</li>
                <li>Items returned after 30 days</li>
                <li>Items without original packaging</li>
                <li>Items damaged by customer</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Return */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
            How to Return an Item
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-punk-orange text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Initiate Return</h3>
                <p className="text-gray-400">
                  Log into your account, go to "My Orders," find the order, and click "Request Return."
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-punk-orange text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white">Select Reason</h3>
                <p className="text-gray-400">
                  Choose the reason for your return and provide any additional details.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-punk-orange text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white">Print Label</h3>
                <p className="text-gray-400">
                  Print the prepaid return shipping label (for defective/wrong items) or use your own shipping.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-punk-orange text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-white">Ship Item</h3>
                <p className="text-gray-400">
                  Pack the item securely in original packaging and ship it within 7 days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-punk-orange text-white flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-white">Receive Refund</h3>
                <p className="text-gray-400">
                  Once we receive and inspect your return, your refund will be processed within 5-7 business days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Refund Information */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
            Refund Information
          </h2>
          <div className="bg-punk-gray border border-punk-black p-6">
            <ul className="text-gray-400 space-y-3">
              <li>
                <strong className="text-white">Refund Method:</strong>{' '}
                Refunds are issued to the original payment method.
              </li>
              <li>
                <strong className="text-white">Processing Time:</strong>{' '}
                5-7 business days after we receive your return.
              </li>
              <li>
                <strong className="text-white">Shipping Costs:</strong>{' '}
                Original shipping costs are non-refundable unless the return is due to our error.
              </li>
              <li>
                <strong className="text-white">Partial Refunds:</strong>{' '}
                Items returned in non-original condition may receive a partial refund.
              </li>
            </ul>
          </div>
        </section>

        {/* Defective Items */}
        <section>
          <div className="bg-punk-orange/10 border border-punk-orange p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-punk-orange flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-2">
                  Defective or Damaged Items
                </h3>
                <p className="text-gray-400 mb-4">
                  If you receive a defective or damaged item, please contact us within 48 hours
                  of delivery. We'll provide a prepaid return label and either replace the item
                  or issue a full refund including shipping costs.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-punk-orange hover:text-punk-coral transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
