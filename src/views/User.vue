<template>
  <div class="flex justify-center flex-wrap">
    <div class="side-content">
      <div
        class="relative w-full h-64 bg-cover bg-center mr-2 border-4 border-black mb-8" 
        :style=" 'background-image: url('+ user.photoURL + ')' "
      >
        <label 
          v-if="isEdit"
          for="imgurl"
          class="absolute imgurl-label -mt-1"
        >アイコンURL</label>
        <input 
          v-if="isEdit"
          type="text"
          name="imgurl"
          v-model="user.photoURL"
          class="absolute py-2 text-center imgurl"
        >
      </div>
      <label 
        v-if="isEdit"
        for="title"
      >ユーザー名</label>
      <input 
        v-if="isEdit"
        type="text"
        placeholder="ユーザー名"
        v-model="user.name"
        class="p-2 w-full font-bold text-center"
      >
      <h1 
        v-if="!isEdit"
        class="text-3xl text-center font-bold"
      >{{ user.name }}</h1>
      <p 
        v-if="!isEdit"
        class="text-xs text-center"
      >{{ published.length + publishedSets.length }}個のアイテムを公開中</p>
      <label 
        v-if="isEdit"
        for="twitter"
        class="mt-2"
      >Twitter ID</label>
      <input 
        v-if="isEdit"
        type="text"
        placeholder="Twitter ID"
        v-model="user.twitter"
        class="p-2 w-full font-bold text-center"
        name="twitter"
      >
      <a :href=" 'http://twitter.com/' + user.twitter " target="_blank" rel="noopener noreferrer">
        <button 
          v-if="!isEdit && user.twitter" 
          class="mx-auto"
        ><fa class="fa-lg" :icon="['fab','twitter']" /></button> 
      </a>
      <div 
        v-if="currentUser && currentUser.uid == user.id"
        class="flex justify-center mt-3"
      >
        <button 
          v-if="!isEdit"
          class="mx-1"
          @click="isEdit = true"
        >情報を編集</button>
        <button 
          v-if="!isEdit"
          class="mx-1"
          @click="signOut"
        >ログアウト</button>
        <button 
          v-if="isEdit"
          class="mx-1"
          @click="saveInfo"
        >保存</button>
        <button
          v-if="isEdit"
          class="mx-1"
          @click="isEdit = false"
        >取消</button>
      </div>
      <nav class="flex mt-10 border-b-2 border-black pb-2">
        <button 
          class="w-24"
          @click="$router.push('/user/' + user.id)"
          :class="{'text-black': $route.path == '/user/' + user.id}"
        >
          <fa icon="feather-alt" class="block mx-auto fa-2x" />
          <p class="text-xs mt-1">公開</p>
        </button>
        <button 
          class="w-24"
          @click="$router.push('/user/' + user.id + '/liked')"
          :class="{'text-black': $route.path == '/user/' + user.id + '/liked'}"
        >
          <fa icon="heart" class="block mx-auto fa-2x" />
          <p class="text-xs mt-1">好き</p>
        </button>
        <button 
          v-if="currentUser && currentUser.uid == user.id"
          class="w-24"
          @click="$router.push('/user/' + user.id + '/private')"
          :class="{'text-black': $route.path == '/user/' + user.id + '/private'}"
        >
          <fa icon="lock" class="block mx-auto fa-2x" />
          <p class="text-xs mt-1">未公開</p>
        </button>
      </nav>
      <router-view />
    </div>
    <Side />
  </div>
</template>

<script>
import Side from '@/components/Side'
import Item from '@/components/Item'
import Set from '@/components/Set'
import Vue2Filters from 'vue2-filters'
import { auth } from '@/main'
import { db } from '@/main'
export default {
  metaInfo () {
    return {
      title: this.user.name + 'さんのページ | skills: プログラミング初級者のためのブートキャンプ',
      description: this.published.length + '個のスキルが' + this.user.name + 'さんによって公開されています。skillsは、プログラミング初級者のためのミニ・チュートリアルを利用＆販売できるサイトです。',
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
          content: 'https://modulestore.tech'
        },
        {
          property: 'og:title',
          content: this.user.name + 'さんのページ | skills: プログラミング初級者のためのブートキャンプ'
        },
        {
          property: 'og:description',
          content: this.published.length + '個のスキルが' + this.user.name + 'さんによって公開されています。skillsは、プログラミング初級者のためのミニ・チュートリアルを利用＆販売できるサイトです。',
        },
        {
          property: 'og:image',
          content: this.user.photoURL
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
      user: {},
      currentUser: {},
      items: [],
      liked: [],
      likedSets: [],
      published: [],
      publishedSets: [],
      priv: [],
      privSets: [],
      isEdit: false,
      selected: 'published',
      skill: true
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user
    });
  },
  firestore() {
    return {
      user: db.collection('users').doc(this.$route.params.uid),
      items: db.collection('items').where('user','==',this.$route.params.uid),
      liked: db.collection('items').where('likes','array-contains',this.$route.params.uid),
      published: db.collection('items').where('user','==',this.$route.params.uid).where('private','==',false),
      likedSets: db.collection('sets').where('likes','array-contains',this.$route.params.uid),
      publishedSets: db.collection('sets').where('user','==',this.$route.params.uid),
      priv: db.collection('items').where('user','==',this.$route.params.uid).where('private','==',true),
      privSets: db.collection('sets').where('user','==',this.$route.params.uid).where('private','==',true),
    }
  },
  mixins: [Vue2Filters.mixin],
  methods: {
    saveInfo() {
      db.collection('users').doc(this.$route.params.uid).set({
        name: this.user.name,
        photoURL: this.user.photoURL,
        twitter: this.user.twitter
      }, {merge: true})
      .then(
        this.$toasted.show('変更を保存しました。', {duration: 1000}),
        this.isEdit = false
      )
    },
    signOut() {
      this.$toasted.show(
        'さようならしますか？', 
        { 
          action : [
            {
              text : 'さようなら',
              onClick: (e,toastObject) => {
                toastObject.goAway(0),
                auth.signOut()
                .then(
                  this.$toasted.show(
                    'また後で！',
                    {duration: 1000}
                  )
                )
              }
            },
            {
              text : 'もう少し頑張る',
              onClick: (e,toastObject) => {
                toastObject.goAway(0)
              }
            }
          ]
        }
      )
    },
  }
}
</script>