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
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Test Attempts</h1>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Attempts</h3>
              <p className="text-3xl font-bold text-foreground">{totalAttempts}</p>
            </div>
            <FiCheckCircle className="text-4xl text-primary" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Today&#39;s Attempts</h3>
              <p className="text-3xl font-bold text-foreground">{todayAttempts}</p>
            </div>
            <FiCalendar className="text-4xl text-secondary" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Average Score</h3>
              <p className="text-3xl font-bold text-foreground">{averageScore}%</p>
            </div>
            <FiCheckCircle className="text-4xl text-primary/70" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Avg Time</h3>
              <p className="text-3xl font-bold text-foreground">{averageTime}m</p>
            </div>
            <FiClock className="text-4xl text-amber-500" />
          </div>
        </div>
      </div>

      {/* Test Attempts Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Recent Test Attempts</h2>
          <p className="text-sm text-muted-foreground mt-1">Latest 100 completed tests</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Test Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Completed At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {testAttempts.map((test) => (
                <tr key={test.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {test.user.name?.charAt(0) || test.user.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {test.user.name || test.user.username}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          @{test.user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground border border-secondary/20">
                      {test.topic.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground max-w-xs truncate">
                      {test.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${(test.score || 0) >= 80 ? 'text-green-600' :
                          (test.score || 0) >= 60 ? 'text-amber-600' :
                            'text-destructive'
                        }`}>
                        {test.score || 0}%
                      </span>
                      {(test.score || 0) >= 80 ? (
                        <FiCheckCircle className="ml-2 text-green-500" />
                      ) : (
                        <FiXCircle className="ml-2 text-destructive" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-foreground">
                      <FiClock className="mr-1 text-muted-foreground" />
                      {test.timeSpent ? `${Math.round(test.timeSpent / 60)}m ${test.timeSpent % 60}s` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {test.completedAt ? new Date(test.completedAt).toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${test.isTimedOut
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
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
              <div className="text-muted-foreground">
                <FiCalendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
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
