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

