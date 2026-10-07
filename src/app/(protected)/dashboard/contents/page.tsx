import ContentsPage from "./ContentsPage"


type Props = {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function Page({ searchParams }: Props) {
  const { page } = await searchParams

  return <ContentsPage page={page ?? 'home'} />
}