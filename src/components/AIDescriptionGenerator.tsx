import { useState } from "react";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const tones = ["Professional", "Exciting", "Casual"];

interface AIDescriptionGeneratorProps {
  onGenerated: (description: string) => void;
}

const AIDescriptionGenerator = ({ onGenerated }: AIDescriptionGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = async () => {
    if (!topic.trim() || !audience.trim()) {
      toast.error("Please fill in Event Topic and Target Audience.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-description", {
        body: { topic: topic.trim(), audience: audience.trim(), tone },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.description) {
        onGenerated(data.description);
        setHasGenerated(true);
        toast.success("Description generated!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:col-span-2 surface-card p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">AI Description Generator</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          placeholder="Event Topic (e.g. Digital Marketing)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          maxLength={100}
          className="h-10 px-3 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <input
          placeholder="Target Audience (e.g. Startup founders)"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          maxLength={100}
          className="h-10 px-3 bg-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="h-10 px-3 bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {tones.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="h-9 px-4 btn-primary rounded-lg text-xs font-semibold flex items-center gap-2 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> Generate with AI ✨
            </>
          )}
        </button>

        {hasGenerated && !loading && (
          <button
            type="button"
            onClick={generate}
            className="h-9 px-3 btn-secondary rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all hover:bg-secondary/80"
          >
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
        )}
      </div>
    </div>
  );
};

export default AIDescriptionGenerator;
