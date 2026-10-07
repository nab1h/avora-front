export type ContentType =
  | "text"
  | "textarea"
  | "image"
  | "url"
  | "number"
  | "boolean";

export type Content = {
  id: number;
  page: string;
  section: string;
  key: string;
  value: string | null;
  type: ContentType;
  gallery_id: number | null;
  gallery: {
    id: number;
    image: string;
  } | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type PublicContentsResponse = {
  data: Content[];
};

export async function getPublicContents(
  page: string
): Promise<PublicContentsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/contents/${page}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch public contents");
  }

  return response.json();
}