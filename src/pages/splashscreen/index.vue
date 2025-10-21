<template>
  <view class="splash">
    <view class="splash-content">
      <view class="spinner"></view>
      <text class="loading-text">Preparing your experience...</text>
    </view>
  </view>
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

<style lang="scss" scoped>
.splash {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: 5vw;
  padding-right: 5vw;
  background: linear-gradient(180deg, #1d4ed8 0%, #0f172a 100%);
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  color: #ffffff;
}

.spinner {
  width: 80rpx;
  height: 80rpx;
  border-radius: 999rpx;
  border: 6rpx solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 28rpx;
  text-align: center;
  word-break: break-word;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
