<template>
  <div>
    <div>
      <h1 class="text-center text-2xl mb-10 font-bold">アプリ開発のコースに挑戦しましょう</h1>
      <input 
        type="text"
        placeholder="keyword"
        class="block border-4 text-black py-2 mx-auto font-mono w-full px-2 mb-8"
        v-model="keyword"
      >
      <Set 
        v-for="setId in setIds"
        :key="setId"
        :id="setId"
        mode="main"
      />
    </div>
  </div>
</template>

<script>
import Set from '@/components/Set'
import Vue2Filters from 'vue2-filters'
import { db } from '@/main'
export default {
  metaInfo: {
    title: 'コース一覧 | skills: プログラミング初級者のためのブートキャンプ',
    description: 'skillsは、プログラミング初級者のためのミニ・チュートリアルを利用＆販売できるサイトです。'
  },
  components: {
    Set
  },
  data() {
    return {
      setIds: [],
      limit: 10,
      step: 3,
      keyword: '',
      lastSet: {}
    }
  },
  created() {
    db.collection('sets').where('private','==',false).orderBy('updatedAt','desc').limit(this.limit).get()
    .then(sets => {
      sets.forEach(set => {
        this.setIds.push(set.id)
      });
      this.lastSet = sets.docs[sets.docs.length-1];
    })
  },
  methods: {
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight
        if (bottomOfWindow) {
          this.loadSets()
        }
      }
    },
    loadSets() {
      db.collection('sets').where('private','==',false).orderBy('updatedAt','desc').startAfter(this.lastSet).limit(this.step).get()
      .then(sets => {
        sets.forEach(set => {
          this.setIds.push(set.id)
        })
        this.lastSet = sets.docs[sets.docs.length-1];
      })
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>