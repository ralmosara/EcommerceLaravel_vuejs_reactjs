import React from 'react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-punk-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
          Terms of Service
        </h1>
        <div className="w-20 h-1 bg-punk-orange mb-8" />

        <div>
          <p className="text-gray-500 mb-6">
            Last updated: January 2025
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-400">
              By accessing or using Punk Records' website and services, you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use our
              services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              2. Use of Services
            </h2>
            <p className="text-gray-400 mb-4">
              You may use our services only for lawful purposes and in accordance with these Terms.
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Use the service in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Transmit any harmful code, viruses, or malware</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              3. Accounts
            </h2>
            <p className="text-gray-400 mb-4">
              When you create an account with us, you must provide accurate and complete information.
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              4. Products and Purchases
            </h2>
            <p className="text-gray-400 mb-4">
              All purchases through our site are subject to product availability. We reserve the
              right to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Limit quantities of products available for purchase</li>
              <li>Refuse or cancel orders at our discretion</li>
              <li>Correct pricing errors at any time</li>
              <li>Discontinue any product without notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              5. Pricing and Payment
            </h2>
            <p className="text-gray-400">
              All prices are displayed in USD unless otherwise noted. We reserve the right to
              change prices at any time. Payment must be received before order processing.
              You agree to provide current, complete, and accurate payment information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              6. Shipping and Delivery
            </h2>
            <p className="text-gray-400">
              Shipping times are estimates only and are not guaranteed. We are not responsible
              for delays caused by carriers, customs, weather, or other factors outside our
              control. Risk of loss passes to you upon delivery to the carrier.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              7. Returns and Refunds
            </h2>
            <p className="text-gray-400">
              Our return and refund policy is detailed on our Returns page. By making a purchase,
              you agree to the terms of our return policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              8. Intellectual Property
            </h2>
            <p className="text-gray-400">
              All content on this website, including text, graphics, logos, images, and software,
              is the property of Punk Records or its content suppliers and is protected by
              intellectual property laws. You may not reproduce, distribute, or create derivative
              works without explicit permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-400">
              To the fullest extent permitted by law, Punk Records shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from
              your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-400">
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the service after changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-400">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@punkrecords.com" className="text-punk-orange hover:text-punk-coral transition-colors">
                legal@punkrecords.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
