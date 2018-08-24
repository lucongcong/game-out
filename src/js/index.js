import Vue from 'vue'

import '@/scss/index'

import testView from '@/components/login'
import {
  Button,
  Modal,
  Toast
} from 'antd-mobile';

var vm = new Vue({
  el: '#app',
  components: {
    testView
  },
  data: {
    test: '这是测试数据'
  },
  methods: {
    getImgUrl: function () {
      return require(`../assets/icon_success.png`);
    }
  }
})