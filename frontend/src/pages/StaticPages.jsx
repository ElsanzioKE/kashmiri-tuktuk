import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const AboutPage = () => (
  <div className="animate-fade-in">
    {/* Hero */}
    <div className="bg-forest-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display text-4xl font-bold mb-4">About Kashmiri TukTuk Spare Parts</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Mombasa's most trusted supplier of genuine TukTuk spare parts, serving local operators and East African markets since 2008.
        </p>
      </div>
    </div>

    {/* Story */}
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="font-display text-3xl font-bold text-forest-900 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2008 in the heart of Mombasa, Kashmiri TukTuk Spare Parts began as a small workshop serving local auto-rickshaw operators. Over the years, we've grown into a comprehensive parts supplier serving thousands of TukTuk owners across Kenya and East Africa.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our deep understanding of the unique terrain and conditions in the region allows us to stock parts that truly meet operator needs — from the coastal roads of Mombasa to the bustling city streets of Nairobi and Dar es Salaam.
          </p>
        </div>
        <div className="bg-forest-50 rounded-xl p-8">
          <div className="grid grid-cols-2 gap-6 text-center">
            {[['15+', 'Years Experience'], ['10,000+', 'Customers Served'], ['5,000+', 'Parts In Stock'], ['2', 'Countries']].map(([val, label]) => (
              <div key={label} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-2xl font-bold text-ember-500">{val}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-forest-900 text-white rounded-2xl p-10 text-center mb-16">
        <h2 className="font-display text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          To keep every TukTuk on the road by providing genuine, affordable spare parts with fast delivery and expert technical support — empowering operators across Kenya and East Africa.
        </p>
      </div>

      {/* Values */}
      <h2 className="font-display text-3xl font-bold text-forest-900 text-center mb-8">Our Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '🏆', title: 'Quality First', desc: 'We stock only genuine, OEM-certified parts to ensure reliability and safety for operators.' },
          { icon: '🤝', title: 'Integrity', desc: 'Transparent pricing, honest advice, no counterfeit parts. We build long-term trust with our customers.' },
          { icon: '⚡', title: 'Speed', desc: 'Fast order processing and shipping so your TukTuk spends more time earning, less time in the workshop.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500)); // Simulate API
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-forest-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-gray-300">We're here to help. Reach out for parts inquiries, technical support, or any questions.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+254 7XX XXX XXX" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required className="input-field" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required className="input-field">
                  <option value="">Select subject</option>
                  <option value="parts-inquiry">Parts Inquiry</option>
                  <option value="order-support">Order Support</option>
                  <option value="technical">Technical Support</option>
                  <option value="bulk-order">Bulk Order</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required rows={5} className="input-field resize-none" placeholder="Tell us how we can help..." />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
                {sending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  { icon: '📍', title: 'Mombasa Office', info: 'Manyimbo Road, Tudor\nMombasa, Kenya' },
                  { icon: '📞', title: 'Phone / WhatsApp', info: '+254 733 282 512' },
                  { icon: '✉️', title: 'Email', info: 'mohaseeb@gmail.com' },
                  { icon: '🕒', title: 'Business Hours', info: 'Monday–Saturday: 8:00 AM – 6:00 PM EAT\nSunday: 9:00 AM – 1:00 PM EAT' },
                ].map(({ icon, title, info }) => (
                  <div key={title} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl flex-shrink-0">{icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                      <p className="text-gray-600 text-sm whitespace-pre-line">{info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* East Africa */}
            <div className="bg-ember-50 border border-ember-200 rounded-xl p-5">
              <h3 className="font-semibold text-ember-800 mb-2">🌍 East Africa Inquiries</h3>
              <p className="text-ember-700 text-sm leading-relaxed">
                For bulk orders and business inquiries from Kenya, Tanzania, Uganda, Ethiopia and Rwanda, please email us at <strong>mohaseeb@gmail.com</strong> or WhatsApp +254 733 282 512.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
