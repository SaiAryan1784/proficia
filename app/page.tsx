// src/app/page.tsx
import ButtonPrimary from "@/components/ButtonPrimary";
import NavbarPrimary from "@/components/NavbarPrimary";
import LandingPage from "@/section/LandingPage";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <div>
        <NavbarPrimary />
        <LandingPage />
      </div>
    </div>
  );
}