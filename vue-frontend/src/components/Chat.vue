<!-- components/Chat.vue -->
<template>
  <div class="chat">
    <!-- Chat messages will be displayed here -->
    <div class="chat-messages" ref="messageContainer">
      <!-- Use the MessageItem component to display messages -->
      <MessageItem v-for="message in messages" :key="message.id" :message="message" />
    </div>
    <!-- User input and send button -->
    <div class="chat-input">
      <input v-model="userMessage" @keydown.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import MessageItem from './MessageItem.vue'; 

export default {
  name: 'ChatComponent',
  components: {
    MessageItem, 
  },
  data() {
    return {
      userMessage: '',
      messages: [], 
    };
  },
  methods: {
    async sendMessage() {
      const userMessage = this.userMessage;

      this.addMessage('user', userMessage);

      const response = await this.sendToDialogflow(userMessage);

      this.addMessage('bot', response);

      this.userMessage = '';

      this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
    },
    async sendToDialogflow(userMessage) {
      const response = await fetch('/dialogflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from Dialogflow');
      }

      const data = await response.json();
      return data.message;
    },
    addMessage(sender, text) {
      const timestamp = new Date().toLocaleTimeString();
      this.messages.push({ sender, text, timestamp });
    },
  },
};
</script>

<style scoped>

</style>
