<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

/* 移除Ant Design Vue的默认边距 */
.ant-layout {
  background: transparent;
}

.ant-layout-sider {
  background: #001529;
}

.ant-layout-header {
  background: white;
  padding: 0;
  height: 64px;
  line-height: 64px;
}

.ant-layout-content {
  background: #f0f2f5;
}
</style>
