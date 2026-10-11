import ContentsPage from './ContentsPage'

type Props = {
  searchParams: Promise<{ page?: string | string[] }>
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const page = Array.isArray(params.page) ? params.page[0] : params.page

  return <ContentsPage page={page || 'home'} />
}