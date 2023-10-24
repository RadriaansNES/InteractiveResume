<!-- components/MessageItem.vue -->
<template>
  <div :class="messageClass">
    <div v-if="message.isTimestamp" class="message-timestamp">{{ message.timestamp }}</div>
    <div v-else class="message-text">{{ message.text }}</div>
  </div>
</template>

<script>
export default {
  props: ['message'],
  computed: {
    messageClass() {
      return {
        'user-message': this.message.sender === 'user',
        'bot-message': this.message.sender === 'bot',
      };
    },
  },
};
</script>

<style scoped>

</style>
