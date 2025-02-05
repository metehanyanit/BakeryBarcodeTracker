export function ScrollParchment({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-parchment shadow-inner rounded-lg" />
      <div className="relative z-10 p-8 font-manuscript">
        {children}
      </div>
      <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-amber-900/10" />
      <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-amber-900/10" />
    </div>
  );
} 