<template>
  <header class="z-20 fixed w-full top-0 p-3 flex justify-between">
    <router-link to="/">
      <h1 class="font-mono inline-block text-xl">
        5κi11s. 
        <span class="text-xs font-main font-bold">初級プログラマのブートキャンプ</span>
      </h1>
    </router-link>
    <div class="flex">
      <div class="mr-5 flex relative">
        <fa icon="feather-alt" class="block mt-3" />
        <button 
          v-if="!isCreating" 
          class="ml-1 mt-1" 
          @click="create"
        >
          教材を作成
        </button>
        <button 
          v-if="currentUser && isCreating"
          class="ml-1 mt-1" 
          @click="isCreating=false"
        >
          編集を中断
        </button>
        <nav v-if="isOpen" class="absolute bg-white shadow-lg text-xs">
          <li class="p-3 hover:bg-gray-100 cursor-pointer" @click="createItem">
            新規スキルを作成
          </li>
          <li class="p-3 hover:bg-gray-100 cursor-pointer" @click="isOpen = false, isCreating = true">
            新規コースを作成
          </li>
        </nav>
        <div v-if="isCreating" class="course-window absolute shadow-lg bg-white overflow-y-scroll pb-2">
          <button class="text-xs font-bold absolute top-0 right-0 p-2 bg-white" @click="createSet">
            次へ
          </button>
          <input 
            type="text"
            v-model="title"
            class="text-sm font-bold p-2 border-none"
          >
          <input 
            type="text"
            v-model="itemId"
            placeholder="追加したいスキルのIDを入力しEnter"
            class="text-sm p-2 border-none bg-gray-200"
            @keypress.enter="addItem"
          >
          <draggable @end="onEnd">
            <Item 
              v-for="(item,idx) in items"
              :key="idx"
              :id="item.id"
              :num="item.num"
              mode="editor"
              @removeItem="onRemoveItem"
              class="cursor-move hover:bg-gray-100"
            />
          </draggable>
          <p class="text-xs p-2">「コース」は、自分が作成した「スキル」を組み合わせて作ります。まだスキルを作っていない場合は、コースの各パートをスキルとして作成したのち、こちらで登録してください。</p>
        </div>
      </div>
      <div class="flex mt-1">
        <div
          v-if="currentUser"
          class="w-8 h-8 bg-cover bg-center mr-1 rounded-full" 
          :style=" 'background-image: url('+ user.photoURL + ')' "
        ></div>
        <div
          v-else
          class="w-8 h-8 border-2 border-black mr-1 rounded-full text-center cursor-pointer" 
          @click="signIn"
        >
          <fa icon="user" class="pt-1" />
        </div>
        <div v-if="currentUser">
          <router-link :to=" '/user/' + currentUser.uid ">
            <p class="text-sm font-bold mr-3 mt-5px">
              {{ user.name }}
            </p>
          </router-link>
        </div>
        <div v-else>
          <button @click="signIn" class="mt-5px">
            サインイン
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import Item from '@/components/Item'
import firebase from 'firebase'
import { db } from '@/main'
import { auth } from '@/main'
import draggable from 'vuedraggable'
import Vue2Filters from 'vue2-filters'
export default {
  components: {
    Item,
    draggable
  },
  data(){
    return {
      currentUser: {},
      user: {},
      isOpen: false,
      isAdvOpen: false,
      isCreating: false,
      title: 'コースのタイトル',
      itemId: '',
      items: [],
      allItems: []
    }
  },
  firestore() {
    return {
      allItems: db.collection('items')
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user
      db.collection('users').doc(user.uid)
      .onSnapshot((user) => {
        this.user = user.data()
      })
    });
  },
  methods: {
    create() {
      if(this.currentUser) {
        this.isOpen = !this.isOpen
      } else {
        this.signIn()
      }
    },
    createSet() {
      if (this.items.length > 1) {
        let totalPrice = 0
        this.allItems.forEach(item => {
          totalPrice += item.price
        })
        const date = new Date()
        db.collection('sets').add({
          title: this.title,
          createdAt: date,
          updatedAt: date,
          thumbnail: '',
          items: this.items,
          private: true,
          likes: [],
          keywords: [],
          user: this.currentUser.uid,
          price: totalPrice,
          description: ''
        }).then((set) => {
          this.$router.push('/set/' + set.id + '/home')
          this.$toasted.show(
            '新しいコースを作成しました！編集を続けてください。',
            {duration: 1500}
          )
        })
      } else {
        this.$toasted.show(
          '待った！コースを作るには、複数のスキルが必要です。',
          {duration: 1500}
        )
      }
    },
    addItem() {
      // exclude invalid IDs
      db.collection('items').doc(this.itemId).get()
      .then((item) => {
        if (item.exists) {
        // check if user is valid
          if(item.data().user == this.currentUser.uid) {
            // exclude duplicated IDs
            const ids = []
            this.items.forEach(item => {
              ids.push(item.id)
            })
            if(!ids.find(id => id == this.itemId)) {
              this.items.push({
                id: this.itemId,
                num: this.items.length + 1
              })
            }
            // Empty the input
            this.itemId = ''
          } else {
            this.$toasted.show(
              '他のユーザーのスキルを追加することはできません！',
              {duration: 1500}
            )
          }
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
                this.items = this.items.filter((item) => {
                  return item.id != id
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
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then((result) => {
          db.collection('users').doc(result.user.uid).get()
          .then(user => {
            if (user.exists) {
              this.$toasted.show(
                'おかえりなさい！'+user.data().name+'さん。',
                {duration: 1500}
              )
            } else {
              this.$toasted.show(
                'はじめまして！'+result.user.displayName+'さん。',
                {duration: 1500}
              )
              this.createUser(result.user);
            }
          })
        });
    },
    createUser(user) {
      db.collection('users').doc(user.uid).set({
        name: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        twitter: ''
      }, { merge: true });
    },
    createItem() {
      const date = new Date()
      db.collection('items').add({
        title: '新しいスキル',
        title_draft: '新しいスキル',
        price: 0,
        price_draft: 0,
        user: this.currentUser.uid,
        keywords: [],
        keywords_draft: [],
        updatedAt: date,
        createdAt: date,
        thumbnail: 'https://i.ibb.co/Gv1ndGg/skills-icon-png-7.png',
        thumbnail_draft: 'https://i.ibb.co/Gv1ndGg/skills-icon-png-7.png',
        description: '',
        content: '[toc]\n\n## 見出しはh2（#２つ）から始めてください。',
        prevItems: [],
        description_draft: '',
        content_draft: '[toc]\n\n## 見出しはh2（#２つ）から始めてください。',
        prevItems_draft: [],
        likes: [],
        private: true
      })
      .then((item) => {
        this.isOpen = false
        this.$router.push('/item/' + item.id)
        this.$toasted.show(
          '空のスキルを用意しました。さあ、編集を始めましょう！',
          {duration: 1500}
        )
      })
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
nav
  top 35px
  left 0
  width 120px
  li
    list-style none
    text-align center

.course-window
  width 300px
  top 35px
  right -80px

@media(max-width 768px)
  .course-window
    width 200px
</style>