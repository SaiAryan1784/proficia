import React from 'react';
import { TestCards } from '@/lib/data';
import Image from 'next/image';

const page = () => {
  return (
    <div className="pt-16 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl mb-4">Tests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TestCards.map((card) => (
          <div key={card.id} className="bg-white shadow-md rounded-lg p-4">
            <Image
                width={150}
                height={150}
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-32 object-cover rounded-t-lg"
            />
            <h2 className="text-xl font-semibold mt-2">{card.name}</h2>
            <p className="text-gray-600">{card.description}</p>
            <p className="text-gray-500">Category: {card.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
