<template>
  <div id="app" class="font-main">
    <Header />
    <main class="mx-auto">
      <router-view :key="$route.path" />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Lato:400,700&display=swap');
body
  font-size 15px
  button
    font-weight bold
    font-size .875rem
    display block
  button:focus
    outline 0
  input:focus,
  textarea:focus
    outline none
  li
    list-style none

main
  width 95%
  max-width 1500px
  min-height 800px
  margin 6rem 0
  .fade-enter-active,
  .fade-leave-active
    transition-duration 0.2s
    transition-property opacity
    transition-timing-function ease
  .fade-enter,
  .fade-leave-active
    opacity 0
    
nav
  button
    color #cbd5e0
</style>
