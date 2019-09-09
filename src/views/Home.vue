<template>
  <div class="home flex justify-center flex-wrap">
    <div class="side-content">
      <nav class="flex justify-center mb-10">
        <button 
          class="w-1/3 py-2 border-b-2"
          :class="{'text-black border-black': $route.path == '/'}"
          @click="$router.push('/')"
        ><fa icon="cube" class="fa-2x block mx-auto mb-1" />スキルを獲得</button>
        <button 
          class="w-1/3 py-2 border-b-2"
          :class="{'text-black border-black': $route.path == '/sets'}"
          @click="$router.push('/sets')"
        ><fa icon="cubes" class="fa-2x block mx-auto mb-1" />アプリを開発</button>
        <button 
          class="w-1/3 py-2 border-b-2"
          :class="{'text-black border-black': $route.path == '/requests'}"
          @click="$router.push('/requests')"
        ><fa icon="laugh" class="fa-2x block mx-auto mb-1" />教材をリクエスト</button>
      </nav>
      <router-view />
    </div>
    <Side />
  </div>
</template>

<script>
import Side from '@/components/Side'
export default {
  name: 'home',
  components: {
    Side
  },
  metaInfo: {
    title: 'skills: プログラミング初級者のためのブートキャンプ',
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
          content: 'https://modulestore.tech/'
        },
        {
          property: 'og:title',
          content: 'skills: プログラミング初級者のためのブートキャンプ'
        },
        {
          property: 'og:description',
          content: 'skillsは、プログラミング初級者のためのミニ・チュートリアルを利用＆販売できるサイトです。'
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
}
</script>

<style lang="stylus">
.side-content
  max-width 550px
  width 100%
  margin-bottom 5rem

@media(min-width 1200px)
  .side-content
    max-width 700px
</style>
