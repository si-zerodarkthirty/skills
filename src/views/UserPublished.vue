<template>
  <div>
    <div>
      <nav class="flex mb-5">
        <button 
          class="w-1/2 py-5"
          :class="{'text-black': skill}"
          @click="skill=true"
        >スキル ({{ published.length }})</button>
        <button 
          class="w-1/2"
          :class="{'text-black': !skill}"
          @click="skill=false"
        >コース ({{ publishedSets.length }})</button>
      </nav>
      <div v-if="skill">
        <Item 
          v-for="item in orderBy(published, 'updatedAt',-1)"
          :key="item.id"
          :id="item.id"
          mode="main"
        />
      </div>
      <div v-else>
        <Set
          v-for="set in orderBy(publishedSets, 'updatedAt',-1)"
          :key="set.id"
          :id="set.id"
          :uid="set.user"
          mode="main" 
        />
      </div>
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
      published: [],
      publishedSets: [],
      skill: true
    }
  },
  firestore() {
    return {
      published: db.collection('items').where('user','==',this.$route.params.uid).where('private','==',false),
      publishedSets: db.collection('sets').where('user','==',this.$route.params.uid)
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>