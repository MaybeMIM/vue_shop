<template>
  <div>
    home
    <el-button type="danger" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logout() {
      // 清空
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style>
</style>