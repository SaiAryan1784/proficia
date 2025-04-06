import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create topics
    const topics = [
      {
        name: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics, including variables, functions, and control flow.',
        imageUrl: 'https://via.placeholder.com/150?text=JS',
        category: 'Programming',
      },
      {
        name: 'React Essentials',
        description: 'Test your understanding of React core concepts, including components, props, and state.',
        imageUrl: 'https://via.placeholder.com/150?text=React',
        category: 'Programming',
      },
      {
        name: 'Data Structures',
        description: 'Test your knowledge of fundamental data structures like arrays, linked lists, trees, and graphs.',
        imageUrl: 'https://via.placeholder.com/150?text=DS',
        category: 'Computer Science',
      },
      {
        name: 'Algorithms',
        description: 'Test your understanding of common algorithms and their complexity.',
        imageUrl: 'https://via.placeholder.com/150?text=Algo',
        category: 'Computer Science',
      },
      {
        name: 'SQL Basics',
        description: 'Test your knowledge of SQL queries and database concepts.',
        imageUrl: 'https://via.placeholder.com/150?text=SQL',
        category: 'Database',
      }
    ]

    for (const topic of topics) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "Topic" (id, name, description, "imageUrl", category, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), '${topic.name}', '${topic.description}', '${topic.imageUrl}', '${topic.category}', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `);
    }

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 