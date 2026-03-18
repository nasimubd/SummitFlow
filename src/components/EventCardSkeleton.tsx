const EventCardSkeleton = () => (
  <div className="surface-card p-5 animate-pulse">
    <div className="aspect-video w-full bg-secondary rounded-xl mb-4" />
    <div className="h-5 w-3/4 bg-secondary rounded mb-3" />
    <div className="space-y-2">
      <div className="h-4 w-1/2 bg-secondary rounded" />
      <div className="h-4 w-2/3 bg-secondary rounded" />
      <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] mt-4 flex justify-between">
        <div className="h-4 w-24 bg-secondary rounded" />
        <div className="h-4 w-12 bg-secondary rounded" />
      </div>
    </div>
  </div>
);

export default EventCardSkeleton;
