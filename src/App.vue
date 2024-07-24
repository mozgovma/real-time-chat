<template>
  <h1>Real-time-chat</h1>
  <div class="container" v-if="!isAuthenticated">
    <input v-model="login" @input="updateLogin" type="text" placeholder="Введите имя пользователя">
    <input v-model="email" @input="updateEmail" type="email" placeholder="Введите email">
    <button @click="checkUserInfo">Войти</button>
  </div>
  <div className="container-auth" v-else>
    <ChatUsers :authenticatedUser="authenticatedUser" :usersData="usersData" />
  </div>
</template>

<script>
import axios from 'axios';
import ChatUsers from './components/ChatUsers.vue';

export default {
  data() {
    return {
      login: '',
      email: '',
      usersData: null,
      matchedUser: null,
      isAuthenticated: false,
      authenticatedUser: null
    };
  },
  methods: {
    async getUsersData() {
      try {
        const response = await axios.get(`https://hr2.sibers.com/test/frontend/users.json`);
        this.usersData = response.data;
        console.log(this.usersData)
      } catch (error) {
        console.error('Произошла ошибка при получении данных:', error);
      }
    },
    updateLogin() {
      this.matchedUser = null; // Сброс совпадающего пользователя при изменении ввода
    },
    updateEmail() {
      this.matchedUser = null; // Сброс совпадающего пользователя при изменении ввода
    },
    checkUserInfo() {
      if (this.usersData) {
        this.matchedUser = this.usersData.find(user => user.username === this.login && user.email === this.email);
        if (this.matchedUser) {
          alert('Пользователь успешно авторизован!');
          this.isAuthenticated = true;
          this.authenticatedUser = this.matchedUser;
          console.log(this.authenticatedUser)
        }
      }
    }
  },
  mounted() {
    this.getUsersData();
  },
  components: {
    ChatUsers,
  }
};
</script>

<style scoped>
input {
  border-radius: 3px;
  border: 0;
  padding: 10px 15px;
  background: #fafafa;
  color: black;
  outline: none;
  width: 300px;
  position: relative;
  top: -50px;
  font-size: 1.2em;
  margin: 15px 0;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container-auth{
  width: 100%;
  height: 900px;
  
}
button {
  border-radius: 3px;
  border: 0;
  padding: 10px 15px;
  background: #fafafa;
  color: black;
  outline: none;
  width: 200px;
  position: relative;
  top: -50px;
  font-size: 1.2em;
  margin: 15px 0;
}
.container-1 {  
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "users chat chat"
    "users chat chat"
    "users chat chat";
    height: 100%;
}

.authUser {     
  text-align: center;
  display: flex;
  align-items: center;
  align-content: center;
  height: 100px;
  margin-left: 20px;
}

.users { grid-area: users; background:#2a4d75;border-right:1px solid white;}

.chat { grid-area: chat; background:#2a4d75; }

.contact-list {
  height: 100%; /* Высота контейнера контактов */
  overflow-y: scroll; /* Включить вертикальную прокрутку */
  border: 1px solid #ccc; /* Добавить рамку для контейнера контактов */
}

.contact {
  padding: 10px;
  border-bottom: 1px solid #eee; /* Добавить разделительную линию между контактами */
  box-sizing: border-box;
}

.contact:hover {
  background-color: #f0f0f0; /* Изменение цвета фона при наведении */
}
.contact:last-child {
  border-bottom: none; /* Убрать разделительную линию у последнего контакта */
}
</style>