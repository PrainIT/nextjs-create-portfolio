import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { client } from './client'

const { projectId, dataset } = client.config()

const builder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || 'production',
})

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function urlForImage(source: SanityImageSource) {
  return urlFor(source).url()
}

// Sanity 파일 URL 가져오기
export function urlForFile(file: { asset?: { _ref?: string; _type?: string } } | null | undefined): string | null {
  if (!file?.asset?._ref) return null
  
  const ref = file.asset._ref
  const [, id, extension] = ref.split('-')
  
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`
}
