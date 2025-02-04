import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { LayoutGrid, Scan, PlusCircle } from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutGrid, label: "Dashboard" },
  { href: "/scan", icon: Scan, label: "Scan Barcode" },
  { href: "/add", icon: PlusCircle, label: "Add Product" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:relative md:border-t-0">
        <div className="container mx-auto px-4">
          <div className="flex justify-around md:justify-start md:space-x-8 py-2">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <a
                  className={cn(
                    "flex flex-col items-center p-2 rounded-lg transition-colors",
                    "hover:text-[#F9A825]",
                    location === href
                      ? "text-[#F9A825]"
                      : "text-[#3E2723]"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-1">{label}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 pb-20 md:pb-4 pt-4">
        {children}
      </main>
    </div>
  );
}
