<template>
  <div>
    <div>
      <h1 class="text-center text-2xl mb-10 font-bold">新しいスキルを獲得しましょう</h1>
      <input 
        type="text"
        placeholder="keyword"
        class="block border-4 text-black py-2 mx-auto font-mono w-full px-2 mb-8"
        v-model="keyword"
        @keypress.enter="$router.push('/tag/' + keyword)"
      >
      <Item 
        v-for="itemId in itemIds"
        :key="itemId"
        :id="itemId"
        mode="main"
      />
    </div>
  </div>
</template>

<script>
import Item from '@/components/Item'
import Vue2Filters from 'vue2-filters'
import { db } from '@/main'
export default {
  metaInfo: {
    title: 'スキル一覧 | skills: プログラミング初級者のためのブートキャンプ',
    description: 'skillsは、プログラミング初級者のためのミニ・チュートリアルを利用＆販売できるサイトです。'
  },
  components: {
    Item
  },
  data() {
    return {
      itemIds: [],
      limit: 3,
      step: 3,
      keyword: '',
      lastItem: {}
    }
  },
  created() {
    db.collection('items').where('private','==',false).orderBy('updatedAt','desc').limit(this.limit).get()
    .then(items => {
      items.forEach(item => {
        this.itemIds.push(item.id)
      });
      this.lastItem = items.docs[items.docs.length-1];
    })
  },
  methods: {
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight
        if (bottomOfWindow) {
          this.loadItems()
        }
      }
    },
    loadItems() {
      db.collection('items').where('private','==',false).orderBy('updatedAt','desc').startAfter(this.lastItem).limit(this.step).get()
      .then(items => {
        items.forEach(item => {
          this.itemIds.push(item.id)
        })
        this.lastItem = items.docs[items.docs.length-1];
      })
    }
  },
  mounted() {
  	this.scroll()
  },
  mixins: [Vue2Filters.mixin]
}
</script>