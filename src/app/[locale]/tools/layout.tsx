export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full text-slate-200">
      {/* Main Container */}
      <main className="relative z-10 pt-32 pb-16 px-6 max-w-5xl mx-auto animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0">
        {children}
      </main>
    </div>
  );
}
