interface SchemaData {
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  provider?: {
    name: string;
    url: string;
  };
  teaches?: string[];
  educationalLevel?: string;
  timeRequired?: string;
  interactivityType?: string;
}

export function generateCourseSchema(data: SchemaData) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "image": data.image,
    "provider": {
      "@type": "Organization",
      "name": data.provider?.name || "Proficia",
      "url": data.provider?.url || "https://proficia.com"
    },
    "teaches": data.teaches || [],
    "educationalLevel": data.educationalLevel || "Beginner to Advanced",
    "timeRequired": data.timeRequired,
    "interactivityType": data.interactivityType || "active",
    "learningResourceType": "Course",
    "educationalUse": "instruction"
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Proficia",
    "description": "AI-powered learning platform for technology skills development",
    "url": "https://proficia.com",
    "logo": "https://proficia.com/logo.png",
    "sameAs": [
      "https://twitter.com/proficia",
      "https://linkedin.com/company/proficia",
      "https://github.com/proficia"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "foundingDate": "2024",
    "numberOfEmployees": "1-10",
    "knowsAbout": [
      "Web Development",
      "Data Science",
      "Machine Learning",
      "AI",
      "Mobile Development",
      "Cloud Computing",
      "Cybersecurity",
      "DevOps",
      "Game Development",
      "Algorithms"
    ]
  };
}

export function generateReviewSchema(reviews: { rating: number }[]) {
  if (!reviews || reviews.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "ratingValue": calculateAverageRating(reviews),
    "reviewCount": reviews.length,
    "bestRating": 5,
    "worstRating": 1
  };
}

export function generatePersonSchema(userData: {
  name?: string;
  username: string;
  profileUrl: string;
  joinDate: string;
  achievements?: object[];
  skills?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": userData.name || userData.username,
    "alternateName": userData.username,
    "url": userData.profileUrl,
    "knowsAbout": userData.skills || [],
    "memberOf": {
      "@type": "Organization",
      "name": "Proficia"
    },
    "description": `Proficia learner with ${userData.achievements?.length || 0} achievements`
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

function calculateAverageRating(reviews: { rating?: number }[]): number {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return Number((sum / reviews.length).toFixed(1));
}

// Helper component to inject schema into page head
export function SchemaMarkup({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}