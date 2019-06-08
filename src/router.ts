import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Mobile from './views/mobile/Mobile.vue';
import Message from './views/mobile/message/Message.vue';
import Chat from './views/mobile/chat/Chat.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/mobile',
      name: 'mobile',
      component: Mobile,
      children: [
        {
          path: 'message',
          name: 'mobileMessage',
          component: Message,
        },
        {
          path: 'chat',
          name: 'mobileChat',
          component: Chat,
        },
      ],
    },
  ],
});
