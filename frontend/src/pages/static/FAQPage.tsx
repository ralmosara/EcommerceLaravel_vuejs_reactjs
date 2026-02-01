import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Orders',
    question: 'How do I track my order?',
    answer: 'Once your order ships, you\'ll receive an email with tracking information. You can also view your order status by logging into your account and visiting the "My Orders" section.'
  },
  {
    category: 'Orders',
    question: 'Can I cancel or modify my order?',
    answer: 'Orders can be cancelled before they are processed. Once an order has been processed or shipped, it cannot be cancelled. Please contact our support team as soon as possible if you need to make changes.'
  },
  {
    category: 'Shipping',
    question: 'What shipping methods do you offer?',
    answer: 'We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Overnight Shipping for most locations. Shipping options and costs are displayed at checkout.'
  },
  {
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to many countries worldwide. International shipping rates and delivery times vary by destination. You can see available options during checkout.'
  },
  {
    category: 'Shipping',
    question: 'How are vinyl records packaged?',
    answer: 'All vinyl records are carefully packaged in specialized mailers designed to protect them during shipping. We use sturdy cardboard inserts and padding to ensure your records arrive in perfect condition.'
  },
  {
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of delivery for unused items in original packaging. Opened CDs, cassettes, and digital downloads cannot be returned unless defective.'
  },
  {
    category: 'Returns',
    question: 'How do I return an item?',
    answer: 'To initiate a return, log into your account, go to "My Orders," select the order, and click "Request Return." Follow the instructions to print a return label and ship the item back.'
  },
  {
    category: 'Products',
    question: 'What formats do you sell?',
    answer: 'We sell vinyl records, CDs, cassettes, and digital downloads. Each album listing shows the available formats and their prices.'
  },
  {
    category: 'Products',
    question: 'Are your vinyl records new or used?',
    answer: 'Unless otherwise specified, all vinyl records are brand new and sealed. We occasionally offer used/vintage records, which are clearly marked with their condition.'
  },
  {
    category: 'Account',
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the top navigation, fill in your details, and verify your email address. Having an account lets you track orders, save items to your wishlist, and checkout faster.'
  },
  {
    category: 'Account',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Login" then "Forgot Password." Enter your email address and we\'ll send you a link to reset your password.'
  },
  {
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) through our secure payment processor. We also support various digital payment methods.'
  }
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-punk-black">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-white">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-punk-orange flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-400">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))];
  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === selectedCategory);

  return (
    <div className="min-h-screen bg-punk-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
          Frequently Asked Questions
        </h1>
        <div className="w-20 h-1 bg-punk-orange mb-4" />
        <p className="text-gray-400 mb-8">
          Find answers to common questions about orders, shipping, returns, and more.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                selectedCategory === category
                  ? 'bg-punk-orange text-white'
                  : 'bg-punk-gray text-gray-300 hover:bg-punk-black hover:text-punk-orange border border-punk-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="bg-punk-gray border border-punk-black px-6">
          {filteredFaqs.map((item, index) => (
            <FAQAccordion
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-12 bg-punk-gray border border-punk-black p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">
            Still have questions?
          </h2>
          <p className="text-gray-400 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-punk-orange text-white font-bold uppercase tracking-wider hover:bg-punk-coral transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
