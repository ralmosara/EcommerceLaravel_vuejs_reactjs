<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  // Orders
  {
    category: 'Orders',
    question: 'How do I track my order?',
    answer: 'Once your order ships, you\'ll receive an email with tracking information. You can also view your order status by logging into your account and visiting the Orders page.',
  },
  {
    category: 'Orders',
    question: 'Can I cancel or modify my order?',
    answer: 'You can cancel or modify your order within 1 hour of placing it. After that, please contact our support team, and we\'ll do our best to accommodate your request before the order ships.',
  },
  // Shipping
  {
    category: 'Shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Priority shipping takes 1-2 business days. International shipping times vary by destination.',
  },
  {
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 20 countries worldwide. Shipping costs and delivery times vary by destination. You can see the available shipping options during checkout.',
  },
  // Returns
  {
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for unopened items in their original packaging. For defective products, we\'ll cover return shipping and provide a full refund or replacement.',
  },
  {
    category: 'Returns',
    question: 'How do I start a return?',
    answer: 'To start a return, log into your account, go to your Orders page, select the order, and click "Request Return." Follow the instructions to print your return label.',
  },
  // Products
  {
    category: 'Products',
    question: 'How do you grade vinyl records?',
    answer: 'We use the Goldmine grading standard. All records are visually and audio inspected. Grades range from Mint (M) to Poor (P), with detailed descriptions for each item.',
  },
  {
    category: 'Products',
    question: 'Are your vinyl records authentic pressings?',
    answer: 'Absolutely. We source directly from labels, distributors, and verified collectors. Each listing includes pressing details, catalog numbers, and origin information.',
  },
  // Account
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a link to reset your password. The link expires after 24 hours.',
  },
  {
    category: 'Account',
    question: 'How do I delete my account?',
    answer: 'To delete your account, please contact our support team. Note that this action is permanent and will remove all your order history and saved preferences.',
  },
  // Payment
  {
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are secured with industry-standard encryption.',
  },
  {
    category: 'Payment',
    question: 'Is my payment information secure?',
    answer: 'Yes. We use Stripe for payment processing, which is PCI DSS compliant. We never store your full credit card information on our servers.',
  },
]

const categories = [...new Set(faqs.map(faq => faq.category))]
const selectedCategory = ref<string | null>(null)
const openIndex = ref<number | null>(null)

const filteredFaqs = ref(faqs)

const filterByCategory = (category: string | null) => {
  selectedCategory.value = category
  filteredFaqs.value = category
    ? faqs.filter(faq => faq.category === category)
    : faqs
  openIndex.value = null
}

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-display text-white uppercase tracking-wider text-center mb-4">
      Frequently Asked <span class="text-gradient-punk">Questions</span>
    </h1>
    <p class="text-gray-400 text-center mb-12">
      Find answers to common questions about orders, shipping, returns, and more.
    </p>

    <!-- Category Filter -->
    <div class="flex flex-wrap gap-2 justify-center mb-8">
      <button
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedCategory === null
            ? 'bg-punk-orange text-white'
            : 'bg-punk-gray text-gray-300 hover:bg-punk-black',
        ]"
        @click="filterByCategory(null)"
      >
        All
      </button>
      <button
        v-for="category in categories"
        :key="category"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedCategory === category
            ? 'bg-punk-orange text-white'
            : 'bg-punk-gray text-gray-300 hover:bg-punk-black',
        ]"
        @click="filterByCategory(category)"
      >
        {{ category }}
      </button>
    </div>

    <!-- FAQ Accordion -->
    <div class="space-y-3">
      <div
        v-for="(faq, index) in filteredFaqs"
        :key="index"
        class="bg-punk-gray rounded-lg overflow-hidden"
      >
        <button
          class="w-full flex items-center justify-between p-4 text-left"
          @click="toggleFaq(index)"
        >
          <span class="font-medium text-white pr-4">{{ faq.question }}</span>
          <ChevronDownIcon
            :class="[
              'h-5 w-5 text-gray-400 transition-transform flex-shrink-0',
              openIndex === index ? 'rotate-180' : '',
            ]"
          />
        </button>
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-96 opacity-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="max-h-96 opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-if="openIndex === index" class="overflow-hidden">
            <div class="p-4 pt-0 text-gray-400">
              {{ faq.answer }}
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Still have questions -->
    <div class="mt-12 text-center bg-punk-gray rounded-lg p-8">
      <h2 class="text-xl font-semibold text-white mb-2">Still have questions?</h2>
      <p class="text-gray-400 mb-4">Can't find what you're looking for? We're here to help.</p>
      <router-link to="/contact" class="btn-punk">
        Contact Us
      </router-link>
    </div>
  </div>
</template>
