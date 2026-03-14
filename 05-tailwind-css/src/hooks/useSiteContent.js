import { useCallback, useEffect, useState } from 'react';
import { loadSiteContent, resetSiteContent, updateSiteContent } from '../utils/siteContent';

export const useSiteContent = () => {
  const [content, setContent] = useState(() => loadSiteContent());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUpdate = () => setContent(loadSiteContent());
    window.addEventListener('siteContentUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('siteContentUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const saveContent = useCallback((nextContent) => {
    const contentValue = typeof nextContent === 'function'
      ? nextContent(content)
      : nextContent;
    const updated = updateSiteContent(contentValue);
    setContent(updated);
    return updated;
  }, [content]);

  const resetContent = useCallback(() => {
    const updated = resetSiteContent();
    setContent(updated);
    return updated;
  }, []);

  return {
    content,
    saveContent,
    resetContent
  };
};
