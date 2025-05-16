import { LoginForm } from "@/components/login/loginForm";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center sm:items-start">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <LoginForm />
      </main>
    </div>
  );
}
