<template>
  <div>
    <span>{{test}}</span>
  </div>
</template>
<script>
export default {
  name: 'test-view',
  data() {
    return {
      test: '我是一个测试组件路径'
    };
  }
};
</script>
<style scoped lang="scss">
@import '../scss/index.scss';
span {
  color: yellowgreen;
}
</style>
