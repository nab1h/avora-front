'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, FileImage, ImageIcon, Images, Layers3, PencilLine, Plus, Save, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useCreateContentMutation,
  useDeleteContentMutation,
  useGetContentsQuery,
  useUpdateContentMutation,
} from '@/lib/services/contents-api'
import { useGetGalleryQuery, type Gallery } from '@/lib/services/gallery'
import { ContentsPageSkeleton } from '@/components/contents-page-skeleton'

const storageUrl = (
  process.env.NEXT_PUBLIC_STORAGE_URL ??
  `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ?? 'http://localhost:8000'}/storage`
).replace(/\/+$/, '')

function getContentImageUrl(value: string | null) {
  if (!value) return ''

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      if (!url.port && ['localhost', '127.0.0.1'].includes(url.hostname)) {
        url.host = new URL(storageUrl).host
      }
      return url.toString()
    } catch {
      return value
    }
  }

  return `${storageUrl}/${value.replace(/^\/+/, '').replace(/^storage\/+/, '')}`
}

function getMutationErrorMessage(error: unknown, fallbackMessage: string) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = error.data
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message
    }
  }

  return fallbackMessage
}

type ContentType = 'text' | 'textarea' | 'image' | 'url' | 'number' | 'boolean'

type Content = {
  id: number
  page: string
  section: string
  key: string
  value: string | null
  type: ContentType
  gallery_id: number | null
  gallery_item?: Pick<Gallery, 'id' | 'image'> | null
  sort_order: number
}

type Props = {
  page: string
}

type NewContentState = {
  section: string
  key: string
  type: ContentType
  value: string
  galleryId: number | null
}

const initialNewContent: NewContentState = {
  section: 'general',
  key: '',
  type: 'text',
  value: '',
  galleryId: null,
}

const contentTypeOptions: { value: ContentType; label: string }[] = [
  { value: 'text', label: 'text' },
  { value: 'textarea', label: 'textarea' },
  { value: 'url', label: 'url' },
  { value: 'number', label: 'number' },
  { value: 'boolean', label: 'boolean' },
  { value: 'image', label: 'image' },
]

export default function ContentsPage({ page }: Props) {
  const t = useTranslations('contents')
  const { data, isLoading, refetch } = useGetContentsQuery({ page })
  const { data: gallery = [], isLoading: isGalleryLoading } = useGetGalleryQuery()
  const [createContent, { isLoading: isCreating }] = useCreateContentMutation()
  const [updateContent, { isLoading: isUpdating }] = useUpdateContentMutation()
  const [deleteContent, { isLoading: isDeletingContent }] = useDeleteContentMutation()
  const [newContent, setNewContent] = useState<NewContentState>(initialNewContent)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null)
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false)
  const [galleryPickerTarget, setGalleryPickerTarget] = useState<'create' | 'edit'>('create')
  const [sectionToDelete, setSectionToDelete] = useState<{ name: string; contents: Content[] } | null>(null)

  const contents: Content[] = useMemo(() => data?.data ?? [], [data?.data])
  const selectedNewGalleryItem = gallery.find((item) => item.id === newContent.galleryId)
  const selectedEditingGalleryItem = gallery.find((item) => item.id === editingGalleryId)
  const pageNameKey = page.trim().toLowerCase().replace(/[\s-]+/g, '_')
  const displayPage = t.has(`pageNames.${pageNameKey}`)
    ? t(`pageNames.${pageNameKey}`)
    : page.replace(/[-_]/g, ' ')

  const sections = useMemo(
    () =>
      contents.reduce<Record<string, Content[]>>((acc, content) => {
        if (!acc[content.section]) {
          acc[content.section] = []
        }

        acc[content.section].push(content)
        return acc
      }, {}),
    [contents]
  )

  const handleCreate = async () => {
    if (!newContent.key.trim()) return

    const payloadValue =
      newContent.type === 'image'
        ? null
        : newContent.type === 'boolean'
          ? newContent.value === 'true' || newContent.value === '1'
            ? '1'
            : '0'
          : newContent.value

    if (newContent.type === 'image' && !newContent.galleryId) {
      toast.error(t('toast.chooseImage'))
      return
    }

    try {
      await createContent({
        page,
        section: newContent.section || 'general',
        key: newContent.key.trim(),
        type: newContent.type,
        value: payloadValue,
        gallery_id: newContent.type === 'image' ? newContent.galleryId : null,
      }).unwrap()

      toast.success(t('toast.created'))
      setNewContent(initialNewContent)
      refetch()
    } catch (error) {
      toast.error(getMutationErrorMessage(error, t('toast.saveFailed')))
    }
  }

  const getDefaultEditValue = (type: ContentType, currentValue?: string | null) => {
    if (type === 'boolean') {
      return currentValue === '1' || currentValue === 'true' ? 'true' : 'false'
    }

    return currentValue ?? ''
  }

  const startEdit = (content: Content) => {
    setEditingId(content.id)
    setEditingValue(getDefaultEditValue(content.type, content.value))
    setEditingGalleryId(content.gallery_id)
  }

  const handleSaveEdit = async (content: Content) => {
    if (content.type === 'image' && !editingGalleryId) {
      toast.error(t('toast.chooseImage'))
      return
    }

    const payloadValue =
      content.type === 'image'
        ? undefined
        : content.type === 'boolean'
          ? editingValue === 'true' || editingValue === '1'
            ? '1'
            : '0'
          : editingValue

    try {
      await updateContent({
        id: content.id,
        value: payloadValue,
        gallery_id: content.type === 'image' ? editingGalleryId : undefined,
      }).unwrap()

      toast.success(t('toast.updated'))
      setEditingId(null)
      setEditingGalleryId(null)
      refetch()
    } catch (error) {
      toast.error(getMutationErrorMessage(error, t('toast.saveFailed')))
    }
  }

  const handleDeleteSection = async () => {
    if (!sectionToDelete) return

    let deletedCount = 0

    try {
      for (const content of sectionToDelete.contents) {
        await deleteContent(content.id).unwrap()
        deletedCount += 1
      }

      toast.success(t('toast.deletedSection', { name: sectionToDelete.name }))
      setSectionToDelete(null)
      refetch()
    } catch (error) {
      const sectionName = sectionToDelete.name
      const totalCount = sectionToDelete.contents.length
      setSectionToDelete(null)
      refetch()

      if (deletedCount > 0) {
        toast.error(t('toast.partialDelete', { deletedCount, totalCount, name: sectionName }))
        return
      }

      toast.error(getMutationErrorMessage(error, t('toast.deleteFailed')))
    }
  }

  const renderNewValueField = () => {
    if (newContent.type === 'image') {
      return (
        <div className='space-y-2'>
          <Button type='button' variant='outline' className='w-full justify-start' onClick={() => openGalleryPicker('create')}>
            <Images className='mr-2 size-4' />
            {selectedNewGalleryItem ? t('gallery.changeImage') : t('gallery.chooseImage')}
          </Button>
          {selectedNewGalleryItem && (
            <div className='relative aspect-video overflow-hidden rounded-md border bg-muted/30'>
              <Image
                src={getContentImageUrl(selectedNewGalleryItem.image)}
                alt={t('gallery.selectedImage')}
                fill
                sizes='(max-width: 768px) 100vw, 320px'
                unoptimized
                className='object-cover'
              />
            </div>
          )}
        </div>
      )
    }

    if (newContent.type === 'textarea') {
      return (
        <Textarea
          placeholder={t('enterContent')}
          value={newContent.value}
          onChange={(event) => setNewContent({ ...newContent, value: event.target.value })}
          rows={3}
          className='min-h-10 resize-y'
        />
      )
    }

    if (newContent.type === 'boolean') {
      return (
        <select
          value={newContent.value || 'true'}
          onChange={(event) => setNewContent({ ...newContent, value: event.target.value })}
          className='h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30'
        >
          <option value='true'>{t('true')}</option>
          <option value='false'>{t('false')}</option>
        </select>
      )
    }

    return (
      <Input
        type={newContent.type === 'number' ? 'number' : newContent.type === 'url' ? 'url' : 'text'}
        placeholder={newContent.type === 'url' ? 'https://' : t('enterContent')}
        value={newContent.value}
        onChange={(event) => setNewContent({ ...newContent, value: event.target.value })}
      />
    )
  }

  const openGalleryPicker = (target: 'create' | 'edit') => {
    setGalleryPickerTarget(target)
    setIsGalleryPickerOpen(true)
  }

  const handleGallerySelect = (item: Gallery) => {
    if (galleryPickerTarget === 'create') {
      setNewContent((current) => ({ ...current, galleryId: item.id }))
    } else {
      setEditingGalleryId(item.id)
    }

    setIsGalleryPickerOpen(false)
  }

  const renderField = (
    type: ContentType,
    value: string,
    onChange: (nextValue: string) => void,
    disabled?: boolean
  ) => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={5}
            disabled={disabled}
            className='min-h-[120px] resize-none'
          />
        )
      case 'number':
        return (
          <Input
            type='number'
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
          />
        )
      case 'url':
        return (
          <Input
            type='url'
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
          />
        )
      case 'boolean':
        return (
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-ring'
          >
            <option value='true'>{t('true')}</option>
            <option value='false'>{t('false')}</option>
          </select>
        )
      case 'image':
        return (
          <div className='space-y-3'>
            {(selectedEditingGalleryItem?.image ?? value) && (
              <div className='overflow-hidden rounded-lg border bg-muted/20'>
                <Image
                  src={getContentImageUrl(selectedEditingGalleryItem?.image ?? value)}
                  alt={t('gallery.preview')}
                  width={600}
                  height={260}
                  unoptimized
                  className='h-44 w-full object-cover'
                />
              </div>
            )}
            <Button type='button' variant='outline' className='w-full justify-start' disabled={disabled} onClick={() => openGalleryPicker('edit')}>
              <Images className='mr-2 size-4' />
              {selectedEditingGalleryItem ? t('gallery.changeImage') : t('gallery.chooseImage')}
            </Button>
          </div>
        )
      default:
        return (
          <Input
            type='text'
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
          />
        )
    }
  }

  if (isLoading) {
    return <ContentsPageSkeleton page={page} />
  }

  return (
    <div className='space-y-6 p-3 md:p-6'>
      <header className='flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end'>
        <div className='flex items-center gap-3'>
          <div>
            <h1 className='mt-1 text-2xl font-semibold'>{displayPage}</h1>
          </div>
        </div>
        <div className='flex items-center gap-5 text-sm'>
          <div>
            <span className='font-semibold tabular-nums'>{contents.length}</span>
            <span className='ml-1.5 text-muted-foreground'>{t('items')}</span>
          </div>
          <div className='h-6 w-px bg-border' />
          <div>
            <span className='font-semibold tabular-nums'>{Object.keys(sections).length}</span>
            <span className='ml-1.5 text-muted-foreground'>{t('sections')}</span>
          </div>
        </div>
      </header>

      <section className='overflow-hidden rounded-lg border bg-card'>
        <div className='flex items-center gap-3 border-b bg-muted/30 px-4 py-3.5'>
          <div className='flex size-8 items-center justify-center rounded-md bg-background text-foreground shadow-sm'>
            <Plus className='size-4' />
          </div>
          <div>
            <h2 className='text-sm font-semibold'>{t('addContent')}</h2>
            <p className='text-xs text-muted-foreground'>{t('createFieldForPage')}</p>
          </div>
        </div>

        <div className='grid gap-x-4 gap-y-3 p-4 sm:grid-cols-2 xl:grid-cols-4'>
          <label className='space-y-1.5 text-xs font-medium text-muted-foreground'>
            {t('section')}
            <Input
              placeholder={t('sectionPlaceholder')}
              value={newContent.section}
              onChange={(event) => setNewContent({ ...newContent, section: event.target.value })}
              className='text-sm text-foreground'
            />
          </label>
          <label className='space-y-1.5 text-xs font-medium text-muted-foreground'>
            {t('fieldName')}
            <Input
              placeholder={t('fieldNamePlaceholder')}
              value={newContent.key}
              onChange={(event) => setNewContent({ ...newContent, key: event.target.value })}
              className='text-sm text-foreground'
            />
          </label>
          <label className='space-y-1.5 text-xs font-medium text-muted-foreground'>
            {t('fieldType')}
            <select
              value={newContent.type}
              onChange={(event) =>
                setNewContent({
                  ...newContent,
                  type: event.target.value as ContentType,
                  value: event.target.value === 'boolean' ? 'true' : '',
                  galleryId: null,
                })
              }
              className='h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30'
            >
              {contentTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(`types.${option.label}`)}
                </option>
              ))}
            </select>
          </label>
          <div className='space-y-1.5 text-xs font-medium text-muted-foreground'>
            {newContent.type === 'image' ? t('galleryImage') : t('value')}
            {renderNewValueField()}
          </div>
          <div className='flex justify-end sm:col-span-2 xl:col-span-4'>
            <Button onClick={handleCreate} disabled={isCreating || !newContent.key.trim()}>
              <Plus className='mr-2 size-4' />
              {isCreating ? t('saving') : t('addField')}
            </Button>
          </div>
        </div>
      </section>

      <section className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-base font-semibold'>{t('pageContent')}</h2>
            <p className='mt-0.5 text-sm text-muted-foreground'>{t('editValues')}</p>
          </div>
          <span className='text-xs font-medium tabular-nums text-muted-foreground'>
            {contents.length} {t('fields')}
          </span>
        </div>

        <div className='space-y-6'>
        {Object.entries(sections).map(([sectionName, items]) => (
          <section key={sectionName} className='space-y-3'>
            <div className='flex items-center justify-between gap-3 border-b pb-2'>
              <div className='flex min-w-0 items-baseline gap-2'>
                <h3 className='truncate text-sm font-semibold'>{sectionName}</h3>
                <span className='shrink-0 text-xs text-muted-foreground'>{items.length} {t('fields')}</span>
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='shrink-0 text-destructive hover:text-destructive'
                onClick={() => setSectionToDelete({ name: sectionName, contents: items })}
              >
                <Trash2 className='size-4 sm:mr-2' />
                <span className='hidden sm:inline'>{t('deleteSection')}</span>
              </Button>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
          {items.map((content) => {
            const isEditing = editingId === content.id

            return (
              <article key={content.id} className='group min-w-0 overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/20'>
                <div className='flex items-start justify-between gap-3 px-4 py-3.5'>
                  <div className='min-w-0 space-y-1.5'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <span className='rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground'>
                        {t(`types.${content.type}`)}
                      </span>
                      <span className='text-xs text-muted-foreground'>{content.section}</span>
                    </div>
                    <h3 className='truncate text-sm font-semibold capitalize' title={content.key}>
                      {content.key.replace(/_/g, ' ')}
                    </h3>
                  </div>

                  {!isEditing && (
                    <Button variant='ghost' size='sm' onClick={() => startEdit(content)} className='shrink-0'>
                      <PencilLine className='size-4 sm:mr-2' />
                      <span className='hidden sm:inline'>{t('edit')}</span>
                    </Button>
                  )}
                </div>

                {!isEditing ? (
                  <>
                    {content.type === 'image' && (content.gallery_item?.image || content.value) ? (
                      <div className='mx-4 mb-4 overflow-hidden rounded-md border bg-muted/30'>
                        <Image
                          src={getContentImageUrl(content.gallery_item?.image ?? content.value)}
                          alt={content.key}
                          width={700}
                          height={260}
                          unoptimized
                          className='aspect-[16/7] w-full object-cover'
                        />
                      </div>
                    ) : (
                      <div className='mx-4 mb-4 min-h-16 rounded-md bg-muted/30 px-3 py-2.5 text-sm leading-6 text-muted-foreground'>
                        {content.type === 'boolean'
                          ? content.value === '1' || content.value === 'true'
                            ? t('true')
                            : t('false')
                          : content.value ? (
                            <p className='line-clamp-3 whitespace-pre-wrap break-words'>{content.value}</p>
                          ) : (
                            <span className='italic'>{t('noValue')}</span>
                          )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className='space-y-3 border-t bg-muted/10 p-4'>
                    <div className='space-y-1.5 text-xs font-medium text-muted-foreground'>
                      Field type
                      <div className='flex h-10 items-center gap-2 rounded-md border bg-background px-3 text-sm font-normal text-foreground'>
                        <FileImage className='size-4 text-muted-foreground' />
                        {t(`types.${contentTypeOptions.find((option) => option.value === content.type)?.label ?? content.type}`)}
                      </div>
                    </div>

                    {renderField(
                      content.type,
                      editingValue,
                      setEditingValue
                    )}

                    <div className='flex justify-end gap-2 pt-1'>
                      <Button variant='outline' onClick={() => setEditingId(null)}>
                        <X className='mr-2 size-4' />
                        {t('cancel')}
                      </Button>
                      <Button onClick={() => handleSaveEdit(content)} disabled={isUpdating}>
                        <Save className='mr-2 size-4' />
                        {isUpdating ? t('saving') : t('saveChanges')}
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
            </div>
          </section>
        ))}
        </div>
      </section>

      {contents.length === 0 && (
        <div className='flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center'>
          <div className='flex size-11 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm'>
            <ImageIcon className='size-5' />
          </div>
          <p className='mt-3 text-sm font-medium'>{t('noContent')}</p>
          <p className='mt-1 text-sm text-muted-foreground'>{t('newFieldsHint')}</p>
        </div>
      )}

      <Dialog open={isGalleryPickerOpen} onOpenChange={setIsGalleryPickerOpen}>
        <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>{t('chooseImage')}</DialogTitle>
            <DialogDescription>{t('chooseImageDescription')}</DialogDescription>
          </DialogHeader>

          {isGalleryLoading ? (
            <div className='py-12 text-center text-sm text-muted-foreground'>{t('loadingGallery')}</div>
          ) : gallery.length > 0 ? (
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
              {gallery.map((item) => {
                const selectedId = galleryPickerTarget === 'create' ? newContent.galleryId : editingGalleryId
                const isSelected = selectedId === item.id

                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleGallerySelect(item)}
                    aria-label={t('gallery.selectImage', { id: item.id })}
                    aria-pressed={isSelected}
                    className={`group relative aspect-square overflow-hidden rounded-md border-2 bg-muted transition-colors ${
                      isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-foreground/30'
                    }`}
                  >
                    <Image
                      src={getContentImageUrl(item.image)}
                      alt={t('gallery.imageAlt', { id: item.id })}
                      fill
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                      unoptimized
                      className='object-cover'
                    />
                    {isSelected && (
                      <span className='absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow'>
                        <Check className='size-4' />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className='flex min-h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center'>
              <Images className='size-6 text-muted-foreground' />
              <p className='text-sm font-medium'>{t('galleryEmpty')}</p>
              <p className='text-xs text-muted-foreground'>{t('galleryEmptyHint')}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={sectionToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeletingContent) setSectionToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteSectionTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteSectionDescription', { count: sectionToDelete?.contents.length ?? 0, name: sectionToDelete?.name ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingContent}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              disabled={isDeletingContent}
              onClick={(event) => {
                event.preventDefault()
                void handleDeleteSection()
              }}
            >
              <Trash2 className='mr-2 size-4' />
              {isDeletingContent ? t('deleting') : t('deleteSection')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}