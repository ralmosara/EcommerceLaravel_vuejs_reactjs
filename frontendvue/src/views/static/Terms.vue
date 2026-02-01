<script setup lang="ts">
const lastUpdated = 'January 1, 2024'
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-display text-white uppercase tracking-wider text-center mb-4">
      Terms of <span class="text-gradient-punk">Service</span>
    </h1>
    <p class="text-gray-400 text-center mb-12">Last updated: {{ lastUpdated }}</p>

    <div class="prose prose-invert max-w-none space-y-8">
      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">1. Acceptance of Terms</h2>
        <p class="text-gray-400">
          By accessing and using this website, you accept and agree to be bound by the terms and
          provisions of this agreement. If you do not agree to abide by these terms, please do not
          use this service.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">2. Use License</h2>
        <p class="text-gray-400 mb-4">
          Permission is granted to temporarily access the materials on Vinyl's website for personal,
          non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>
        <p class="text-gray-400">Under this license you may not:</p>
        <ul class="list-disc list-inside text-gray-400 mt-2 space-y-1">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to decompile or reverse engineer any software</li>
          <li>Remove any copyright or proprietary notations</li>
          <li>Transfer the materials to another person</li>
        </ul>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">3. Account Terms</h2>
        <p class="text-gray-400 mb-4">
          To access certain features, you must create an account. You agree to:
        </p>
        <ul class="list-disc list-inside text-gray-400 space-y-1">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your password</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">4. Products and Pricing</h2>
        <p class="text-gray-400 mb-4">
          All prices are listed in USD unless otherwise noted. We reserve the right to:
        </p>
        <ul class="list-disc list-inside text-gray-400 space-y-1">
          <li>Modify prices without notice</li>
          <li>Limit quantities available for purchase</li>
          <li>Refuse or cancel orders at our discretion</li>
          <li>Correct pricing errors</li>
        </ul>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">5. Payment Terms</h2>
        <p class="text-gray-400">
          Payment is due at the time of purchase. We accept major credit cards and other payment
          methods as displayed at checkout. All payments are processed securely through our
          payment processors.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">6. Shipping and Delivery</h2>
        <p class="text-gray-400">
          Shipping times are estimates and not guaranteed. We are not responsible for delays
          caused by carriers, customs, or other factors beyond our control. Risk of loss passes
          to you upon delivery to the carrier.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">7. Returns and Refunds</h2>
        <p class="text-gray-400">
          Please refer to our <router-link to="/returns" class="text-punk-orange hover:text-punk-coral">Returns Policy</router-link>
          for information on returns, exchanges, and refunds. All returns must comply with our
          stated policy.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">8. Limitation of Liability</h2>
        <p class="text-gray-400">
          In no event shall Vinyl or its suppliers be liable for any damages arising out of
          the use or inability to use the materials on this website, even if we have been
          notified of the possibility of such damage.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">9. Governing Law</h2>
        <p class="text-gray-400">
          These terms shall be governed by and construed in accordance with the laws of the
          State of New York, without regard to its conflict of law provisions.
        </p>
      </section>

      <section class="bg-punk-gray rounded-lg p-6">
        <h2 class="text-xl font-display text-white uppercase tracking-wider mb-4">10. Contact Information</h2>
        <p class="text-gray-400">
          If you have any questions about these Terms of Service, please
          <router-link to="/contact" class="text-punk-orange hover:text-punk-coral">contact us</router-link>.
        </p>
      </section>
    </div>
  </div>
</template>
