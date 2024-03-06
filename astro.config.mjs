import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";

import { h } from 'hastscript';
import remarkDirective from 'remark-directive';
import rlc from 'remark-link-card'
import { visit } from 'unist-util-visit';

const myRemarkPlugin = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {})
        const hast = h(node.name, node.attributes || {})

        data.hName = hast.tagName
        data.hProperties = hast.properties
      }
    })
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), svelte()],
  markdown: {
    remarkPlugins: [
      [
        rlc,
        {
          shortenUrl: true,
        },
      ],
      remarkDirective,
      myRemarkPlugin,
    ],
  }
});
