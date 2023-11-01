<!-- components/Chat.vue -->
<template>
  <div class="container">
    <div class="avatar">
      <img :src="selectedAnimation" alt="Animated GIF" style="max-width: 100%;" />
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
      lastMessageTimestamp: null,
      selectedAnimation: 'WaveFinalCrop.gif',
    };
  },
  mounted() {

    setTimeout(() => {
      this.sendWelcomeMessage();
    }, 2000);
  },
  methods: {
    async sendMessage() {
      const userMessage = this.userMessage;

      this.addMessage('user', userMessage);

      const response = await this.sendToDialogflow(userMessage);

      this.addMessage('bot', response);

      this.userMessage = '';

      setTimeout(() => {
        this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
      }, 0);
    },

    async sendToDialogflow(userMessage) {
      if (!this.serverPort) {
        console.error('Server port is not defined.');
        return;
      }

      const serverUrl = `http://${window.location.hostname}:${this.serverPort}/dialogflow`;

      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from Dialogflow');
      }

      else {
        if (this.selectedAnimation === "WaveFinalCrop.gif") {
          this.selectedAnimation = 'TalkFinalCrop.gif';

          setTimeout(() => {
            this.selectedAnimation = 'IdleFinalCrop.gif';
          }, 3000);
        } else {
          this.selectedAnimation = 'TalkFinalCrop.gif';

          setTimeout(() => {
            this.selectedAnimation = 'IdleFinalCrop.gif';
          }, 3000);
        }
      }

      const data = await response.json();
      return data.message;
    },

    sendWelcomeMessage() {
      const welcomeMessage = 'Hi! I\'m Ryan Adriaans and this is my interactive resume. Please ask any questions you might have about me.';
      this.addMessage('bot', welcomeMessage);
    },

    addMessage(sender, text) {
      const currentTime = new Date();
      const timestamp = currentTime.toLocaleTimeString();

      if (
        this.lastMessageTimestamp === null ||
        currentTime - this.lastMessageTimestamp >= 30 * 60 * 1000
      ) {
        // Only add a new timestamp if it's been more than 30 minutes
        this.messages.push({ timestamp, isTimestamp: true });
      }

      this.messages.push({ sender, text });
      this.lastMessageTimestamp = currentTime;
    },
  },
};
</script>

<style scoped></style>