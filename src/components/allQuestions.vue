<template>
  <u-popup
    :show="allQuestionShow"
    @close="close"
    :closeOnClickOverlay="true"
    :customStyle="{ backgroundColor: 'transparent', padding: '0 32rpx 40rpx' }"
  >
    <view class="question-popup">
      <view class="popup-handle"></view>
      <view class="popup-card">
        <view class="popup-header">
          <view>
            <view class="popup-title">Question Navigator</view>
            <view class="popup-subtitle">Track your progress and jump instantly</view>
          </view>
          <view class="toolbar-action" @click="saveQuestion">
            <view class="toolbar-icon">
              <u-icon
                :name="startLearnQuestion.save ? 'star-fill' : 'star'"
                size="20"
                :color="startLearnQuestion.save ? '#FFE066' : '#4A9EFF'"
              ></u-icon>
            </view>
            <text class="toolbar-label">{{ startLearnQuestion.save ? "Saved" : "Save" }}</text>
          </view>
        </view>
        <view class="status-row">
          <view class="status-chip success">
            <u-icon name="checkmark-circle-fill" color="#fff" size="18"></u-icon>
            <text class="status-text">16 Correct</text>
          </view>
          <view class="status-chip error">
            <u-icon name="close-circle-fill" color="#fff" size="18"></u-icon>
            <text class="status-text">16 Incorrect</text>
          </view>
          <view class="status-chip total">
            <u-icon name="grid" size="18" color="#2563EB"></u-icon>
            <text class="status-text">
              <text class="status-strong">23</text>
              <text class="status-muted">/1590</text>
            </text>
          </view>
        </view>
        <scroll-view scroll-y class="question-list">
          <view class="question-grid">
            <view
              class="question-item"
              v-for="(item, i) in 99"
              :key="i"
              :class="{
                incorrect: i === 1 || i === 2 || i === 3,
                correct: i === 7 || i === 5 || i === 11
              }"
            >
              {{ i + 1 }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    startLearnQuestion: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      allQuestionShow: false,
    };
  },
  methods: {
    close() {
      this.allQuestionShow = false;
    },
    init() {
      this.allQuestionShow = true;
    },
    saveQuestion() {
      this.$emit("toggleSave");
      this.$emit("saveQuestion");
    },
  },
};
</script>

<style lang="scss" scoped>
.question-popup {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.popup-handle {
  width: 120rpx;
  height: 10rpx;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  margin: 20rpx auto 30rpx;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8);
}

.popup-card {
  width: 100%;
  background: linear-gradient(160deg, rgba(74, 158, 255, 0.12), rgba(33, 150, 243, 0.05));
  border-radius: 40rpx;
  padding: 36rpx;
  box-shadow: 0 26rpx 60rpx rgba(31, 71, 168, 0.18);
  backdrop-filter: blur(10px);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rpx;
}

.popup-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1f2937;
}

.popup-subtitle {
  font-size: 24rpx;
  color: #4b5563;
  margin-top: 6rpx;
}

.toolbar-action {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 14rpx 24rpx;
  background: rgba(74, 158, 255, 0.12);
  border-radius: 999px;
  border: 1px solid rgba(74, 158, 255, 0.35);
  box-shadow: 0 10rpx 20rpx rgba(74, 158, 255, 0.18);
}

.toolbar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-label {
  font-size: 26rpx;
  font-weight: 600;
  color: #1f2937;
}

.status-row {
  display: flex;
  gap: 20rpx;
  margin: 36rpx 0 20rpx;
  flex-wrap: wrap;
}

.status-chip {
  flex: 1;
  min-width: 30%;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 24rpx;
  border-radius: 28rpx;
  box-shadow: 0 16rpx 26rpx rgba(31, 71, 168, 0.12);
}

.status-chip.success {
  background: linear-gradient(135deg, #34d399, #10b981);
}

.status-chip.error {
  background: linear-gradient(135deg, #fb7185, #f43f5e);
}

.status-chip.total {
  background: #f1f5f9;
  border: 1px solid rgba(37, 99, 235, 0.2);
  box-shadow: none;
}

.status-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #fff;
}

.status-chip.total .status-text {
  color: #1f2937;
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}

.status-strong {
  font-size: 32rpx;
  font-weight: 700;
}

.status-muted {
  font-size: 24rpx;
  color: #64748b;
}

.question-list {
  max-height: 60vh;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.25);
  padding: 24rpx;
}

.question-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28rpx;
}

.question-item {
  width: 78rpx;
  height: 78rpx;
  border-radius: 50%;
  text-align: center;
  line-height: 78rpx;
  font-weight: 600;
  font-size: 26rpx;
  color: #1f2937;
  background: #f8fafc;
  border: 2px solid transparent;
  box-shadow: 0 10rpx 16rpx rgba(15, 23, 42, 0.08);
  transition: all 0.2s ease;
}

.question-item.correct {
  color: #0f172a;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(37, 99, 235, 0.18));
  border-color: rgba(37, 99, 235, 0.4);
}

.question-item.incorrect {
  color: #7f1d1d;
  background: linear-gradient(135deg, rgba(252, 165, 165, 0.2), rgba(248, 113, 113, 0.25));
  border-color: rgba(248, 113, 113, 0.45);
}

.question-item:active {
  transform: scale(0.96);
}
</style>
