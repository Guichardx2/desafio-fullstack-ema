import { Link } from "@heroui/link";

import { Navbar } from "@/components/NavBar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 pt-16 flex flex-col flex-1 min-h-0 overflow-hidden">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://github.com/Guichardx2"
          title="Guichard GitHub"
        >
          <span className="text-default-600">Feito por</span>
          <p className="text-primary">Guichard</p>
        </Link>
      </footer>
    </div>
  );
}
