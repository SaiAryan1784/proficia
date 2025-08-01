// src/app/admin/page.tsx
import { prisma } from "@/lib/db";
import Link from "next/link";
import { FiUsers, FiActivity, FiTrendingUp, FiSettings } from "react-icons/fi";

export default async function AdminDashboard() {
  const [totalUsers, totalSessions, recentUsers, totalTests, recentTestAttempts] = await Promise.all([
    prisma.users.count(),
    prisma.session.count(),
    prisma.users.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.test.count(),
    // Get recent test attempts
    prisma.test.findMany({
      where: {
        status: "COMPLETED"
      },
      include: {
        user: {
          select: {
            name: true,
            username: true
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
      take: 5 // Show last 5 attempts
    })
  ]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <Link 
          href="/admin/settings"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiSettings className="mr-2" />
          Settings
        </Link>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
            </div>
            <FiUsers className="text-4xl text-indigo-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sessions</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalSessions}</p>
            </div>
            <FiActivity className="text-4xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">New Users (7 days)</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{recentUsers}</p>
            </div>
            <FiTrendingUp className="text-4xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tests</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTests}</p>
            </div>
            <FiActivity className="text-4xl text-purple-500" />
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/admin/users"
              className="block p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            >
              <div className="flex items-center">
                <FiUsers className="mr-3 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-900 dark:text-white">Manage Users</span>
              </div>
            </Link>
            <Link 
              href="/admin/test-attempts"
              className="block p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
            >
              <div className="flex items-center">
                <FiActivity className="mr-3 text-green-600 dark:text-green-400" />
                <span className="text-gray-900 dark:text-white">View Test Attempts</span>
              </div>
            </Link>
            <Link 
              href="/admin/settings"
              className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <FiSettings className="mr-3 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">System Settings</span>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Test Attempts</h2>
          <div className="space-y-3">
            {recentTestAttempts.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {test.user.name?.charAt(0) || test.user.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {test.user.name || test.user.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {test.topic.name} • {test.score}%
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {test.completedAt ? new Date(test.completedAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))}
            {recentTestAttempts.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                No recent test attempts
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link 
              href="/admin/test-attempts"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 text-sm font-medium"
            >
              View all test attempts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}