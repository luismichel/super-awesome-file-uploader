import { AuthStatus } from "@/components/auth/authStatus";
import AuthWrapper from "@/components/auth/authWrapper";

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="bg-gray-800 text-white p-4 flex flex-row justify-between">
          <h1 className="text-2xl">Super Awesome File Uploader</h1>
          <AuthWrapper>
            <AuthStatus />
          </AuthWrapper>
        </header>
        <main className="flex-grow p-4">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          &copy; 2025 Luis Michel{" "}
        </footer>
      </div>
    </>
  );
}
