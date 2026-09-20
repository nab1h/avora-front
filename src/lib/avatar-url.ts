export function getAvatarUrl(
  avatar: string | null | undefined
): string | undefined {
  if (!avatar) return undefined;

  if (/^https?:\/\//i.test(avatar)) {
    return avatar;
  }

  const path = avatar.replace(/^\/+/, "");
  const storagePath = /^storage\//i.test(path) ? path : `storage/${path}`;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/api\/?$/,
    ""
  );

  if (!apiUrl && typeof window !== "undefined") {
    return `${window.location.origin}/${storagePath}`;
  }

  return apiUrl
    ? `${apiUrl}/${storagePath}`
    : undefined;
}