<template>
  <div>
    <div
      class="relative w-full h-64 bg-cover bg-center mr-2 border-4 border-black mt-20 mb-8" 
      :style=" 'background-image: url('+ set.thumbnail + ')' "
    >
      <label 
        v-if="isEdit"
        for="imgurl"
        class="absolute imgurl-label -mt-1"
      >サムネイルURL (任意)</label>
      <input 
        v-if="isEdit"
        type="text"
        name="imgurl"
        v-model="set.thumbnail"
        class="absolute py-2 text-center imgurl"
      >
    </div>
    <label 
      v-if="isEdit"
      for="title"
    >タイトル</label>
    <input 
      v-if="isEdit"
      type="text"
      placeholder="タイトル"
      v-model="set.title"
      class="p-2 w-full font-bold text-center"
    >
    <h1 
      v-else
      class="text-center text-xl font-bold mb-2"
    >{{ set.title }}</h1>
    <label 
      for="description"
      v-if="isEdit"
    >価格 - 0〜10000円</label>
    <input 
      type="text" 
      placeholder="円"
      v-if="isEdit"
      class="p-2 w-64"
      v-model="set.price"
    >
    <label 
      v-if="isEdit"
      for="keyword"
    >キーワード (任意)</label>
    <input 
      v-if="isEdit"
      name="keyword"
      type="text"
      placeholder="新しいキーワード"
      v-model="keyword"
      class="p-2 w-64"
      @keypress.enter="addTag"
    >
    <div 
      v-if="isEdit"
      class="flex my-5"
    >
      <li 
        v-for="(tag,idx) in keywords"
        :key="idx"
        class="list-none mb-2 mr-2 text-sm bg-gray-200 p-1 rounded"
      >{{ tag }} 
        <span 
          class="ml-2 cursor-pointer"
          @click="removeTag(idx)"
        >
          <fa 
            icon="times"
          />
        </span>
      </li>
    </div>
    <div 
      v-else
      class="flex justify-center"
    >
      <button
        v-for="(tag,idx) in set.keywords"
        :key="idx"
        class="list-none mb-2 mr-2 text-sm"
        @click="$router.push('/tag/'+tag)"
      ># {{ tag }}</button>
    </div>
    <div class="flex justify-between mt-10">
      <User
        :uid="set.user"
        :updatedAt="set.updatedAt" 
      />
      <div class="relative">
        <button 
          class="w-8 h-8 border-2 border-black rounded-full"
          @click="isMenuOpen = !isMenuOpen"
        >
          <fa 
            v-if="isMenuOpen"
            icon="times" 
          />
          <fa 
            v-else
            icon="ellipsis-v" 
          />
        </button>
        <div 
          class="shadow-lg controls absolute bg-white text-center"
          v-if="isMenuOpen"
        >
          <button 
            class="p-2"
            @click="isEdit = true"
            v-if="!isEdit && currentUser && currentUser.uid == set.user"
          >コースを編集</button>
          <button 
            class="p-2"
            @click="deleteSet"
            v-if="!isEdit && set.private && currentUser && currentUser.uid == set.user"
          >コースを削除</button>
          <button 
            class="p-2"
            @click="publishSet"
            v-if="isEdit"
          >更新して公開</button>
          <button 
            class="p-2"
            @click="isEdit = false"
            v-if="isEdit"
          >編集を取消</button>
        </div>
      </div>
    </div>
    <div 
      class="flex justify-between mt-12"
      v-if="isEdit"
    >
      <label 
        for="description"
      >概要 - markdown</label>
      <button 
        class="mt-2"
        @click="isOpenDesc = true"
      >エディタを起動</button>
    </div>
    <textarea
      v-if="isEdit"
      v-model="set.description"
      class="p-2 font-mono"
      name="description"
      @keydown.9="addTabSpace"
    ></textarea>
    <div
      v-else
      class="content mt-12 content"
      v-html="md.render(set.description)"
    ></div>
    <div 
      class="fixed top-0 bottom-0 left-0 w-full bg-white z-50"
      v-if="isOpenDesc"
    >
      <button 
        class="fixed top-0 right-0 p-3"
        @click="isOpenDesc = false"
      >もどる</button>
      <p class="fixed top-0 left-0 p-3">概要</p>
      <div class="flex editor">
        <textarea
          v-model="set.description"
          class="w-1/2 px-3 py-10 font-mono"
          name="description"
          @keydown.9="addTabSpace"
        ></textarea>
        <div 
          class="w-1/2 p-3 content py-10"
          v-html="md.render(set.description)"
        ></div>
      </div>
    </div>
    <div 
      v-if="set.items.length > 0 && !isEdit"
      class="my-12"
    >
      <h2 class="text-center font-bold text-lg">{{ set.items.length }}つのセッション</h2>
      <Item
        v-for="item in orderBy(set.items,'num')"
        :key="item.id"
        :id="item.id"
        :num="item.num"
        :sid="set.id"
        mode="session"
      />
    </div>
    <div v-if="isEdit">
      <label 
        v-if="isEdit"
        for="title"
      >
        スキル登録・並べ替え - drag & dropで並べ替え
      </label>
      <input 
        v-if="isEdit"
        type="text"
        placeholder="スキルIDを入力しEnterで追加"
        v-model="itemId"
        @keypress.enter="addItem"
        class="p-2 w-full"
      >
      <draggable @end="onEnd">
        <Item
          v-for="item in orderBy(items,'num')"
          :key="item.id"
          :id="item.id"
          :num="item.num"
          mode="editor"
          remove="true"
          @removeItem="onRemoveItem"
          class="cursor-move"
        />
      </draggable>
    </div>
    <vue-disqus
      class="mt-24"
      shortname="modules-1"
      :identifier="set.id"
      :url="'https://modulestore.tech/set/' + set.id"
    ></vue-disqus>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import firebase from 'firebase'
import SetItem from '@/components/SetItem'
import Item from '@/components/Item'
import User from '@/components/User'
import { auth } from '@/main'
import { db } from '@/main'
import markdownIt from 'markdown-it'
import sanitizer from 'markdown-it-sanitizer'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import katex from '@iktakahiro/markdown-it-katex'
import hljs from "highlight.js"
import Vue2Filters from 'vue2-filters'
export default {
  metaInfo () {
    return {
      title: this.set.title + ' - ' + this.user.name + 'さんが公開 | skills: プログラミング初級者のためのブートキャンプ',
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
          content: 'https://modulestore.tech'
        },
        {
          property: 'og:title',
          content: this.set.title + ' | skills: プログラミング初級者のためのブートキャンプ'
        },
        {
          property: 'og:description',
          content: this.set.description
        },
        {
          property: 'og:image',
          content: this.set.thumbnail
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
    SetItem,
    User,
    draggable
  },
  data() {
    return {
      isMenuOpen: false,
      isOpenDesc: false,
      isOpenCont: false,
      isEdit: false,
      isLiked: false,
      set: {},
      keyword: '',
      keywords: [],
      itemId: '',
      items: [],
      allItems: [],
      currentUser: {},
      user: {},
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
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      db.collection('sets').doc(this.$route.params.id)
      .onSnapshot((set) => {
        db.collection('users').doc(set.data().user)
        .onSnapshot((user) => {
          this.user = user.data()
        })
        const isLiked = set.data().likes.find(like => like == user.uid);
        if (isLiked) {
          this.isLiked = true;
        } else {
          this.isLiked = false;
        }
      });
    });
    db.collection('sets').doc(this.$route.params.id).get()
      .then((set) => {
        set.data().keywords.forEach(tag => {
          this.keywords.push(tag)
        })
        if(set.data().items.length > 0) {
          set.data().items.forEach(item => {
            this.items.push({
              id: item.id,
              num: item.num
            })
          })
        }
    })
  },
  firestore() {
    return {
      set: db.collection('sets').doc(this.$route.params.id),
      allItems: db.collection('items')
    }
  },
  methods: {
    addTag() {
      this.keywords.push(this.keyword)
      .then(
        this.keyword = ''
      );
    },
    removeTag(i) {
      this.keywords.splice(i, 1)
    },
    addItem() {
      // exclude invalid IDs
      const idArr = []
      this.allItems.forEach(item => {
        idArr.push(item.id)
      })
      if (idArr.indexOf(this.itemId) >= 0) {
        // check if user is valid
        db.collection('items').doc(this.itemId)
        .onSnapshot((item) => {
          if(item.data().user == this.currentUser.uid) {
            // exclude duplicated IDs
            this.items.push(this.itemId)
            const itemSet = new Set(this.items)
            this.items = Array.from(itemSet)
            this.itemId = ''
          } else {
            this.$toasted.show(
              '他のユーザーのスキルを追加することはできません！',
              {duration: 1500}
            )
          }
        })
      } else {
        this.$toasted.show(
          'おや？IDを間違えていませんか？',
          {duration: 1500}
        )
      }
    },
    onRemoveItem(id) {
      this.$toasted.show(
        'このスキルをリストから削除してよろしいですか？',
        { 
          action : [
            {
              text : 'はい',
              onClick: (e,toastObject) => {
                toastObject.goAway(0),
                this.items.some((v,i) => {
                  if (v == id) {
                    this.items.splice(i,1);  
                  }  
                })
              }
            },
            {
              text : 'なんでもないです',
              onClick: (e,toastObject) => {
                toastObject.goAway(0)
              }
            }
          ]
        }
      )
    },
    toggleLike() {
      if (this.currentUser) {
        if (this.isLiked) {
          db.collection('sets')
            .doc(this.$route.params.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
            });
        } else {
          db.collection('sets')
            .doc(this.$route.params.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
            });
        }
      } else {
        this.$toasted.show('この操作にはサインインが必要です。', { duration: 1500 });
      }
    },
    deleteSet() {
      this.$toasted.show(
        'このチュートリアルを削除してよろしいですか？',
        { 
          action : [
            {
              text : 'はい',
              onClick: (e,toastObject) => {
                toastObject.goAway(0),
                db.collection('sets').doc(this.$route.params.id).delete()
                .then(
                  this.$toasted.show('チュートリアルを削除しました。', {duration: 1500}),
                  this.$router.push('/user/' + this.currentUser.uid)
                )
              }
            },
            {
              text : 'やっぱりやめる',
              onClick: (e,toastObject) => {
                toastObject.goAway(0)
              }
            }
          ]
        }
      )
    },
    publishSet() {
      if(this.set.title,this.set.price,this.set.description) {
        const date = this.$date(new Date(), 'DD.MMMM.YYYY');
        db.collection('sets').doc(this.$route.params.id).set({
          title: this.set.title,
          price: this.set.price,
          keywords: this.keywords,
          updatedAt: date,
          thumbnail: this.set.thumbnail,
          description: this.set.description,
          items: this.items,
          private: false
        }, {merge: true})
        .then(
          this.$toasted.show(
            'スキルを公開しました！',
            {duration: 1500}
          ),
          this.isEdit = false
        )
      } else {
        this.$toasted.show(
          'おっと、記入漏れがあるようです。',
          {duration: 1500}
        )
      }
    },
    saveSet() {
      const date = this.$date(new Date(), 'DD.MMMM.YYYY');
      db.collection('sets').doc(this.$route.params.id).set({
        title: this.set.title,
        price: this.set.price,
        keywords: this.keywords,
        updatedAt: date,
        thumbnail: this.set.thumbnail,
        description: this.set.description,
        items: this.items,
        private: true
      }, {merge: true})
      .then(
        this.$toasted.show(
          '変更を保存しました。',
          {duration: 1500}
        ),
        this.isEdit = false
      )
    },
    onEnd() {
      const rawItems = document.getElementsByClassName('item');
      const items = [].slice.call(rawItems);
      this.items.forEach((item) => {
        const itemElement = document.getElementById(`item${item.num}`);
        item.num = items.indexOf(itemElement) + 1;
      });
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>