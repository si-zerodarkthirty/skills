<template>
  <div v-if="mode == 'main'" class="mb-4 shadow-lg p-4">
    <router-link :to=" '/item/' + item.id ">
      <div
        class="w-full h-64 bg-cover bg-center border-4 border-black" 
        :style=" 'background-image: url('+ item.thumbnail + ')' "
      ></div>
    </router-link>
    <div class="w-full bg-white">
      <div class="py-3">
        <router-link :to=" '/item/' + item.id ">
          <h1 class="mb-3">{{ item.title }}</h1>
        </router-link>
        <div 
          class="mb-3 text-sm" 
          v-html="item.description"
        ></div>
        <div class="flex">
          <button
            v-for="(tag,idx) in item.keywords"
            :key="idx"
            class="list-none mb-2 mr-2 text-sm"
            @click="$router.push('/tag/'+tag)"
          ># {{ tag }}</button>
        </div>
      </div>
      <div class="flex justify-between">
        <User 
          :uid="item.user" 
          :updatedAt="item.updatedAt"
        />
        <div class="flex flex-wrap">
          <button v-if="item.price > 0">
            <fa icon="cart-plus"/>
            {{ item.price }}円
          </button>
          <button 
            class="ml-3 text-sm"
            @click="copyId"
          >
            スキルID
          </button>
          <a :href="'https://twitter.com/intent/tweet?text=「'+item.title+'」 by '+ user.name +' -%20skillsで学ぶ&url=https://modulestore.tech/item/' + item.id" target="_blank">
            <button class="ml-3 mt-2">
              <fa :icon="['fab','twitter']" />
            </button>
          </a>
          <button 
            class="ml-3 text-sm icon"
            :class="{active: isLiked}"
            @click="toggleLike"
          >
            <fa icon="heart" /> {{ item.likes.length }} 
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="mode == 'small'">
    <div class="flex mb-4">
      <div
        class="w-16 h-16 bg-cover bg-center mr-2 border-4 border-black" 
        :style=" 'background-image: url('+ item.thumbnail + ')' "
        style="min-width: 4rem"
      ></div>
      <div>
        <router-link :to=" '/item/'+ item.id ">
          <p class="font-bold text-sm">{{ item.title }}</p>
        </router-link>
        <div class="flex flex-wrap">
          <li 
            v-for="(tag,idx) in item.keywords"
            :key="idx"
            class="list-none mb-1 mr-1 text-xs cursor-pointer"
            @click="$router.push('/tag/'+tag)"
          ># {{ tag }}</li>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="mode == 'session'" class="my-8">
    <div class="flex mb-2">
      <div
        class="w-16 h-16 bg-cover bg-center mr-2 border-4 border-black" 
        :style=" 'background-image: url('+ item.thumbnail + ')' "
        style="min-width: 4rem"
      ></div>
      <div>
        <router-link :to=" '/set/' + sid + '/' + num + '/' + item.id ">
          <p class="font-bold text-sm">{{ item.title }}</p>
        </router-link>
        <div class="flex flex-wrap">
          <li 
            v-for="(tag,idx) in item.keywords"
            :key="idx"
            class="list-none mb-1 mr-1 text-xs cursor-pointer"
            @click="$router.push('/tag/'+tag)"
          ># {{ tag }}</li>
        </div>
      </div>
    </div>
    <div 
      class="mb-3 text-xs" 
      v-html="item.description"
    ></div>
  </div>
  <div v-else-if="mode == 'middle'" class="my-5">
    <div class="flex mb-2">
      <div
        class="w-16 h-16 bg-cover bg-center mr-2 border-4 border-black" 
        :style=" 'background-image: url('+ item.thumbnail + ')' "
        style="min-width: 4rem"
      ></div>
      <div>
        <router-link :to=" '/item/'+ item.id ">
          <p class="font-bold text-sm">{{ item.title }}</p>
        </router-link>
        <div class="flex flex-wrap">
          <li 
            v-for="(tag,idx) in item.keywords"
            :key="idx"
            class="list-none mb-1 mr-1 text-xs cursor-pointer"
            @click="$router.push('/tag/'+tag)"
          ># {{ tag }}</li>
        </div>
      </div>
    </div>
    <div 
      class="mb-3 text-xs" 
      v-html="item.description"
    ></div>
  </div>
  <div v-else-if="mode == 'editor'">
    <div 
      :id="'item'+num"
      class="relative border-b-2 border-gray-200 item p-2"
    >
      <div class="absolute top-0 bottom-0 right-0 left-0 text-center">
        <p 
          class="absolute right-0 w-12 cursor-pointer font-bold text-sm" 
          style="top: 33%"
          @click="emitRemoveItem"
        >X 削除</p>
      </div>
      <div class="flex">
        <div
          class="w-12 h-12 bg-cover bg-center mr-2 border-2 border-black" 
          :style=" 'background-image: url('+ item.thumbnail + ')' "
          style="min-width: 3rem"
        ></div>
        <div>
          <p class="font-bold text-sm">{{ item.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from '@/components/User'
import { auth } from '@/main'
import { db } from '@/main'
import firebase from 'firebase'
export default {
  props: ['id','num','mode','sid'],
  components: {
    User
  },
  data() {
    return {
      item: {},
      user: {},
      isLiked: false,
      currentUser: {}
    }
  },
  firestore() {
    return {
      item: db.collection('items').doc(this.$props.id)
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
    this.currentUser = user;
    db.collection('items').doc(this.$props.id)
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
    });
  },
  methods: {
    emitRemoveItem() {
      this.$emit('removeItem', this.$props.id)
    },
    copyId() {
      this.$copyText(this.item.id).then(
        this.$toasted.show(
          'スキルIDをクリップボードにコピーしました。',
          {duration: 1000}
        )
      )
    },
    toggleLike() {
      if (this.currentUser) {
        if (this.isLiked) {
          db.collection('items')
            .doc(this.$props.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
            });
        } else {
          db.collection('items')
            .doc(this.$props.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
            });
        }
      } else {
        this.$toasted.show('この操作にはサインインが必要です。', { duration: 1000 });
      }
    }
  }
}
</script>

<style lang="stylus">
.icon
  color rgba(0,0,0,.8)
.active
  color white
</style>

