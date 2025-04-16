import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

async function getTestStatistics(userId: string) {
  return await prisma.test.findMany({
    where: {
      userId: userId,
      status: "COMPLETED"
    },
    include: {
      topic: {
        select: {
          name: true,
          category: true
        }
      }
    },
    orderBy: {
      completedAt: 'desc'
    }
  });
}

export default async function StatisticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const testHistory = await getTestStatistics(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test History & Statistics</h1>
      
      {testHistory.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No test history available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Overall Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(testHistory.reduce((acc, test) => acc + (test.score || 0), 0) / testHistory.length)}%
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tests Completed</p>
                <p className="text-2xl font-bold text-green-600">{testHistory.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.max(...testHistory.map(test => test.score || 0))}%
                </p>
              </div>
            </div>
          </div>

          {/* Test History Table - Responsive Version */}
          <div className="bg-white rounded-lg sm:hidden shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testHistory.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 truncate max-w-xs">
                        {test.title}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${test.score && test.score >= 70 ? 'bg-green-100 text-green-800' : 
                            test.score && test.score >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {test.score}%
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(test.completedAt!).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {test.topic?.category || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <a href={`/tests/${test.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Responsive card view for mobile */}
          <div className="md:hidden mt-4 space-y-4">
            {testHistory.map((test) => (
              <div key={`mobile-${test.id}`} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium text-gray-900">{test.title}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Score</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold
                      ${test.score && test.score >= 70 ? 'bg-green-100 text-green-800' : 
                        test.score && test.score >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {test.score}%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm">{new Date(test.completedAt!).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm">{test.topic?.category || "N/A"}</p>
                  </div>
                  <div>
                    <a href={`/tests/${test.id}`} className="inline-block mt-1 text-blue-600 font-medium text-sm">
                      View Details →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}