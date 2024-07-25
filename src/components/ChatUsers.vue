<template>
  <div class="container-1">
    <div class="users">
      <div class="authUser">
        <div>
          <img :src="authenticatedUser.avatar" class="imgProfile" alt="">
        </div>
        <div>
          <b><p>{{ '@' + authenticatedUser.username }}</p></b>
        </div>
        <a href="#" id="openModal"></a>
      </div>
      <div class="contact-list">
        <div v-for="user in usersData" :key="user.username" class="contact" @click="selectUser(user)">
          <div class="authUser">
            <div>
              <img :src="user.avatar" class="imgProfile" alt="">
            </div>
            <div>
              <p>{{ '@' + user.username }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat">
      <div class="search">
        <div class="inputSearch">
          <input type="text" v-model="searchQuery" placeholder="Поиск по имени пользователя" class="search-input" @focus="toggleFocusOnInput" @blur="toggleFocusOnInput">
        </div>
        <div class="user-list">
          <div v-for="user in filteredUsers" :key="user.username" class="user" @click="selectUser(user)">
            {{ user.username }}
          </div>
        </div>
      </div>
      <DialogUsers :selectedUser="activeUser" :authenticatedUser="authenticatedUser" />
      <div id="myModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <p>Здесь</p>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
import DialogUsers from './DialogUsers.vue'

export default {
  props: ['authenticatedUser', 'usersData'],
  data() {
    return {
      searchQuery: '',
      isInputFocused: false,
      activeUser: null,
    };
  },
  methods: {
  toggleFocusOnInput() {
    this.isInputFocused = !this.isInputFocused;
  },
  selectUser(user) {
    this.activeUser = user;
    console.log('Выбран пользователь:', user.username);
  },
},
  computed: {
    filteredUsers() {
      return this.usersData.filter(user => user.username && user.username.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
  },
  components: {
    DialogUsers,
  },
  mounted() {
    // Получаем ссылку и модальное окно
    var openModalLink = document.getElementById('openModal');
    var modal = document.getElementById('myModal');

    // Ссылка, открывающая модальное окно
    openModalLink.addEventListener('click', function(event) {
      event.preventDefault();
      modal.style.display = 'block';
    });

    // Кнопка закрытия модального окна
    var closeBtn = modal.getElementsByClassName('close')[0];
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });

    // Закрываем модальное окно при клике вне его
    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Concert+One&family=Fjalla+One&family=Inconsolata:wght@200..900&display=swap');

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
  background-color: black;
  color: white;
  border-top: 1px solid white;
}

.authUser {     
  text-align: center;
  display: flex;
  align-items: center;
  align-content: center;
  height: 100px;
  margin-left: 20px;
  color: white; /* Белый текст */
  font-family: "Inconsolata", monospace;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
}

.users { 
  grid-area: users;
  background: black;
  border-right: 1px solid white;
  display: flex;
  flex-direction: column;
}

.chat {
  grid-area: chat;
  background: black;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid white;
}

.imgProfile {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
}

.contact {
  padding: 10px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  color: white;
}

.contact:hover {
  background-color: #333;
}

.contact:last-child {
  border-bottom: none;
}

.user-list {
  overflow-y: auto;
  border: 1px solid white;
  height: 100px;
  width: 80%;
  color: white;
}

.user {
  padding: 10px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}

.user:hover {
  background-color: #333;
}

.user:last-child {
  border-bottom: none;
}

.search-input {
  border-radius: 3px;
  border: 0;
  background: #333;
  color: white;
  outline: none;
  width: 80%;
  position: relative;
  font-size: 1.2em;
  margin: 15px 0;
}

.search {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid white;
}

.inputSearch {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
