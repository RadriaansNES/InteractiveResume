<!-- App.vue -->
<template>
  <ChatComponent/>
</template>

<script>
import ChatComponent from './components/Chat.vue' 

export default {
  name: 'App',
  components: {
    ChatComponent
  }
}
</script>

<style>
@import './App.scss';
</style>
