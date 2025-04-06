// src/app/page.tsx
import NavbarPrimary from "@/components/NavbarPrimary";
import LandingPage from "@/section/LandingPage";

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