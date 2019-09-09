<template>
  <div v-if="mode == 'main'" class="mb-8 shadow-lg p-4">
    <router-link :to=" '/item/' + set.id ">
      <div
        class="w-full h-64 bg-cover bg-center border-4 border-black" 
        :style=" 'background-image: url('+ set.thumbnail + ')' "
      ></div>
    </router-link>
    <div class="w-full bg-white">
      <div class="py-3">
        <router-link :to=" '/set/' + set.id + '/home' ">
          <h1 class="mb-3">{{ set.title }}</h1>
        </router-link>
        <div 
          class="mb-3 text-sm" 
          v-html="set.description"
        ></div>
        <div class="flex">
          <button
            v-for="(tag,idx) in set.keywords"
            :key="idx"
            class="list-none mb-2 mr-2 text-sm"
            @click="$router.push('/tag/'+tag)"
          ># {{ tag }}</button>
        </div>
      </div>
      <div class="flex justify-between">
        <User 
          :uid="set.user" 
          :updatedAt="set.updatedAt"
        />
        <div class="flex flex-wrap">
          <button v-if="set.price > 0">
            <fa icon="cart-plus"/>
            {{ set.price }}円
          </button>
          <a :href="'https://twitter.com/intent/tweet?text=「'+set.title+'」 by '+ set.name +' -%20skillsで学ぶ&url=https://modulestore.tech/set/' + set.id + '/home'" target="_blank">
            <button class="ml-3 mt-2">
              <fa :icon="['fab','twitter']" />
            </button>
          </a>
          <button 
            class="ml-3 text-sm icon"
            :class="{active: isLiked}"
            @click="toggleLike"
          >
            <fa icon="heart" /> {{ set.likes.length }} 
          </button>
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
  props: ['id','mode'],
  components: {
    User
  },
  data() {
    return {
      set: {},
      user: {},
      isLiked: false,
      currentUser: {}
    }
  },
  firestore() {
    return {
      set: db.collection('sets').doc(this.$props.id)
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
    this.currentUser = user;
    db.collection('sets').doc(this.$props.id)
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
  },
  methods: {
    emitRemoveset() {
      this.$emit('removeset', this.$props.id)
    },
    copyId() {
      this.$copyText(this.set.id).then(
        this.$toasted.show(
          'スキルIDをクリップボードにコピーしました。',
          {duration: 1000}
        )
      )
    },
    toggleLike() {
      if (this.currentUser) {
        if (this.isLiked) {
          db.collection('sets')
            .doc(this.$props.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
            });
        } else {
          db.collection('sets')
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
  color rgba(0,0,0,.3)
.active
  color black
</style>