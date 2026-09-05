export function GradientGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-purple opacity-30 blur-3xl" />
      <div className="absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-accent-coral opacity-25 blur-3xl" />
      <div className="absolute -bottom-16 left-1/4 h-72 w-72 rounded-full bg-accent-green opacity-20 blur-3xl" />
      <div className="absolute -bottom-12 -right-10 h-56 w-56 rounded-full bg-accent-sky opacity-25 blur-3xl" />
    </div>
  );
}
