export function getPublicAssetUrl(path?: string | null) {
  if (!path) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '');
  const storageUrl = (
    process.env.NEXT_PUBLIC_STORAGE_URL ?? `${apiUrl ?? 'http://localhost:8000'}/storage`
  ).replace(/\/+$/, '');

  if (/^https?:\/\//i.test(path)) {
    try {
      const imageUrl = new URL(path);
      const storageOrigin = new URL(storageUrl);
      if (!imageUrl.port && ['localhost', '127.0.0.1'].includes(imageUrl.hostname)) {
        imageUrl.host = storageOrigin.host;
      }
      return imageUrl.toString();
    } catch {
      return path;
    }
  }

  return `${storageUrl}/${path.replace(/^\/+/, '').replace(/^storage\/+/, '')}`;
}