import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-[rgba(255,255,255,0.05)] mt-20">
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground">
          EventFlow <span className="text-primary">AI</span>
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} EventFlow AI. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
