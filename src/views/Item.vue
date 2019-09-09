<template>
  <article>
    <div class="menu-lg fixed z-10">
      <div 
        class="flex cursor-pointer icon"
        :class="{active: isLiked}"
        @click="toggleLike"
      >
        <div 
          class="ibtn"
          :class="{inactive: !isLiked}"
        >
          <fa icon="heart" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">{{ item.likes.length }}</p>
      </div>
      <a :href="'https://twitter.com/intent/tweet?text=「'+item.title+'」 by '+ user.name +' -%20skillsで学ぶ&url=https://modulestore.tech/item/' + item.id" target="_blank">
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
        class="flex mt-3 cursor-pointer"
        @click="copyId"
      >
        <div class="ibtn">
          <fa icon="copy" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">IDをコピー</p>
      </div>
      <div 
        v-if="item.price > 0" 
        class="flex mt-3 cursor-pointer"
        @click="pay"
      >
        <div class="ibtn">
          <fa icon="cart-plus" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">{{ item.price }}円で購入</p>
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
        class="flex cursor-pointer icon"
        :class="{active: isLiked}"
        @click="toggleLike"
      >
        <div 
          class="ibtn"
          :class="{inactive: !isLiked}"
        >
          <fa icon="heart" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">{{ item.likes.length }}</p>
      </div>
      <a :href="'https://twitter.com/intent/tweet?text=「'+item.title+'」 by '+ user.name +' -%20skillsで学ぶ&url=https://modulestore.tech/item/' + item.id" target="_blank">
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
        class="flex mt-3 cursor-pointer"
        @click="copyId"
      >
        <div class="ibtn">
          <fa icon="copy" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">IDをコピー</p>
      </div>
      <div 
        v-if="item.price > 0" 
        class="flex mt-3"
      >
        <div class="ibtn">
          <fa icon="cart-plus" />
        </div>
        <p class="text-xs ml-1 mt-3 font-bold">{{ item.price }}円で購入</p>
      </div>
    </div>
    <div
      class="relative w-full h-64 bg-cover bg-center mr-2 border-4 border-black mt-20 mb-8" 
      :style=" 'background-image: url('+ item.thumbnail + ')' "
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
        v-model="item.thumbnail_draft"
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
      v-model="item.title_draft"
      class="p-2 w-full text-center"
    >
    <h1 
      v-else
      class="text-center font-bold mb-2 text-2xl"
    >
      <span v-if="item.private" class="text-gray-400">[下書き]</span>
      {{ item.title }}
    </h1>
    <label 
      for="description"
      v-if="isEdit"
    >価格 - 0〜10000円</label>
    <input 
      type="text" 
      placeholder="円"
      v-if="isEdit"
      class="p-2 w-64"
      v-model="item.price_draft"
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
      <li 
        v-for="(tag,idx) in item.keywords"
        :key="idx"
        class="list-none mb-2 mr-2 text-sm cursor-pointer"
        @click="$router.push('/tag/'+tag)"
      ># {{ tag }}</li>
    </div>
    <div class="flex justify-between mt-10">
      <User
        :uid="item.user"
        :updatedAt="item.updatedAt" 
      />
      <div class="relative">
        <button 
          v-if="currentUser && currentUser.uid == item.user"
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
          class="shadow-lg controls absolute bg-white"
          v-if="isMenuOpen"
        >
          <button 
            class="p-2"
            @click="isEdit = true"
            v-if="!isEdit && currentUser && currentUser.uid == item.user"
          >スキルを編集する</button>
          <button 
            class="p-2"
            @click="publishItem"
            v-if="!isEdit && item.private"
          >スキルを公開する</button>
          <button 
            class="p-2"
            @click="deleteItem"
            v-if="!isEdit && item.private && currentUser && currentUser.uid == item.user"
          >スキルを削除する</button>
          <button 
            class="p-2"
            @click="saveItem"
            v-if="isEdit"
          >下書保存する</button>
          <button 
            class="p-2"
            @click="updateItem"
            v-if="isEdit"
          >スキルを更新する</button>
          <button 
            class="p-2"
            @click="isEdit = false, isMenuOpen = false"
            v-if="isEdit"
          >変更を取り消す</button>
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
      >
        <fa icon="code" />エディタを起動
      </button>
    </div>
    <textarea
      v-if="isEdit"
      v-model="item.description_draft"
      class="p-2 font-mono"
      name="description"
      @keydown.tab="tabIndent($event)"
    ></textarea>
    <div
      v-else
      class="content mt-12 description"
      v-html="md.render(item.description)"
    ></div>
    <div 
      class="fixed top-0 bottom-0 left-0 w-full bg-white z-50"
      v-if="isOpenDesc"
    >
      <button 
        class="fixed top-0 right-0 p-3"
        @click="isOpenDesc = false"
      >もどる</button>
      <p class="fixed top-0 left-0 p-3 font-bold text-white">概要</p>
      <div class="flex editor">
        <textarea
          v-model="item.description_draft"
          class="w-1/2 px-3 py-10 font-mono"
          name="description"
          @keydown.tab="tabIndent($event)"
        ></textarea>
        <div 
          class="w-1/2 p-3 content py-10"
          v-html="md.render(item.description_draft)"
        ></div>
      </div>
    </div>
    <div 
      v-if="item.prevItems.length > 0 && !isEdit"
      class="mt-12"
    >
      <h2 class="text-center font-bold text-lg mb-5">前提とするスキル</h2>
      <Item 
        v-for="itemId in item.prevItems"
        :key="itemId"
        :id="itemId"
        mode="middle"
      />
    </div>
    <div v-if="isEdit">
      <label 
        v-if="isEdit"
        for="title"
      >前提とするスキル (任意)</label>
      <input 
        v-if="isEdit"
        type="text"
        placeholder="スキルIDを入力しEnterで追加"
        v-model="prevItemId"
        @keypress.enter="addPrev"
        class="p-2 w-full"
      >
      <Item 
        v-for="(itemId,idx) in prevItems"
        :key="idx"
        :id="itemId"
        mini="true"
        remove="true"
        @removeItem="onRemoveItem"
      />
    </div>
    <div 
      class="flex justify-between mt-12"
      v-if="isEdit"
    >
      <label 
        for="content"
      >本文 - markdown</label>
      <button 
        class="mt-2"
        @click="isOpenCont = true"
      >
        <fa icon="code" />エディタを起動
      </button>
    </div>
    <textarea
      v-if="isEdit"
      v-model="item.content_draft"
      class="p-2 font-mono"
      name="content"
      @keydown.tab="tabIndent($event)"
    ></textarea>
    <div
      v-else
      class="content border-b-4 pb-12"
      v-html="md.render(item.content)"
    ></div>
    <div 
      class="fixed top-0 bottom-0 left-0 w-full bg-white z-50"
      v-if="isOpenCont"
    >
      <button 
        class="fixed top-0 right-0 p-3"
        @click="isOpenCont = false"
      >もどる</button>
      <p class="fixed top-0 left-0 p-3 font-bold text-white">本文</p>
      <div class="flex editor">
        <textarea
          v-model="item.content_draft"
          class="w-1/2 px-3 py-10 font-mono"
          name="description"
          @keydown.tab="tabIndent($event)"
        ></textarea>
        <div 
          class="w-1/2 p-3 content py-10"
          v-html="md.render(item.content_draft)"
        ></div>
      </div>
    </div>
    <vue-disqus
      class="my-12"
      shortname="modules-1"
      :identifier="item.id"
      :url="'https://modulestore.tech/item/' + item.id"
    ></vue-disqus>
    <div v-if="nextItems.length > 0">
      <h2 class="text-center font-bold text-lg mb-5">次に取り組めるスキル</h2>
      <Item 
        v-for="item in nextItems"
        :key="item.id"
        :id="item.id"
        mode="middle"
      />
    </div>
    <div v-else-if="recItems.length > 0">
      <h2 class="text-center font-bold text-lg mb-5">お薦めのスキル</h2>
      <Item 
        v-for="itemId in limitBy(recItems,3)"
        :key="itemId"
        :id="itemId"
        mode="middle"
      />
    </div>
  </article>
</template>

<script>
import firebase from 'firebase';
import Item from '@/components/Item';
import User from '@/components/User';
import { auth } from '@/main';
import { db } from '@/main';
import markdownIt from 'markdown-it';
import sanitizer from 'markdown-it-sanitizer';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import katex from '@iktakahiro/markdown-it-katex';
import hljs from "highlight.js";
import Vue2Filters from 'vue2-filters';
import axios from 'axios';
var stripe = Stripe('pk_test_B4N7KzJlmJv23DrC1TwhCwc100dd4f8Tm9');
export default {
  metaInfo () {
    return {
      title: this.item.title + ' published by' + this.user.name + ' | skills: プログラミング初級者のためのブートキャンプ',
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
          content: this.item.title + ' | skills: プログラミング初級者のためのブートキャンプ'
        },
        {
          property: 'og:description',
          content: this.item.description
        },
        {
          property: 'og:image',
          content: this.item.thumbnail
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
    User
  },
  data() {
    return {
      items: [],
      sessionId: '',
      isMenuOpen: false,
      isCtrlOpen: false,
      isOpenDesc: false,
      isOpenCont: false,
      isEdit: false,
      isLiked: false,
      item: {},
      keyword: '',
      keywords: [],
      prevItemId: '',
      prevItems: [],
      nextItems: [],
      recItems: [],
      currentUser: {},
      user: {},
      md: new markdownIt({
        highlight(code, lang) {
          return hljs.highlightAuto(code, [lang]).value;
        },
        html: true,
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
      db.collection('items').doc(this.$route.params.id)
      .onSnapshot((item) => {
        db.collection('users').doc(item.data().user)
        .onSnapshot((user) => {
          this.user = user.data()
        })
        const isLiked = item.data().likes.find(like => like == user.uid);
        if (isLiked) {
          this.isLiked = true;
        } else {
          this.isLiked = false;
        }
      });
    })
    db.collection('items').doc(this.$route.params.id)
    .get().then((item) => {
      item.data().keywords_draft.forEach(tag => {
        this.keywords.push(tag)
      })
      item.data().prevItems_draft.forEach(itemId => {
        this.prevItems.push(itemId)
      })
      item.data().keywords.forEach(tag => {
        db.collection('items').where('keywords','array-contains',tag)
        .get().then(items => {
          items.forEach(item => {
            if(this.recItems.indexOf(item.id) == -1 && item.id != this.item.id) {
              this.recItems.push(item.id)
            }
          })
        })
      })
    })
  },
  firestore() {
    return {
      item: db.collection('items').doc(this.$route.params.id),
      nextItems: db.collection('items').where('prevItems','array-contains',this.$route.params.id)
    }
  },
  methods: {
    pay() {
      this.items.push({
        id: this.item.id,
        quantity: 1
      })
      let data = this.items.map(item => ({ [item.id]: item.quantity }))
      data = Object.assign({}, ...data)
      axios.get('https://us-central1-skil-hunt.cloudfunctions.net/CheckoutSession', {
        params: {
          products: data
        }
      })
        .then((response) => {
          this.sessionId = response.data;
          console.log(response.data);
          stripe.redirectToCheckout({
            sessionId: this.sessionId.id
            }).then((result) => {
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    tabIndent(e) {
      e.preventDefault()
      var elem = e.target;
      var val = elem.value;
      var pos = elem.selectionStart;
      elem.value = val.substr(0, pos) + '\t' + val.substr(pos, val.length);
      elem.setSelectionRange(pos + 1, pos + 1);
    },
    copyId() {
      this.$copyText(this.item.id).then(
        this.$toasted.show(
          'スキルIDをクリップボードにコピーしました。',
          {duration: 1000}
        )
      )
    },
    addTag() {
      this.keywords.push(this.keyword)
      .then(
        this.keyword = ''
      );
    },
    removeTag(i) {
      this.keywords.splice(i, 1)
    },
    addPrev() {
      db.collection('items').doc(this.prevItemId).get()
      .then((item) => {
        if (item.exists) {
          this.prevItems.push(this.prevItemId)
          .then(
            this.prevItemId = ''
          )
        } else {
          this.$toasted.show(
            'おや？IDを間違えていませんか？',
            {duration: 1500}
          )
        }
      })
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
                this.prevItems.some((v,i) => {
                  if (v == id) {
                    this.prevItems.splice(i,1);  
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
          db.collection('items')
            .doc(this.$route.params.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
            });
        } else {
          db.collection('items')
            .doc(this.$route.params.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
            });
        }
      } else {
        this.$toasted.show('この操作にはサインインが必要です。', { duration: 1000 });
      }
    },
    deleteItem() {
      this.$toasted.show(
        'このスキルを削除してよろしいですか？',
        { 
          action : [
            {
              text : 'はい',
              onClick: (e,toastObject) => {
                toastObject.goAway(0),
                db.collection('items').doc(this.$route.params.id).delete()
                .then(
                  this.$toasted.show('スキルを削除しました。', {duration: 1000}),
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
    publishItem() {
      if(this.item.title,this.item.price,this.item.description,this.item.content) {
        const date = new Date()
        db.collection('items').doc(this.$route.params.id).set({
          private: false
        }, {merge: true})
        .then(
          this.$toasted.show(
            'スキルを公開しました！',
            {duration: 1000}
          ),
          this.isEdit = false
        )
      } else {
        this.$toasted.show(
          'おっと、記入漏れがあるようです。',
          {duration: 1000}
        )
      }
    },
    updateItem() {
      if(this.item.title_draft,this.item.price_draft,this.item.description_draft,this.item.content_draft) {
        const date = new Date()
        db.collection('items').doc(this.$route.params.id).set({
          title: this.item.title_draft,
          price: this.item.price_draft,
          keywords: this.keywords,
          updatedAt: date,
          thumbnail: this.item.thumbnail_draft,
          description: this.item.description_draft,
          content: this.item.content_draft,
          prevItems: this.prevItems,
          title_draft: this.item.title_draft,
          price_draft: this.item.price_draft,
          keywords_draft: this.keywords,
          thumbnail_draft: this.item.thumbnail_draft,
          description_draft: this.item.description,
          content_draft: this.item.content_draft,
          prevItems_draft: this.prevItems
        }, {merge: true})
        .then(
          this.$toasted.show(
            'スキルを更新しました！',
            {duration: 1000}
          ),
          this.isEdit = false
        )
      } else {
        this.$toasted.show(
          'おっと、記入漏れがあるようです。',
          {duration: 1000}
        )
      }
    },
    saveItem() {
      const date = new Date()
      db.collection('items').doc(this.$route.params.id).set({
        title_draft: this.item.title_draft,
        price_draft: this.item.price_draft,
        keywords_draft: this.keywords,
        updatedAt: date,
        thumbnail_draft: this.item.thumbnail_draft,
        description_draft: this.item.description,
        content_draft: this.item.content_draft,
        prevItems_draft: this.prevItems
      }, {merge: true})
      .then(
        this.$toasted.show(
          '変更を保存しました。',
          {duration: 1000}
        ),
        this.isEdit = false
      )
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono&display=swap');

article
  max-width 560px
  width 100%
  margin 0 auto
.controls
  top 35px
  right 0
  button
    width 130px
    font-weight normal
    font-size .75rem
    text-align left
  button:hover
    background #f7fafc
.menu-lg
  top 20vh
  left 20px
  display none
.menu-sm
  bottom 60px
  left 10px
.ibtn
  width 2.5rem
  height 2.5rem
  border 2px solid black
  border-radius 50%
  text-align center
  svg
    position relative
    top 6px
.inactive
  border 2px solid rgba(0,0,0,.3)
.bbtn
  bottom 10px
  left 10px
label
  font-weight bold
  margin 20px 0 10px 0
  display block
  font-size .9rem
input,textarea
  width 100%
  border 2px solid black
textarea
  height 250px
  tab-size 1rem
.imgurl
  top 105px
  left 50%
  margin-left -40%
  background rgba(255,255,255,.8)
  width 80%
.imgurl-label
  top 80px
  left 50%
  margin-left -40%
  width 80%
.content,.description
  h2
    padding 60px 0 10px
    font-size 1.3rem
    border-bottom .3rem solid #f4f4f4
  h3
    padding 30px 0 10px
    font-weight bold
    font-size 1.125rem
  h4
    padding 30px 0 10px
    font-weight bold
    font-size 1rem
  h5
    padding 30px 0 10px
    font-weight bold
    font-size .9rem
  h6
    padding 30px 0 10px
    font-weight bold
    font-size .8rem
  p
    margin 1.5rem 0
    line-height 1.8rem
  a
    font-weight bold
  li
    list-style-type disc
    margin 10px 0 10px 30px
    font-size .9rem
  code
    font-family 'Ubuntu Mono', monospace
    background #eee
    padding 3px
    margin 0 3px
    border-radius 3px
  pre
    overflow-x scroll
    color #eee
    background rgb(40,44,52)
    padding 20px
    max-height 500px
    margin 10px 0
    code
      background rgb(40,44,52)
      padding 0
      margin 0
  blockquote
    border-left .2rem solid black
    padding-left 1rem
    margin-left 1rem
  img
    margin 10px auto
  table
    margin 2rem auto
    width 100%
    font-size .9rem
    th,td
      min-width 50px
      padding 10px 0
    th
      border-bottom 3px solid black
      text-align left
    td
      border-bottom 1px solid #f4f4f4
.description
  background #f4f4f4
  padding 20px
  font-size .9rem
  p
    margin 10px
    line-height 1.8rem
  li
    list-style-type disc
    margin 5px 0 5px 35px
    font-size .875rem
.editor
  height 100vh
  textarea
    height 100%
    resize none
    border none
    background rgb(40,44,52)
    color #eee
  div
    overflow-y scroll
.table-of-contents
  border 1px solid #f4f4f4
  border-radius 5px
  padding 2rem
  margin 4rem auto 0
  width 90%
.editor
  .table-of-contents
    display: none

@media(min-width 900px)
  .table-of-contents
    position fixed
    top 20vh
    right 4.5px
    width calc(50px+15%)
    margin 0 auto
    padding 1rem
    border-radius 0
    border none
    li
      margin 0
      padding .5rem 0
      list-style none
      line-height 1.2rem
      font-size .8rem
      border-bottom 1px solid #f4f4f4
      li
        border none
        margin 0
        padding .3rem 0 0 1rem
  .bbtn,.menu-sm
    display none
  .menu-lg
    display block

@media(min-width 1200px)
  article
    max-width 700px
</style>