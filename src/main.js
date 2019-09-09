import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import '@/assets/css/tailwind.css'
import { firestorePlugin } from 'vuefire'          
import firebase from 'firebase'     
import 'firebase/firestore'
import Vue2Filters from 'vue2-filters'
import VueClipboard from 'vue-clipboard2'
import Toasted from 'vue-toasted'
import VueMeta from 'vue-meta'
import VueDisqus from 'vue-disqus'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUser,
  faHeart,
  faFeatherAlt,
  faCartPlus,
  faPlus,
  faLock,
  faCopy,
  faEllipsisV,
  faTimes,
  faBars,
  faHandPaper,
  faCode,
  faCoffee,
  faSmile,
  faMailBulk,
  faCube,
  faCubes,
  faLaugh,
} from '@fortawesome/free-solid-svg-icons'
import { 
  faTwitter 
} from '@fortawesome/free-brands-svg-icons'
library.add(
  faUser,
  faHeart,
  faFeatherAlt,
  faCartPlus,
  faPlus,
  faTwitter,
  faLock,
  faCopy,
  faEllipsisV,
  faTimes,
  faBars,
  faHandPaper,
  faCode,
  faCoffee,
  faSmile,
  faMailBulk,
  faCube,
  faCubes,
  faLaugh
)
Vue.component('fa', FontAwesomeIcon)

Vue.use(firestorePlugin)
firebase.initializeApp({              
  apiKey: "AIzaSyCmPbWZH6dcy5LN_Kl23Bye2qG7b25cypg",
  authDomain: "skil-hunt.firebaseapp.com",
  databaseURL: "https://skil-hunt.firebaseio.com",
  projectId: "skil-hunt",
  storageBucket: "skil-hunt.appspot.com",
  messagingSenderId: "187345559835",
  appId: "1:187345559835:web:cc5239f46aef4f87"
})
export const db = firebase.firestore()
export const auth = firebase.auth()

Vue.use(Vue2Filters)
Vue.use(VueClipboard)
Vue.use(VueMeta)
Vue.use(VueDisqus)
Vue.use(Toasted)
Vue.use(require('vue-moment'))

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
