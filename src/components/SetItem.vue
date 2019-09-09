<template>
  <div 
    class="flex border-b border-gray-100 hover:bg-gray-100 cursor-pointer"
    @click="$router.push('/set/' + sid+  '/'+ num +'/' + id)"
  >
    <div 
      class="w-8 bg-black text-white text-center"
      style="min-width: 2rem"
    >
      <p class="pt-1">{{ num }}</p>
    </div>
    <div class="p-2 text-xs">
      <p>{{ item.title }}</p>
    </div>
  </div>
</template>

<script>
import { db } from '@/main'
export default {
  props: ['sid','id','num'],
  data() {
    return {
      item: {}
    }
  },
  firestore() {
    return {
      item: db.collection('items').doc(this.$props.id)
    }
  }
}
</script>