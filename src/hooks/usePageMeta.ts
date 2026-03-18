import { useEffect } from "react";

const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | EventFlow AI`;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = meta?.content;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;

    return () => {
      document.title = prev;
      if (meta && prevDesc !== undefined) meta.content = prevDesc ?? "";
    };
  }, [title, description]);
};

export default usePageMeta;
