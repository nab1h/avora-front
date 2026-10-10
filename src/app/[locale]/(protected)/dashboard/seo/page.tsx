import SeoPage from './SeoPage'

type Props = {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function Page({ searchParams }: Props) {
  const { page } = await searchParams

  return <SeoPage page={page ?? 'home'} />
}