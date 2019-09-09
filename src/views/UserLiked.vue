<template>
  <div>
    <nav class="flex mb-5">
      <button 
        class="w-1/2 py-5"
        :class="{'text-black': skill}"
        @click="skill=true"
      >スキル ({{ liked.length }})</button>
      <button 
        class="w-1/2"
        :class="{'text-black': !skill,}"
        @click="skill=false"
      >コース ({{ likedSets.length }})</button>
    </nav>
    <div v-if="skill">
      <Item 
        v-for="item in orderBy(liked, 'updatedAt',-1)"
        :key="item.id"
        :id="item.id"
        mode="main"
      />
    </div>
    <div v-else>
      <Set
        v-for="set in orderBy(likedSets, 'updatedAt',-1)"
        :key="set.id"
        :id="set.id"
        mode="main"
      />
    </div>
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
  components: {
    Item,
    Set
  },
  data() {
    return {
      liked: [],
      likedSets: [],
      skill: true
    }
  },
  firestore() {
    return {
      liked: db.collection('items').where('likes','array-contains',this.$route.params.uid),
      likedSets: db.collection('sets').where('likes','array-contains',this.$route.params.uid)
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>