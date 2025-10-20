<template>
</template>
<script>
export default {
  onLoad(option) {
    this.autoLogin()
  },
  methods: {
    autoLogin() {
      let token = uni.getStorageSync('token');
      if (!token) {
        uni.reLaunch({
          url: '/pages/login/index'
        })
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  }
}
</script>