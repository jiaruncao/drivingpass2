<template>
  <u-popup
    :show="submitShow"
    @close="close"
    mode="center"
    round="24"
    :customStyle="{ backgroundColor: 'transparent' }"
  >
    <view class="submit-popup">
      <view class="submit-card">
        <view class="submit-header">
          <text class="submit-title">Test Summary</text>
          <text class="submit-time">Time Used 14:24</text>
        </view>
        <view class="score-ring">
          <view class="score-circle">
            <view class="score-value">79<text>%</text></view>
            <text class="score-label">Accuracy</text>
          </view>
        </view>
        <view class="score-breakdown">
          <view class="breakdown-card">
            <text class="breakdown-value">9</text>
            <text class="breakdown-label">Wrong Answers</text>
          </view>
          <view class="breakdown-divider"></view>
          <view class="breakdown-card">
            <text class="breakdown-value">12</text>
            <text class="breakdown-label">Total Questions</text>
          </view>
        </view>
        <view class="submit-actions">
          <view class="btn secondary" @click="findDetails">Review Answers</view>
          <view class="btn primary" @click="backHome">Back to Home</view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  data() {
    return {
      submitShow: false,
    };
  },
  methods: {
    backHome() {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
    findDetails() {
      this.submitShow = false;
      this.$emit("findAllQuestion");
    },
    init() {
      this.submitShow = true;
    },
    close() {
      this.submitShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-popup {
  padding: 16rpx;
  width: 680rpx;
}

.submit-card {
  background: radial-gradient(circle at top, rgba(74, 158, 255, 0.25), rgba(33, 150, 243, 0.08));
  border-radius: 40rpx;
  padding: 48rpx 40rpx 40rpx;
  box-shadow: 0 34rpx 60rpx rgba(31, 71, 168, 0.16);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.submit-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.submit-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #0f172a;
}

.submit-time {
  font-size: 26rpx;
  color: #475569;
}

.score-ring {
  display: flex;
  justify-content: center;
}

.score-circle {
  width: 280rpx;
  height: 280rpx;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #4a9eff, #2563eb, #4a9eff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
  box-shadow: 0 26rpx 40rpx rgba(37, 99, 235, 0.3);
}

.score-circle::after {
  content: "";
  position: absolute;
  inset: 18rpx;
  border-radius: 50%;
  background: #0f172a;
  opacity: 0.15;
}

.score-value {
  position: relative;
  font-size: 80rpx;
  font-weight: 800;
  z-index: 1;
}

.score-value text {
  font-size: 28rpx;
  margin-left: 4rpx;
}

.score-label {
  position: relative;
  z-index: 1;
  font-size: 26rpx;
  letter-spacing: 2rpx;
  text-transform: uppercase;
}

.score-breakdown {
  display: flex;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 26rpx;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.25);
}

.breakdown-card {
  flex: 1;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.breakdown-divider {
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(148, 163, 184, 0.4), transparent);
}

.breakdown-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #0f172a;
}

.breakdown-label {
  font-size: 24rpx;
  color: #475569;
  text-align: center;
}

.submit-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.btn {
  width: 100%;
  height: 92rpx;
  border-radius: 999px;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  box-shadow: 0 16rpx 36rpx rgba(37, 99, 235, 0.35);
}

.btn.secondary {
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  box-shadow: inset 0 0 0 2rpx rgba(37, 99, 235, 0.25);
}

.btn:active {
  transform: scale(0.98);
}
</style>
