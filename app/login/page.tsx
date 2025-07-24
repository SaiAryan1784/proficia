import { generateAuthMetadata } from "@/lib/seo";
import LoginForm from "./LoginForm";

export const metadata = generateAuthMetadata('login');

export default function LoginPage() {
  return <LoginForm />;
}