<template>
  <div>
    <h1 class="text-center text-2xl mb-3 font-bold">ほしい教材をリクエストしましょう</h1>
    <div>
      <label for="req">教材のテーマと説明 - 20字以上（エンターキーで送信）</label>
      <textarea
        name="req"
        v-model="reqContent"
        class="h-24 p-2 resize-none border-4 border-black"
        @keypress.enter="addReq"
      ></textarea>
    </div>
    <Req 
      v-for="reqId in reqIds"
      :key="reqId"
      :id="reqId"
    />
  </div>
</template>

<script>
import Req from '@/components/Req'
import Vue2Filters from 'vue2-filters'
import { db } from '@/main'
export default {
  metaInfo: {
    title: '教材リクエスト | skills: プログラミング初級者のためのブートキャンプ',
    description: 'skillsは、プログラミング初級者のためのミニ・チュートリアルを利用＆販売できるサイトです。'
  },
  data() {
    return {
      limit: 10,
      reqIds: []
    }
  },
  components: {
    Req
  },
  created() {
    db.collection('requests').orderBy('wants','desc').orderBy('createdAt','desc').get()
    .then(reqs => {
      reqs.forEach(req => {
        this.reqIds.push(req.id)
      });
    })
  },
  methods: {
    addReq() {
      if(this.reqContent.length >= 20) {
        const date = this.$date(new Date());
        db.collection('requests').add({
          content: this.reqContent,
          wants: 1,
          createdAt: date
        })
        this.$toasted.show(
          'リクエストを追加しました！',
          {duration: 1000}
        )
        this.reqContent = ''
      } else {
        this.$toasted.show(
          20 - this.reqContent.length + '文字足りません。',
          {duration: 1000}
        )
      }
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>