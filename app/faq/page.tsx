import React from 'react';
import NavbarPrimary from '@/components/NavbarPrimary';
import { generateFAQSchema, SchemaMarkup } from '@/lib/schema';

async function getFAQs() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/faq`, {
      cache: 'force-cache'
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export const metadata = {
  title: 'Frequently Asked Questions | Proficia',
  description: 'Find answers to common questions about Proficia\'s AI-powered learning platform, practice tests, pricing, and features.',
  keywords: 'FAQ, questions, help, support, learning platform, online education',
  openGraph: {
    title: 'FAQ - Proficia Learning Platform',
    description: 'Get answers to frequently asked questions about our AI-powered learning platform',
    type: 'website',
  },
};

// ... imports
export default async function FAQPage() {
  const faqs = await getFAQs();
  const faqSchema = generateFAQSchema(faqs);

  return (
    <div className="min-h-screen bg-background">
      <SchemaMarkup schema={faqSchema} />
      <NavbarPrimary />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to common questions about Proficia&apos;s AI-powered learning platform
          </p>
        </header>

        <section>
          <div className="space-y-6">
            {faqs.map((faq: { question: string; answer: string }, index: number) => (
              <div key={index} className="bg-card rounded-lg shadow-sm border border-border">
                <details className="group">
                  <summary className="p-6 cursor-pointer list-none">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </h3>
                      <span className="text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-12 text-center">
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              We&apos;re here to help! Reach out to our support team for personalized assistance.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}