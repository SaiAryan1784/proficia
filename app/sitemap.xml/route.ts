import { prisma } from '@/lib/db';

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://proficia.com';
  
  try {
    // Get all topics for topic pages
    const topics = await prisma.topic.findMany({
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    // Get public user profiles
    const publicUsers = await prisma.users.findMany({
      where: {
        username: {
          not: null,
        },
      },
      select: {
        username: true,
        updatedAt: true,
      },
      take: 1000, // Limit for performance
    });

    const currentDate = new Date().toISOString();

    // Static pages
    const staticPages = [
      {
        url: `${baseUrl}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/register`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ];

    // Topic pages
    const topicPages = topics.map((topic) => ({
      url: `${baseUrl}/topics/${encodeURIComponent(topic.name.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: topic.updatedAt.toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // Public user profiles
    const userProfilePages = publicUsers
      .filter(user => user.username)
      .map((user) => ({
        url: `${baseUrl}/profile/${user.username}`,
        lastModified: user.updatedAt.toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));

    const allPages = [...staticPages, ...topicPages, ...userProfilePages];

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}