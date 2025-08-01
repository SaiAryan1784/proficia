// app/admin/test-attempts/page.tsx
import { prisma } from "@/lib/db";
import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default async function TestAttemptsPage() {
  // Fetch recent test attempts with user and topic info
  const testAttempts = await prisma.test.findMany({
    where: {
      status: "COMPLETED"
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true
        }
      },
      topic: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      completedAt: 'desc'
    },
    take: 100 // Show last 100 attempts
  });

  // Get test attempt statistics
  const stats = await prisma.test.aggregate({
    where: {
      status: "COMPLETED"
    },
    _count: {
      id: true
    },
    _avg: {
      score: true,
      timeSpent: true
    }
  });

  const totalAttempts = stats._count.id;
  const averageScore = Math.round(stats._avg.score || 0);
  const averageTime = Math.round((stats._avg.timeSpent || 0) / 60); // Convert to minutes

  // Get today's test attempts
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayAttempts = await prisma.test.count({
    where: {
      status: "COMPLETED",
      completedAt: {
        gte: todayStart
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Attempts</h1>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Attempts</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalAttempts}</p>
            </div>
            <FiCheckCircle className="text-4xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today&#39;s Attempts</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{todayAttempts}</p>
            </div>
            <FiCalendar className="text-4xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{averageScore}%</p>
            </div>
            <FiCheckCircle className="text-4xl text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Time</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{averageTime}m</p>
            </div>
            <FiClock className="text-4xl text-orange-500" />
          </div>
        </div>
      </div>

      {/* Test Attempts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Test Attempts</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest 100 completed tests</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Test Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Completed At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {testAttempts.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {test.user.name?.charAt(0) || test.user.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {test.user.name || test.user.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          @{test.user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {test.topic.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {test.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        (test.score || 0) >= 80 ? 'text-green-600 dark:text-green-400' :
                        (test.score || 0) >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {test.score || 0}%
                      </span>
                      {(test.score || 0) >= 80 ? (
                        <FiCheckCircle className="ml-2 text-green-500" />
                      ) : (
                        <FiXCircle className="ml-2 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <FiClock className="mr-1 text-gray-400" />
                      {test.timeSpent ? `${Math.round(test.timeSpent / 60)}m ${test.timeSpent % 60}s` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {test.completedAt ? new Date(test.completedAt).toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      test.isTimedOut 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {test.isTimedOut ? 'Timed Out' : 'Completed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {testAttempts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <FiCalendar className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">No test attempts found</h3>
                <p className="text-sm">Test attempts will appear here once users start taking tests.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
