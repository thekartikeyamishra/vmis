import Image from "next/image";
import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Staff sign in" };

export default async function Login() {
  if (await getStaffUser()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="card w-full max-w-sm">
        <Image src="/brand/vmis-logo-128.webp" alt="VMIS emblem" width={72} height={72} className="mx-auto rounded-full" priority />
        <h1 className="mt-4 text-center text-xl font-extrabold">VMIS staff sign in</h1>
        <p className="mt-1 text-center text-sm text-muted">Authorised school staff only.</p>
        <LoginForm />
      </div>
    </main>
  );
}
