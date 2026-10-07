'use client'

import { useEffect, useState } from 'react'
import { FileImage, Save, Trash2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    useCreateSeoPageMutation,
    useDeleteSeoPageMutation,
    useGetSeoPageQuery,
    useGetSeoPagesQuery,
    useUpdateSeoPageMutation,
    type SeoPage as SeoPageRecord,
    type SeoPageInput,
} from '@/lib/services/seo-api'
import { SeoPageSkeleton } from '@/components/seo-page-skeleton'

type Props = {
    page: string
}

type SeoFormValues = Omit<SeoPageInput, 'og_image'>

const storageUrl = (
    process.env.NEXT_PUBLIC_STORAGE_URL ??
    `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ?? 'http://localhost:8000'}/storage`
).replace(/\/+$/, '')

function createEmptyForm(page: string): SeoFormValues {
    return {
        page,
        title: '',
        description: '',
        keywords: '',
        og_title: '',
        og_description: '',
        robots: 'index,follow',
        canonical_url: '',
    }
}

function getSeoImageUrl(image: string | null) {
    if (!image) return ''

    if (/^https?:\/\//i.test(image)) {
        try {
            const url = new URL(image)
            if (!url.port && ['localhost', '127.0.0.1'].includes(url.hostname)) {
                url.host = new URL(storageUrl).host
            }
            return url.toString()
        } catch {
            return image
        }
    }

    return `${storageUrl}/${image.replace(/^\/+/, '').replace(/^storage\/+/, '')}`
}

function getErrorMessage(error: unknown, fallback: string) {
    if (typeof error === 'object' && error !== null && 'data' in error) {
        const data = error.data
        if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
            return data.message
        }
    }

    return fallback
}

function toFormValues(record: SeoPageRecord): SeoFormValues {
    return {
        page: record.page,
        title: record.title ?? '',
        description: record.description ?? '',
        keywords: record.keywords ?? '',
        og_title: record.og_title ?? '',
        og_description: record.og_description ?? '',
        robots: record.robots ?? 'index,follow',
        canonical_url: record.canonical_url ?? '',
    }
}

export default function SeoPage({ page }: Props) {
    const { data: pagesResponse, isLoading: isPagesLoading, isError: isPagesError } = useGetSeoPagesQuery()
    const seoPageFromList = pagesResponse?.data.find((item) => item.page === page)
    const {
        currentData: pageResponse,
        isLoading: isPageLoading,
        isError: isPageError,
    } = useGetSeoPageQuery(seoPageFromList?.id ?? 0, { skip: !seoPageFromList })
    const seoPage = pageResponse?.data ?? seoPageFromList
    const [createSeoPage, { isLoading: isCreating }] = useCreateSeoPageMutation()
    const [updateSeoPage, { isLoading: isUpdating }] = useUpdateSeoPageMutation()
    const [deleteSeoPage, { isLoading: isDeleting }] = useDeleteSeoPageMutation()
    const [draft, setDraft] = useState<{ page: string; values: Partial<SeoFormValues> }>({ page, values: {} })
    const [selectedImage, setSelectedImage] = useState<{ page: string; file: File } | null>(null)
    const [imagePreview, setImagePreview] = useState<{ page: string; url: string } | null>(null)
    const [createMode, setCreateMode] = useState<{ page: string; active: boolean }>({ page, active: false })
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    useEffect(() => {
        const previewUrl = imagePreview?.url
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [imagePreview])

    const isBusy = isCreating || isUpdating || isDeleting
    const isPageNotFound = !isPagesLoading && !isPagesError && !seoPage
    const isCreateMode = createMode.page === page && createMode.active
    const displayPage = page.replace(/[-_]/g, ' ')
    const initialForm = seoPage ? toFormValues(seoPage) : createEmptyForm(page)
    const form = draft.page === page ? { ...initialForm, ...draft.values } : initialForm
    const ogImageFile = selectedImage?.page === page ? selectedImage.file : null
    const localImagePreview = imagePreview?.page === page ? imagePreview.url : null

    const updateField = <K extends keyof SeoFormValues>(field: K, value: SeoFormValues[K]) => {
        setDraft((current) => ({
            page,
            values: {
                ...(current.page === page ? current.values : {}),
                [field]: value,
            },
        }))
    }

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const payload: SeoPageInput = {
            ...form,
            page,
            og_image: ogImageFile,
        }

        try {
            if (seoPage) {
                await updateSeoPage({ id: seoPage.id, data: payload }).unwrap()
                toast.success('SEO settings updated successfully.')
                setSelectedImage(null)
                setImagePreview(null)
            } else {
                await createSeoPage(payload).unwrap()
                toast.success('SEO settings created successfully.')
                setSelectedImage(null)
                setImagePreview(null)
            }
        } catch (error) {
            toast.error(getErrorMessage(error, 'Could not save SEO settings.'))
        }
    }

    const handleDelete = async () => {
        if (!seoPage) return

        try {
            await deleteSeoPage(seoPage.id).unwrap()
            toast.success('SEO settings deleted successfully.')
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast.error(getErrorMessage(error, 'Could not delete SEO settings.'))
        }
    }

    if (isPagesLoading || (seoPageFromList && isPageLoading)) {
        return <SeoPageSkeleton page={page} />
    }

    if (isPagesError || isPageError) {
        return <div role='alert' className='m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive'>Could not load SEO settings. Refresh the page and try again.</div>
    }

    if (isPageNotFound && !isCreateMode) {
        return (
            <div className='m-4 flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-card px-6 text-center'>
                <FileImage className='size-8 text-muted-foreground' />
                <h1 className='mt-4 text-lg font-semibold capitalize'>SEO settings not found for {displayPage}.</h1>
                <p className='mt-1 text-sm text-muted-foreground'>Create SEO settings for this page to manage its metadata.</p>
                <Button className='mt-5' onClick={() => setCreateMode({ page, active: true })}>Create SEO settings</Button>
            </div>
        )
    }

    return (
        <div className='w-full min-w-0 max-w-full space-y-6 overflow-hidden p-3 md:p-6'>
            <header className='flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end'>
                <div className='min-w-0 flex-1'>
                    <p className='text-xs font-semibold uppercase text-muted-foreground'>Search appearance</p>
                    <h1 className='mt-1 text-2xl font-semibold capitalize'>SEO settings · {displayPage}</h1>
                </div>
                <div className='flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto'>
                    {seoPage && (
                        <Button type='button' variant='outline' className='text-destructive hover:text-destructive' onClick={() => setIsDeleteDialogOpen(true)} disabled={isBusy}>
                            <Trash2 className='mr-2 size-4' />
                            Delete
                        </Button>
                    )}
                    <Button type='submit' form='seo-settings-form' disabled={isBusy}>
                        <Save className='mr-2 size-4' />
                        {isCreating ? 'Creating...' : isUpdating ? 'Saving...' : seoPage ? 'Save changes' : 'Create SEO settings'}
                    </Button>
                </div>
            </header>

            <form id='seo-settings-form' onSubmit={submit} className='space-y-6'>
                <section className='min-w-0 overflow-hidden rounded-lg border bg-card'>
                    <div className='border-b bg-muted/30 px-4 py-3.5'>
                        <h2 className='text-sm font-semibold'>Search metadata</h2>
                    </div>
                    <div className='grid gap-4 p-4 md:grid-cols-2'>
                        <label className='space-y-1.5 text-xs font-medium text-muted-foreground'>
                            Page
                            <Input value={displayPage} readOnly disabled className='capitalize text-sm text-foreground' />
                        </label>
                        <label className='space-y-1.5 text-xs font-medium text-muted-foreground'>
                            Title
                            <Input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder='Page title' />
                        </label>
                        <label className='space-y-1.5 text-xs font-medium text-muted-foreground md:col-span-2'>
                            Description
                            <Textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={3} placeholder='Describe this page for search results' />
                        </label>
                        <label className='space-y-1.5 text-xs font-medium text-muted-foreground md:col-span-2'>
                            Keywords
                            <Input value={form.keywords} onChange={(event) => updateField('keywords', event.target.value)} placeholder='keyword one, keyword two' />
                        </label>
                    </div>
                </section>

                <section className='min-w-0 overflow-hidden rounded-lg border bg-card'>
                    <div className='border-b bg-muted/30 px-4 py-3.5'>
                        <h2 className='text-sm font-semibold'>Social sharing</h2>
                    </div>
                    <div className='min-w-0 space-y-4 p-4'>
                        <label className='block min-w-0 space-y-1.5 text-xs font-medium text-muted-foreground'>
                            OG Title
                            <Input value={form.og_title} onChange={(event) => updateField('og_title', event.target.value)} placeholder='Social sharing title' />
                        </label>
                        <label className='block min-w-0 space-y-1.5 text-xs font-medium text-muted-foreground'>
                            OG Description
                            <Textarea value={form.og_description} onChange={(event) => updateField('og_description', event.target.value)} rows={4} placeholder='Social sharing description' />
                        </label>
                        <div className='min-w-0 space-y-2'>
                            <p className='text-xs font-medium text-muted-foreground'>OG Image</p>
                            <label className='flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-dashed bg-muted/30 px-3 py-2 text-sm transition-colors hover:border-foreground/30 hover:bg-muted/50'>
                                <Upload className='size-4 shrink-0 text-muted-foreground' />
                                <span className='min-w-0 text-muted-foreground'>
                                    {ogImageFile?.name ?? (seoPage?.og_image ? 'Replace image' : 'Choose an image')}
                                </span>
                                <span className='shrink-0 text-xs font-medium text-foreground'>Browse</span>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    className='sr-only'
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] ?? null
                                        setSelectedImage(file ? { page, file } : null)
                                        setImagePreview(file ? { page, url: URL.createObjectURL(file) } : null)
                                    }}
                                />
                            </label>
                            {(localImagePreview || seoPage?.og_image) ? (
                                <Image
                                    src={localImagePreview ?? getSeoImageUrl(seoPage?.og_image ?? null)}
                                    alt='Open Graph preview'
                                    width={56}
                                    height={56}
                                    unoptimized
                                    className='size-14 rounded-md border object-cover'
                                />
                            ) : (
                                <div className='flex size-14 items-center justify-center rounded-md border border-dashed bg-muted/20 text-muted-foreground'>
                                    <FileImage className='size-5' />
                                </div>
                            )}
                            {ogImageFile && (
                                <Button type='button' variant='ghost' size='sm' onClick={() => {
                                    setSelectedImage(null)
                                    setImagePreview(null)
                                }}>
                                    <X className='mr-2 size-4' />
                                    Remove selected image
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                <section className='min-w-0 overflow-hidden rounded-lg border bg-card'>
                    <div className='border-b bg-muted/30 px-4 py-3.5'>
                        <h2 className='text-sm font-semibold'>Indexing and canonical URL</h2>
                    </div>
                    <div className='grid gap-4 p-4 md:grid-cols-2'>
                        <label className='space-y-1.5 text-xs font-medium text-muted-foreground'>
                            Robots
                            <Select value={form.robots} onValueChange={(value) => value && updateField('robots', value)}>
                                <SelectTrigger className='h-10 w-full bg-background text-sm font-normal text-foreground'>
                                    <SelectValue placeholder='Choose robots policy' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='index,follow'>index,follow</SelectItem>
                                    <SelectItem value='noindex,follow'>noindex,follow</SelectItem>
                                    <SelectItem value='index,nofollow'>index,nofollow</SelectItem>
                                    <SelectItem value='noindex,nofollow'>noindex,nofollow</SelectItem>
                                </SelectContent>
                            </Select>
                        </label>
                        <label className='space-y-1.5 text-xs font-medium text-muted-foreground'>
                            Canonical URL
                            <Input type='url' value={form.canonical_url} onChange={(event) => updateField('canonical_url', event.target.value)} placeholder='https://example.com/page' />
                        </label>
                    </div>
                </section>
            </form>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete SEO settings?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This removes SEO settings for {displayPage}. It does not delete the page or its content.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant='destructive'
                            disabled={isDeleting}
                            onClick={(event) => {
                                event.preventDefault()
                                void handleDelete()
                            }}
                        >
                            <Trash2 className='mr-2 size-4' />
                            {isDeleting ? 'Deleting...' : 'Delete SEO settings'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}