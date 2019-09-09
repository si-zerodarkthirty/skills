<template>
  <div>
    <div class="mt-24 text-center">
      <p 
        class="mb-5 border-4 border-black p-1 mx-auto font-bold"
        style="width: fit-content"
      >Session. {{ $route.params.num }}</p>
      <h1 class="text-xl font-bold">{{ item.title }}</h1>
      <p class="text-xs">{{ item.updatedAt }}</p>
    </div>
    <div
      class="content mt-12 description"
      v-html="md.render(item.description)"
    ></div>
    <div
      class="content border-b-4 pb-12"
      v-html="md.render(item.content)"
    ></div>
    <vue-disqus
      class="my-12"
      shortname="modules-1"
      :identifier="item.id"
      :url="'https://modulestore.tech/item/' + item.id"
    ></vue-disqus>
  </div>
</template>

<script>
import markdownIt from 'markdown-it';
import sanitizer from 'markdown-it-sanitizer';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import katex from '@iktakahiro/markdown-it-katex';
import hljs from "highlight.js"
import { db } from '@/main'
export default {
  data() {
    return {
      item: {},
      md: new markdownIt({
        highlight(code, lang) {
          return hljs.highlightAuto(code, [lang]).value;
        },
        html: false,
        linkify: true,
        breaks: true,
        xhtmlOut: true,
        typographer: true,
      })
        .use(sanitizer)
        .use(markdownItAnchor, {
          permalink: true,
          permalinkBefore: true,
          permalinkSymbol: '§',
        })
        .use(markdownItTocDoneRight)
        .use(katex, { throwOnError: false, errorColor: ' #cc0000' })
    }
  },
  firestore(){
    return {
      item: db.collection('items').doc(this.$route.params.iid)
    }
  }
}
</script>