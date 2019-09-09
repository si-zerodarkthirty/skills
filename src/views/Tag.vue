<template>
  <div class="flex flex-wrap justify-center">
    <div class="side-content">
      <h1 class="text-center font-bold text-xl"># {{ $route.params.tag }}</h1>
      <nav class="flex my-5">
        <button 
          class="w-1/2 py-5 border-b-2"
          :class="{'text-black border-black': skill}"
            @click="skill=true"
        ><fa icon="cube" class="fa-2x block mx-auto mb-1" />スキル</button>
        <button 
          class="w-1/2 y-5 border-b-2"
          :class="{'text-black border-black': !skill}"
          @click="skill=false"
        ><fa icon="cubes" class="fa-2x block mx-auto mb-1" />コース</button>
      </nav>
      <div v-if="skill">
        <Item 
          v-for="item in items"
          :key="item.id"
          :id="item.id"
          mode="main"
        />
        <button 
          v-if="items.length > limitItem" 
          @click="limitItem += 3"
          class="mx-auto my-2 border-2 border-black p-2"
        >もっとみる</button>
      </div>
      <div v-else>
        <Set 
          v-for="set in sets"
          :key="set.id"
          :id="set.id"
        />
      </div>
    </div>
    <Side />
  </div>
</template>

<script>
import Side from '@/components/Side'
import Item from '@/components/Item'
import Set from '@/components/Set'
import { db } from '@/main'
export default {
  metaInfo () {
    return {
      title: this.$route.params.tag + 'に関するスキル | skills: プログラミング初級者のためのブートキャンプ',
      description: 'skillsは、プログラミング初級者のためのミニ・チュートリアルを利用＆販売できるサイトです。',
      meta: [
        {
          property: 'og:site_name',
          content: 'skills'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:url',
          content: 'https://modulestore.tech/tag/'+this.$route.params.tag
        },
        {
          property: 'og:title',
          content: this.$route.params.tag + 'に関するスキル | skills: プログラミング初級者のためのブートキャンプ'
        },
        {
          property: 'og:description',
          content: ''
        },
        {
          property: 'og:image',
          content: ''
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ]
    }
  },
  components: {
    Item,
    Set,
    Side
  },
  data() {
    return {
      skill: true,
      sets: [],
      items: []
    }
  },
  firestore() {
    return {
      items: db.collection('items').where('keywords','array-contains',this.$route.params.tag).where('private','==',false),
      sets: db.collection('sets').where('keywords','array-contains',this.$route.params.tag).where('private','==',false)
    }
  }
}
</script>