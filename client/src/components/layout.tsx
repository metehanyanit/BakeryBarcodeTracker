
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { LayoutGrid, Scan, PlusCircle, Menu } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const navItems = [
  { href: "/", icon: LayoutGrid, label: "Dashboard" },
  { href: "/scan", icon: Scan, label: "Scan Barcode" },
  { href: "/add", icon: PlusCircle, label: "Add Product" },
];

const SidebarContent = ({ location }: { location: string }) => (
  <div className="h-full p-4 space-y-4">
    <h1 className="text-xl font-bold text-[#3E2723] mb-8 truncate">Bakery Inventory</h1>
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
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{label}</span>
          </a>
        </Link>
      ))}
    </nav>
  </div>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center p-4 bg-[#FFF8E1]">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] bg-[#FFF8E1] p-0">
              <SidebarContent location={location} />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold text-[#3E2723] truncate">Bakery Inventory</h1>
        </div>
        <main className="p-4">
          {children}
        </main>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={20} className="bg-[#FFF8E1]">
        <SidebarContent location={location} />
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
