<template>
  <div>
    <div v-if="currentUser && currentUser.uid == user.id">
      <nav class="flex mb-5">
        <button 
          class="w-1/2 py-5"
          :class="{'text-black': skill}"
          @click="skill=true"
        >スキル ({{ priv.length }})</button>
        <button 
          class="w-1/2"
          :class="{'text-black': !skill}"
          @click="skill=false"
        >コース ({{ privSets.length }})</button>
      </nav>
      <div v-if="skill">
        <Item 
          v-for="item in orderBy(priv, 'updatedAt',-1)"
          :key="item.id"
          :id="item.id"
          mode="main"
        />
      </div>
      <div v-else>
        <Set 
          v-for="set in orderBy(privSets, 'updatedAt',-1)"
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
import Item from '@/components/Item'
import Set from '@/components/Set'
import Vue2Filters from 'vue2-filters'
export default {
  components: {
    Item,
    Set
  },
  data() {
    return {
      priv: [],
      privSets: [],
      skill: true
    }
  },
  firestore() {
    return {
      priv: db.collection('items').where('user','==',this.$route.params.uid).where('private','==',true),
      privSets: db.collection('sets').where('user','==',this.$route.params.uid).where('private','==',true),
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>