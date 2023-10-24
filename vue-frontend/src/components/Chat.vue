<!-- components/Chat.vue -->
<template>
  <div class="container">
    <div class="avatar">
      <p>THIS IS A PLACE HOLDER</p>
    </div>
    <div class="chat">
      <!-- Chat messages will be displayed here -->
      <div class="chat-messages" ref="messageContainer">
        <div class="message-container">
          <!-- Use the MessageItem component to display messages -->
          <MessageItem v-for="message in messages" :key="message.id" :message="message" />
        </div>
      </div>
      <!-- User input and send button -->
      <div class="chat-input">
        <input v-model="userMessage" @keydown.enter="sendMessage" placeholder="Type a message..." />
      </div>
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
      lastMessageTimestamp: null, // Add this property
    };
  },
  methods: {
    async sendMessage() {
      const userMessage = this.userMessage;

      this.addMessage('user', userMessage);

      const response = await this.sendToDialogflow(userMessage);

      this.addMessage('bot', response);

      this.userMessage = '';

      // Scroll to the bottom after adding a new message
      setTimeout(() => {
        this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
      }, 0);
    },
    async sendToDialogflow(userMessage) {
      const response = await fetch('http://localhost:4567/dialogflow', { // Specify the complete URL
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
      const currentTime = new Date();
      const timestamp = currentTime.toLocaleTimeString();

      if (
        this.lastMessageTimestamp === null ||
        currentTime - this.lastMessageTimestamp >= 30 * 60 * 1000
      ) {
        // Only add a new timestamp if it's been more than 30 minutes
        this.messages.push({ timestamp, isTimestamp: true }); // Add isTimestamp property
      }

      this.messages.push({ sender, text });
      this.lastMessageTimestamp = currentTime;
    },
  },
};
</script>

<style scoped></style>
