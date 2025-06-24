import React from 'react';

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  
  return (
    <div className="pt-16 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl mb-4 text-gray-900 dark:text-white">User Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-gray-700 dark:text-gray-300">
          User ID: {id}
        </div>
      </div>
    </div>
  );
}