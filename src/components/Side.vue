<template>
  <aside class="side-nav">
    <section>
      <p class="text-lg font-bold mb-5">ちょっとしたスキルを、あなたの毎日のコーヒー代に変えましょう <fa icon="coffee"/></p>
      <li><span>たくさん書く必要はありません：</span>あなたの知っている環境構築のコツや、１機能の実装方法などを、小規模のチュートリアルとして売ることができます。たくさん書きたい人は、スキルを組み合わせて、１つのコースを公開することもできます。</li>
      <li><span>専用のエディタ：</span>マークダウンやタブスペースが有効で、コードはもちろん、数式も書ける高機能のエディタを使って、ブラウザ上で快適に執筆できます。</li>
      <li><span>執筆内容に対する条件は１つだけ：</span>プログラミング初心者に伝わらない単語・表現は全て意味を説明した上で用いて下さい。それ以外は、全くの自由です。事前審査なども無く、ボタン１つで公開できます。</li>
      <button class="w-full my-3 border-4 border-black py-2" @click="create">
        <fa icon="feather-alt" class="mr-1" />
        教材を作成する
      </button>
    </section>
    <section>
      <p class="text-lg font-bold mb-5">改善点をおしえてください <fa icon="smile" /></p>
      <p class="text-xs">Skillsはできたばかりのサービスです。使いづらいところはどんどん直していきますので、お気軽にお伝えください。</p>
      <a 
        href="https://twitter.com/messages/compose?recipient_id=1080778878128275456&ref_src=twsrc%5Etfw" 
        class="twitter-dm-button text-sm text-center block w-full my-3 border-4 border-black py-2" 
        data-screen-name="@skills_officia" 
        data-show-count="false" 
        target="_blank"
      >
        <fa icon="mail-bulk" class="mr-1" />
        開発者に改善点を伝える
      </a>
    </section>
    <section>
      <p class="text-lg font-bold mb-5">現在人気のスキル</p>
      <Item
        v-for="item in orderBy(featured,'likes.length',-1)"
        :key="item.id"
        :id="item.id"
        mode="small"
      />
    </section>
    <section>
      <p class="text-lg font-bold mb-5">キーワード</p>
      <div class="flex flex-wrap">
        <a
          v-for="tag in keywords"
          :key="tag"
          class="m-1 py-1 px-2 text-xs border border-black rounded-full cursor-pointer"
          @click="$router.push('/tag/'+tag)"
        >
          # {{ tag }}
        </a>
      </div>
    </section>
  </aside>
</template>

<script>
import { auth, db } from '@/main'
import firebase from 'firebase'
import Item from '@/components/Item'
import Vue2Filters from 'vue2-filters'
export default {
  components: {
    Item
  },
  data() {
    return {
      featured: [],
      keywords: [],
      currentUser: {}
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user
    });
    db.collection('items').get()
    .then(items => {
      items.forEach(item => {
        item.data().keywords.forEach(newTag => {
          const dupTag = this.keywords.find(tag => tag == newTag)
          if(!dupTag) {
            this.keywords.push(newTag)
          }
        })
      })
    })
  },
  firestore() {
    return {
      featured: db.collection('items').where('private','==',false).limit(6)
    }
  },
  methods: {
    create() {
      if(this.currentUser) {
        this.createItem()
      } else {
        this.signIn()
      }
    },
    createItem() {
      const date = this.$date(new Date(), 'DD.MMMM.YYYY');
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
        content: '',
        prevItems: [],
        description_draft: '',
        content_draft: '',
        prevItems_draft: [],
        likes: [],
        private: true
      })
      .then((item) => {
        this.$router.push('/item/' + item.id)
        this.$toasted.show(
          '空のスキルを用意しました。さあ、編集を始めましょう！',
          {duration: 1500}
        )
      })
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
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>

<style lang="stylus" scoped>
.side-nav
  width 300px
  margin-left 5rem
  section
    margin-bottom 5rem
    li
      font-size .75rem
      margin .8rem 0
      span
        font-weight bold

@media(max-width 1000px)
  .side-nav 
    width 100%
    max-width 560px
    margin 0
</style>