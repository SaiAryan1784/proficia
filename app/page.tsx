// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Next.js Auth App</h1>
      <div>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </div>
  );
}