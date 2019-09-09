<template>
  <div class="flex">
    <div
      class="mt-1 w-8 h-8 bg-cover bg-center mr-2 rounded-full" 
      :style=" 'background-image: url('+ user.photoURL + ')' "
    ></div>
    <div>
      <router-link :to=" '/user/' + user.id ">
        <p class="text-sm">
          <span class="font-bold">
            {{ user.name }}
          </span>
           | {{ items.length + sets.length }}個のアイテムを公開中
        </p>
      </router-link>
      <p class="text-xs">{{ updatedAt.toDate() | moment }}</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { db } from '@/main'
export default {
  props: ['uid','updatedAt'],
  data() {
    return {
      user: {},
      items: [],
      sets: []
    }
  },
  firestore() {
    return {
      user: db.collection('users').doc(this.$props.uid),
      items: db.collection('items').where('user','==',this.$props.uid).where('private','==',false),
      sets: db.collection('sets').where('user','==',this.$props.uid)
    }
  },
  filters: {
    moment: function (date) {
      return moment(date).format('DD.MMMM.YYYY | HH:mm')
    }
  }
}
</script>