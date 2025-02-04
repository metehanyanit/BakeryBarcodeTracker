import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { LayoutGrid, Scan, PlusCircle } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const navItems = [
  { href: "/", icon: LayoutGrid, label: "Dashboard" },
  { href: "/scan", icon: Scan, label: "Scan Barcode" },
  { href: "/add", icon: PlusCircle, label: "Add Product" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={20} className="bg-[#FFF8E1]">
        <div className="h-full p-4 space-y-4">
          <h1 className="text-xl font-bold text-[#3E2723] mb-8">Bakery Inventory</h1>
          <nav className="space-y-2">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <a
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg transition-colors",
                    "hover:bg-[#F9A825] hover:text-white",
                    location === href
                      ? "bg-[#F9A825] text-white"
                      : "text-[#3E2723]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <main className="h-full p-4 bg-white">
          {children}
        </main>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}