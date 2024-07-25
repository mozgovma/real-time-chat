<template>
  <div class="dialog">
    <div v-if="selectedUser" class="dialog-content">
      <h3>{{ '@' + selectedUser.username }}</h3>
      <div class="messages-container">
        <div v-for="message in messages" :key="message.id" :class="['message', message.type]">{{ message.message }}</div>
      </div>
      <div class="message-input">
        <input type="text" placeholder="Введите сообщение" v-model="newMessage">
        <button @click="sendMessage">Отправить</button>
      </div>
    </div>
    <div v-else>
      <p class="userName">Выберите собеседника для начала диалога</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';

export default {
  props: ['selectedUser', 'authenticatedUser'],
  data() {
    return {
      newMessage: '',
      messages: [],
      socket: null
    };
  },
  async mounted() {
    if (this.selectedUser) {
      await this.fetchMessages();
      this.setupSocket();
    }
  },
  methods: {
  async fetchMessages() {
    // Проверяем наличие данных
    if (!this.selectedUser || !this.authenticatedUser) {
      console.error('Ошибка: selectedUser или authenticatedUser не установлены.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/messages', {
        params: {
          fromUser: this.authenticatedUser.username,
          toUser: this.selectedUser.username
        }
      });
      this.messages = response.data.map(message => ({
        ...message,
        type: message.fromUser === this.authenticatedUser.username ? 'outgoing' : 'incoming'
      }));
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
    }
  },
  setupSocket() {
    this.socket = io('http://localhost:3000');
    this.socket.on('newMessage', (message) => {
      if ((message.fromUser === this.authenticatedUser.username && message.toUser === this.selectedUser.username) ||
          (message.fromUser === this.selectedUser.username && message.toUser === this.authenticatedUser.username)) {
        message.type = message.fromUser === this.authenticatedUser.username ? 'outgoing' : 'incoming';
        this.messages.push(message);
      }
    });
  },
  async sendMessage() {
    try {
      const response = await axios.post('http://localhost:3000/messages', {
        fromUser: this.authenticatedUser.username,
        toUser: this.selectedUser.username,
        message: this.newMessage
      });

      // Очищаем поле ввода после отправки
      this.newMessage = '';
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  }
},
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  watch: {
    selectedUser: 'fetchMessages'
  }
};
</script>

<style scoped>
.dialog {
  display: flex;
  flex-direction: column;
  background-color: #000000;
  color: #ffffff;
  padding: 14px;
  margin: 0 auto;
  height: calc(100% - 156.8px);
  box-sizing: border-box;
  overflow: auto;
}

.dialog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
}

.messages-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
}

h3 {
  color: #ffffff;
}

p {
  color: #ffffff;
}

.message {
  margin-bottom: 5px;
  padding: 8px;
  border-radius: 8px;
  max-width: 80%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.incoming {
  background-color: #2c2c2c;
  color: #ffffff;
  align-self: flex-start;
}

.outgoing {
  background-color: #4d4d4d;
  color: #ffffff;
  align-self: flex-end;
}

.message-input {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-top: 10px;
}

input {
  flex: 1;
  padding: 8px;
  border-radius: 5px;
  border: none;
  background-color: #333333;
  color: #ffffff;
  margin-right: 10px;
}

button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

</style>
