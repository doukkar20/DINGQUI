export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="grid gap-4 text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
        <p className="text-sm text-muted">Loading DINGQI GROS</p>
      </div>
    </div>
  );
}
