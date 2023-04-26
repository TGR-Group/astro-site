<script lang="ts">
  import type { CollectionEntry } from 'astro:content'
  import { format } from 'date-fns'
  import queryString from 'query-string'
  import { z } from 'zod'
  export let posts: CollectionEntry<'blog'>[]

  const pages = Math.ceil(posts.length / 6)
  let page: number = 1

  const chPage = (p: number) => {
    if (typeof window === 'undefined') return
    page = p
    const url = queryString.parseUrl(window.location.href, {parseFragmentIdentifier: true})
    if (p == 1) {
      delete url.query.page
    } else {
      url.query.page = `${p}`
    }
    window.history.pushState({}, '', queryString.stringifyUrl(url))
    window.scroll({ top: 0, behavior: 'smooth' })
  }

  if (typeof window !== 'undefined') {
    const p = Number(queryString.parse(window.location.search).page)
    const pageSchema = z.number().int().min(2).max(pages)
    if (pageSchema.safeParse(p).success) {
      page = p
    } else {
      page = 1
      const url = queryString.parseUrl(window.location.href, {parseFragmentIdentifier: true})
      delete url.query.page
      window.history.replaceState({}, '', queryString.stringifyUrl(url))
    }
  }
</script>

<ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
  {#each posts.slice(6 * (page - 1), 6 * page) as post}
  <li>
    <div class="card shadow bg-white">
      <figure class="w-full aspect-[1200/630] bg-primary-content bg-no-repeat bg-center bg-[length:3rem_3rem]" style="background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBjbGFzcz0idy02IGgtNiI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMi4yNSAxNS43NWw1LjE1OS01LjE1OWEyLjI1IDIuMjUgMCAwMTMuMTgyIDBsNS4xNTkgNS4xNTltLTEuNS0xLjVsMS40MDktMS40MDlhMi4yNSAyLjI1IDAgMDEzLjE4MiAwbDIuOTA5IDIuOTA5bS0xOCAzLjc1aDE2LjVhMS41IDEuNSAwIDAwMS41LTEuNVY2YTEuNSAxLjUgMCAwMC0xLjUtMS41SDMuNzVBMS41IDEuNSAwIDAwMi4yNSA2djEyYTEuNSAxLjUgMCAwMDEuNSAxLjV6bTEwLjUtMTEuMjVoLjAwOHYuMDA4aC0uMDA4VjguMjV6bS4zNzUgMGEuMzc1LjM3NSAwIDExLS43NSAwIC4zNzUuMzc1IDAgMDEuNzUgMHoiIC8+PC9zdmc+Cg==);">
        <img src={`/blog/og/${post.slug}.png`} alt={`image_${post.slug}`} />
      </figure>
      <div class="card-body">
        <a href={`/blog/posts/${post.slug}`}>
          <h2 class="card-title text-3xl font-bold">{post.data.title}</h2>
        </a>
        <div class="inline-block">
          {#each post.data.tags as tag}
          <a href={`/blog/tags/${tag}`} class="mr-3"># {tag}</a>
          {/each}
        </div>
        <a href={`/blog/author/${String(post.data.author)}`} class="mt-5 w-fit">
          <div class="flex gap-3 w-fit">
            <div class="flex-none avatar">
              <div class="w-10 h-10 rounded-full">
                <img src={`https://github.com/${String(post.data.author)}.png`} alt={`avatar_${String(post.data.author)}`} />
              </div>
            </div>
            <div class="flex-none text-sm">
              <p>{post.data.author}</p>
              <p>{format(post.data.pubDate, 'MMM dd, yyyy')}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </li>
  {/each}
</ul>
{#if pages > 1}
<div class="text-center">
  <div class="btn-group my-6">
    {#each Array.from({length: pages}, (_, k) => k + 1) as p}
      <button class={`btn${p == page ? ' btn-active' : ''}`} on:click={() => chPage(p)}>{p}</button>
    {/each}
  </div>
</div>
{/if}
