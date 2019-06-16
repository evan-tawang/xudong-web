import Vue from 'vue';
import Router from 'vue-router';
import RouterName from '@/constant/router-name';
import Login from '@/views/user/Login.vue';
import Home from './views/Home.vue';

import Mobile from './views/mobile/Mobile.vue';
import Message from './views/mobile/message/Message.vue';
import Chat from './views/mobile/chat/Chat.vue';

import StaffChat from './views/chat/StaffChat.vue';
import TalkSkillList from '@/views/talk-skill/TalkSkillList.vue';
import SensitiveWordList from '@/views/sensitive-word/SensitiveWordList.vue';
import BlackList from '@/views/blacklist/BlackList.vue';
import Allocate from '@/views/allocate/Allocate.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: RouterName.USER.LOGIN,
      component: Login,
    },
    // {
    //   path: '/home',
    //   name: RouterName.HOME,
    //   component: Home,
    // },
    {
      path: '/',
      name: RouterName.HOME,
      component: Home,
      children:[
        {
          path: 'staff-chat',
          name: RouterName.STAFF_CHAT,
          component: StaffChat,
        },
        {
          path: 'allocate',
          name: RouterName.ALLOCATE,
          component: Allocate,
        },
        {
          path: 'blacklist',
          name: RouterName.BLACKLIST,
          component: BlackList,
        },
        {
          path: 'sensitive-word',
          name: RouterName.SENSITIVE_WORD,
          component: SensitiveWordList,
        },
        {
          path: 'talk-skill',
          name: RouterName.TALK_SKILL_LIST,
          component: TalkSkillList,
        },
      ],
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
