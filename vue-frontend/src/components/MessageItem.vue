<!-- components/MessageItem.vue -->
<template>
  <div :class="messageClass">
    {{ message.text }}
    <span class="message-timestamp">{{ message.timestamp }}</span>
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
