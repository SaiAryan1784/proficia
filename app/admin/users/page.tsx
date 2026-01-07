// src/app/admin/users/page.tsx
import { prisma } from "@/lib/db";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

export default async function UsersPage() {
  const users = await prisma.users.findMany({
    orderBy: { email: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      emailVerified: true,
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <Link
          href="/admin/users/new"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <FiPlus className="mr-2" />
          Add User
        </Link>
      </div>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-foreground font-medium">{user.name || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.emailVerified
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isAdmin
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                      }`}>
                      {user.isAdmin ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-3">
                      <Link href={`/admin/users/${user.id}`} className="text-muted-foreground hover:text-primary transition-colors" title="Edit">
                        <FiEdit2 />
                      </Link>
                      <Link href={`/admin/users/${user.id}/delete`} className="text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                        <FiTrash2 />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}