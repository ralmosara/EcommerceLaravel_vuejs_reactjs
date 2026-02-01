import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-punk-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
          Contact Us
        </h1>
        <div className="w-20 h-1 bg-punk-orange mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-punk-gray p-6 text-center border border-punk-black">
            <Mail className="h-8 w-8 text-punk-orange mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">Email</h3>
            <p className="text-gray-400">support@punkrecords.com</p>
          </div>

          <div className="bg-punk-gray p-6 text-center border border-punk-black">
            <Phone className="h-8 w-8 text-punk-orange mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">Phone</h3>
            <p className="text-gray-400">1-800-PUNK-01</p>
          </div>

          <div className="bg-punk-gray p-6 text-center border border-punk-black">
            <MapPin className="h-8 w-8 text-punk-orange mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">Address</h3>
            <p className="text-gray-400">123 Vinyl Lane, NY 10001</p>
          </div>
        </div>

        <div className="bg-punk-gray border border-punk-black p-8">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
            Send us a message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-punk-gray bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-punk-gray bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-punk-gray bg-punk-black text-white focus:outline-none focus:border-punk-orange transition-colors"
              >
                <option value="">Select a subject</option>
                <option value="order">Order Inquiry</option>
                <option value="shipping">Shipping Question</option>
                <option value="returns">Returns & Refunds</option>
                <option value="product">Product Question</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-punk-gray bg-punk-black text-white placeholder-gray-500 focus:outline-none focus:border-punk-orange transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 bg-punk-orange text-white font-bold uppercase tracking-wider hover:bg-punk-coral transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
