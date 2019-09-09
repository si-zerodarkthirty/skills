<template>
  <article>
    <div 
      class="cover fixed top-0 bottom-0 w-full left-0 z-40"
      v-if="isSideVisible"
      @click="isSideVisible = false"
    ></div>
    <aside 
      class="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-lg overflow-y-scroll"
      :class="{'ml-0': isSideVisible, '-ml-64': !isSideVisible}"
    >
      <router-link :to=" '/set/' + set.id + '/home' ">
        <p class="p-4 font-bold text-sm border-b-2 border-black">{{ set.title }}</p>
      </router-link>
      <SetItem
        v-for="item in orderBy(set.items,'num')"
        :key="item.id"
        :id="item.id"
        :num="item.num"
        :sid="set.id"
        :class="{
          'font-bold': $route.params.iid == item.id,
          'bg-gray-100': $route.params.iid == item.id
        }"
      />
    </aside>
    <div class="menu-lg fixed z-10">
      <div 
        class="flex cursor-pointer"
        @click="isSideVisible = true"
      >
        <div class="ibtn">
          <fa icon="bars" class="fa-lg" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">コースメニュー</p>
      </div>
      <div 
        v-if="currentUser && currentUser.uid == set.user && $route.params.iid" 
        class="flex mt-3 cursor-pointer"
        @click="$router.push('/item/' + $route.params.iid)"
      >
        <div class="ibtn">
          <fa icon="feather-alt" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">スキルを編集</p>
      </div>
      <div 
        class="flex cursor-pointer icon mt-3"
        :class="{active: isLiked}"
        @click="toggleLike"
      >
        <div 
          class="ibtn"
          :class="{inactive: !isLiked}"
        >
          <fa icon="heart" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">{{ set.likes.length }}</p>
      </div>
      <a :href=" 'https://twitter.com/intent/tweet?text=「'+set.title+'」 by '+ user.name +' -%20skillsで学ぶ&url=https://modulestore.tech/set/home' " target="_blank">
        <div 
          class="flex mt-3 cursor-pointer"
        >
          <div class="ibtn">
            <fa :icon="['fab','twitter']" />
          </div>
          <p class="text-xs ml-1 mt-3 font-bold">ツイート</p>
        </div>
      </a>
      <div 
        v-if="set.price > 0" 
        class="flex mt-3"
      >
        <div class="ibtn">
          <fa icon="cart-plus" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">{{ set.price }}円で購入</p>
      </div>
    </div>
    <div 
      class="bbtn fixed z-40 cursor-pointer"
      @click="isCtrlOpen = !isCtrlOpen"
    >
      <div 
        class="ibtn"
      >
        <fa v-if="!isCtrlOpen" icon="plus" />
        <fa v-else icon="times" />
      </div>
    </div>
    <div 
      class="menu-sm fixed z-40"
      v-if="isCtrlOpen"
    >
      <div 
        class="flex cursor-pointer"
        @click="isSideVisible = true"
      >
        <div class="ibtn">
          <fa icon="bars" class="fa-lg" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">コースメニュー</p>
      </div>
      <div 
        v-if="currentUser && currentUser.uid == set.user && $route.params.iid" 
        class="flex mt-3 cursor-pointer"
        @click="$router.push('/item/' + $route.params.iid)"
      >
        <div class="ibtn">
          <fa icon="feather-alt" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">スキルを編集</p>
      </div>
      <div 
        class="flex cursor-pointer icon mt-3"
        :class="{active: isLiked}"
        @click="toggleLike"
      >
        <div 
          class="ibtn"
          :class="{inactive: !isLiked}"
        >
          <fa icon="heart" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">{{ set.likes.length }}</p>
      </div>
      <a :href=" 'https://twitter.com/intent/tweet?text=「'+set.title+'」 by '+ user.name +' -%20skillsで学ぶ&url=https://modulestore.tech/set/home' " target="_blank">
        <div 
          class="flex mt-3 cursor-pointer"
        >
          <div class="ibtn">
            <fa :icon="['fab','twitter']" />
          </div>
          <p class="text-xs ml-1 mt-3 font-bold">ツイート</p>
        </div>
      </a>
      <div 
        v-if="set.price > 0" 
        class="flex mt-3"
      >
        <div class="ibtn">
          <fa icon="cart-plus" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">{{ set.price }}円で購入</p>
      </div>
    </div>
    <router-view />
  </article>
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
      isCtrlOpen: false,
      isSideVisible: false,
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
        'このコースを削除してよろしいですか？',
        { 
          action : [
            {
              text : 'はい',
              onClick: (e,toastObject) => {
                toastObject.goAway(0),
                db.collection('sets').doc(this.$route.params.id).delete()
                .then(
                  this.$toasted.show('コースを削除しました。', {duration: 1500}),
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
        const date = new Date()
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

<style lang="stylus" scoped>
.cover
  background rgba(0,0,0,.7)
aside
  transition all .2s
</style>