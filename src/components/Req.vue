<template>
  <div>
    <div class="my-2 py-3 shadow-lg p-3">
      <p>{{ req.content }}</p>
      <button class="mt-2 p-1 text-xs bg-gray-200" @click="addWant">
        ほしい: {{ req.wants }}
      </button>
    </div>
  </div>
</template>

<script>
import { db } from '@/main'
export default {
  props: ['id'],
  data() {
    return {
      req: {}
    }
  },
  firestore() {
    return {
      req: db.collection('requests').doc(this.$props.id)
    }
  },
  methods: {
    addWant() {
      if(this.req.wants < 300) {
        db.collection('requests').doc(this.$props.id).set({
          wants: this.req.wants + 1,
        }, {merge: true})
      }
    }
  }
}
</script>