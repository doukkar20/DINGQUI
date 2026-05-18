export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="glass-panel metal-border grid w-full max-w-md gap-4 p-6 text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-gray-200 border-t-orange shadow-[0_0_28px_rgba(249,115,22,0.28)]" />
        <div className="grid gap-2">
          <div className="mx-auto h-3 w-40 animate-pulse rounded-full bg-gray-200" />
          <div className="mx-auto h-3 w-28 animate-pulse rounded-full bg-orange/20" />
        </div>
      </div>
    </div>
  );
}
