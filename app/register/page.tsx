import { generateAuthMetadata } from "@/lib/seo";
import RegisterForm from "./RegisterForm";

export const metadata = generateAuthMetadata('register');

export default function RegisterPage() {
  return <RegisterForm />;
}