// src/app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const totalUsers = await prisma.users.count();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-medium">Total Users</h3>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-medium">Active Sessions</h3>
          <p className="text-3xl font-bold">{await prisma.session.count()}</p>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-medium">New Users (Last 7 Days)</h3>
          <p className="text-3xl font-bold">
            {await prisma.users.count({
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
              }
            })}
          </p>
        </div>
      </div>
    </div>
  );
}