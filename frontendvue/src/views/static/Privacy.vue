<script setup lang="ts">
const lastUpdated = 'January 1, 2024'
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-display text-white uppercase tracking-wider text-center mb-4">
      Privacy <span class="text-gradient-punk">Policy</span>
    </h1>
    <p class="text-gray-400 text-center mb-12">Last updated: {{ lastUpdated }}</p>

    <div class="prose prose-invert max-w-none space-y-8">
      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">Introduction</h2>
        <p class="text-gray-400">
          Vinyl ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information when you visit our
          website or make a purchase.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">Information We Collect</h2>
        <p class="text-gray-400 mb-4">We collect information that you provide directly to us:</p>
        <ul class="list-disc list-inside text-gray-400 space-y-1">
          <li>Name and contact information (email, phone, address)</li>
          <li>Account credentials (username, password)</li>
          <li>Payment information (processed securely by Stripe)</li>
          <li>Order history and preferences</li>
          <li>Communications with our support team</li>
        </ul>
        <p class="text-gray-400 mt-4 mb-4">We automatically collect certain information:</p>
        <ul class="list-disc list-inside text-gray-400 space-y-1">
          <li>IP address and device information</li>
          <li>Browser type and operating system</li>
          <li>Pages visited and time spent on our site</li>
          <li>Referring website addresses</li>
        </ul>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">How We Use Your Information</h2>
        <p class="text-gray-400 mb-4">We use the information we collect to:</p>
        <ul class="list-disc list-inside text-gray-400 space-y-1">
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and updates</li>
          <li>Respond to your inquiries and support requests</li>
          <li>Send promotional communications (with your consent)</li>
          <li>Improve our website and services</li>
          <li>Detect and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">Information Sharing</h2>
        <p class="text-gray-400 mb-4">
          We do not sell your personal information. We may share your information with:
        </p>
        <ul class="list-disc list-inside text-gray-400 space-y-1">
          <li>Service providers (payment processors, shipping carriers)</li>
          <li>Legal authorities when required by law</li>
          <li>Business partners with your consent</li>
        </ul>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">Cookies and Tracking</h2>
        <p class="text-gray-400">
          We use cookies and similar tracking technologies to enhance your experience on our website.
          You can control cookies through your browser settings. Disabling cookies may affect the
          functionality of certain features.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">Data Security</h2>
        <p class="text-gray-400">
          We implement appropriate technical and organizational measures to protect your personal
          information. However, no method of transmission over the Internet is 100% secure. We
          cannot guarantee absolute security.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">Your Rights</h2>
        <p class="text-gray-400 mb-4">You have the right to:</p>
        <ul class="list-disc list-inside text-gray-400 space-y-1">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Data portability</li>
        </ul>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">Children's Privacy</h2>
        <p class="text-gray-400">
          Our services are not intended for individuals under 18 years of age. We do not knowingly
          collect personal information from children. If you believe we have collected information
          from a child, please contact us immediately.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">Changes to This Policy</h2>
        <p class="text-gray-400">
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">Contact Us</h2>
        <p class="text-gray-400">
          If you have questions about this Privacy Policy, please
          <router-link to="/contact" class="text-punk-orange hover:text-punk-coral">contact us</router-link>.
        </p>
      </section>
    </div>
  </div>
</template>
