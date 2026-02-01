import React from 'react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-punk-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
          Privacy Policy
        </h1>
        <div className="w-20 h-1 bg-punk-orange mb-8" />

        <div>
          <p className="text-gray-500 mb-6">
            Last updated: January 2025
          </p>

          <p className="text-gray-300 mb-8">
            At Punk Records, we take your privacy seriously. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit our website
            and use our services.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Information We Collect
            </h2>
            <h3 className="text-lg font-semibold text-white mb-2">
              Personal Information
            </h3>
            <p className="text-gray-400 mb-4">
              When you create an account or make a purchase, we may collect:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>Name and contact information (email, phone, address)</li>
              <li>Payment information (processed securely through our payment provider)</li>
              <li>Order history and preferences</li>
              <li>Account credentials</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2">
              Automatically Collected Information
            </h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Device information (browser type, operating system)</li>
              <li>IP address and location data</li>
              <li>Pages visited and actions taken on our site</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-400 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about orders, products, and services</li>
              <li>Improve our website and customer experience</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Prevent fraud and maintain security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-400 mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>
                <strong className="text-white">Service Providers:</strong> Third parties that help us operate our
                business (payment processors, shipping carriers, etc.)
              </li>
              <li>
                <strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition,
                or sale of assets
              </li>
            </ul>
            <p className="text-gray-400 mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-gray-400 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze site traffic and usage</li>
              <li>Personalize your experience</li>
            </ul>
            <p className="text-gray-400 mt-4">
              You can control cookies through your browser settings, but disabling them may
              affect site functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Data Security
            </h2>
            <p className="text-gray-400">
              We implement appropriate technical and organizational measures to protect your
              personal information. However, no method of transmission over the Internet is
              100% secure. We cannot guarantee absolute security but are committed to protecting
              your data to the best of our ability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Your Rights
            </h2>
            <p className="text-gray-400 mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
              <li>Data portability</li>
            </ul>
            <p className="text-gray-400 mt-4">
              To exercise these rights, please contact us using the information below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-400">
              Our services are not intended for children under 13. We do not knowingly collect
              personal information from children under 13. If you believe we have collected
              information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-400">
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the "Last updated"
              date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-400">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:privacy@punkrecords.com" className="text-punk-orange hover:text-punk-coral transition-colors">
                privacy@punkrecords.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
