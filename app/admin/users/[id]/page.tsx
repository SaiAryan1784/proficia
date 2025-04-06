// src/app/admin/users/[id]/page.tsx
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditUserPage({
  params
}: {
  params: { id: string }
}) {
  const user = await prisma.users.findUnique({
    where: { id: params.id }
  });
  
  if (!user) {
    notFound();
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      
      <div className="bg-white p-6 rounded shadow">
        <form action="/api/admin/users/update" method="POST">
          <input type="hidden" name="id" value={user.id} />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={user.name || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isAdmin"
                defaultChecked={user.isAdmin}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Admin User</span>
            </label>
          </div>
          
          <div className="flex space-x-4">
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update User
            </button>
            
            <Link 
              href="/admin/users"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}