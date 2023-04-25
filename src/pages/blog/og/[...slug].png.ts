import type { APIContext } from 'astro'
import { getCollection, getEntryBySlug } from 'astro:content'
import { format } from 'date-fns'
import { getOgImage } from '../../../components/OgImage'

export const getStaticPaths = async () => {
  const posts = await getCollection('blog')
  return posts.map(post => ({
    params: { slug: post.slug }
  }))
}

export const get = async ({ params }: APIContext) => {
  if (!params.slug) return
  const post = await getEntryBySlug('blog', params.slug)
  if (!post) return
  const body = await getOgImage(post.data.title, String(post.data.author), format(post.data.pubDate, 'yyyy-MM-dd'), post.data.ogTheme)
  return { body, encoding: 'binary' }
}
