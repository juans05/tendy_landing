export function FloatingDecor({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <span className="absolute left-[6%] top-[18%] text-3xl animate-float-slow">🎁</span>
      <span className="absolute right-[10%] top-[12%] text-2xl animate-float">⭐</span>
      <span className="absolute left-[12%] bottom-[12%] text-2xl animate-float-slow">🎉</span>
      <span className="absolute right-[8%] bottom-[22%] text-3xl animate-float">🎈</span>
      <span className="absolute left-[22%] top-[45%] hidden text-2xl animate-float sm:inline-block">🧸</span>
      <span className="absolute right-[20%] bottom-[8%] hidden text-2xl animate-float-slow sm:inline-block">🚗</span>
    </div>
  );
}
