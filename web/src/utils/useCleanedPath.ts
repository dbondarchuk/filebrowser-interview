import { useMemo } from "react";

export const useCleanedPath = (path: string): {breadcrumbs: string[], cleanedPath: string} => {
    const breadcrumbs = useMemo(() => {
        const parts: string[] = []; 
        // skip leading slash, clean '..' and '.' parts
        for (const part of decodeURIComponent(path.substring(1)).split('/')) {
            if (!part || !part.length || part === '.') {
                continue;
            } else if (part === '..') {
                if (parts.length === 0) return [];
                parts.pop()
            } else {
                parts.push(part)
            }
        }

        return parts;
    }, [path])
    
    const cleanedPath = useMemo(() => breadcrumbs.length > 0 ? '/' + breadcrumbs.map(encodeURIComponent).join('/') : '', [breadcrumbs]);

    return {breadcrumbs, cleanedPath};
}