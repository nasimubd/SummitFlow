import { Search } from "lucide-react";

const EmptyEvents = () => (
  <div className="text-center py-20 px-4">
    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-5">
      <Search className="w-7 h-7 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
      Try a different search term or category filter to discover events.
    </p>
  </div>
);

export default EmptyEvents;
