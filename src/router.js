import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import HomeItem from './views/HomeItem.vue'
import HomeSet from './views/HomeSet.vue'
import HomeReq from './views/HomeReq.vue'
import Item from './views/Item.vue'
import Set from './views/Set.vue'
import SetItem from './views/SetItem.vue'
import SetHome from './views/SetHome.vue'
import User from './views/User.vue'
import UserLiked from './views/UserLiked.vue'
import UserPublished from './views/UserPublished.vue'
import UserPrivate from './views/UserPrivate.vue'
import Tag from './views/Tag.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      name: 'home',
      component: Home,
      path: '/',
      children: [
        {
          path: '/',
          component: HomeItem
        },
        {
          path: '/sets',
          component: HomeSet
        },
        {
          path: '/requests',
          component: HomeReq
        }
      ]
    },
    {
      path: '/item/:id',
      name: 'item',
      component: Item
    },
    {
      path: '/set/:id',
      name: 'set',
      component: Set,
      children: [
        {
          path: 'home',
          component: SetHome
        },
        {
          path: ':num/:iid',
          component: SetItem
        }
      ]
    },
    {
      path: '/user/:uid',
      name: 'user',
      component: User,
      children: [
        {
          path: '/user/:uid/liked',
          component: UserLiked
        },
        {
          path: '/user/:uid',
          component: UserPublished
        },
        {
          path: '/user/:uid/private',
          component: UserPrivate
        }
      ]
    },
    {
      path: '/tag/:tag',
      name: 'tag',
      component: Tag
    }
  ]
})
