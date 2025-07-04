
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.GOOGLE_API_KEY;
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CX || import.meta.env.GOOGLE_CX;

export const fetchImageFromGoogle = async (query: string): Promise<string | null> => {
  console.log("[GoogleSearch] API Key exists:", !!GOOGLE_API_KEY);
  console.log("[GoogleSearch] CX exists:", !!GOOGLE_CX);
  
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.log("Google API credentials missing - GOOGLE_API_KEY:", !!GOOGLE_API_KEY, "GOOGLE_CX:", !!GOOGLE_CX);
    return null;
  }

  try {
    // Extract just the CX ID if it's a full URL
    let cxId = GOOGLE_CX;
    if (cxId.includes('cx=')) {
      const parts = cxId.match(/cx=([a-zA-Z0-9]+)/);
      if (parts && parts[1]) cxId = parts[1];
      else cxId = cxId.split('cx=')[1]?.split('&')[0] || cxId;
    }
    
    // Clean up the query for better search results
    const cleanQuery = query
      .replace(/[^\w\s]/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${cxId}&searchType=image&q=${encodeURIComponent(cleanQuery)}&safe=active&num=10&imgSize=large&imgType=photo&fileType=jpg,png,jpeg,webp`;
    
    console.log("[GoogleSearch] Searching for:", cleanQuery);
    console.log("[GoogleSearch] Search URL:", searchUrl.replace(GOOGLE_API_KEY, 'API_KEY_HIDDEN'));

    const res = await fetch(searchUrl);
    if (!res.ok) {
      const err = await res.text();
      console.error("[GoogleSearch] HTTP error:", res.status, res.statusText, err);
      return null;
    }

    const data = await res.json();
    console.log("[GoogleSearch] Search response:", data);

    if (data.items && data.items.length > 0) {
      // Try to find a working image
      for (let i = 0; i < Math.min(data.items.length, 5); i++) {
        const item = data.items[i];
        if (item.link) {
          try {
            // Test if the image URL is accessible
            const testResponse = await fetch(item.link, { method: 'HEAD' });
            if (testResponse.ok) {
              console.log("[GoogleSearch] Selected working image:", item.link);
              return item.link;
            }
          } catch (e) {
            console.log("[GoogleSearch] Image not accessible:", item.link);
            continue;
          }
        }
      }
      
      // If no images are accessible, return the first one anyway
      const fallbackUrl = data.items[0].link;
      console.log("[GoogleSearch] Using fallback image:", fallbackUrl);
      return fallbackUrl;
    }
    
    console.log("[GoogleSearch] No results found for:", cleanQuery);
    return null;
  } catch (e) {
    console.error("[GoogleSearch] Exception:", e);
    return null;
  }
};

// Generate image using Unsplash with better keyword extraction
export const generateAIImage = async (prompt: string): Promise<string | null> => {
  try {
    // Extract keywords and create a more specific search
    const keywords = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter(word => word.length > 2 && !['and', 'the', 'for', 'with', 'about'].includes(word))
      .slice(0, 3)
      .join(',');

    // Use Unsplash with better parameters
    const unsplashUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(keywords)}&orientation=landscape&fit=crop&q=80`;
    console.log("[AIImage] Using Unsplash with keywords:", keywords);
    console.log("[AIImage] Unsplash URL:", unsplashUrl);

    return unsplashUrl;
  } catch (error) {
    console.error("[AIImage] Exception:", error);
    return null;
  }
};
