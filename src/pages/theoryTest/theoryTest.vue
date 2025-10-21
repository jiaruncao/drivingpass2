<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <text class="page-title">Theory Test</text>
    </view>

    <!-- 主要内容 -->
    <view class="container">
      <!-- 首页视图 -->
      <view v-if="currentView === 'home'" class="mode-cards-container">
        <view class="mode-card learn" @tap="selectMode('learn')">
          <view class="mode-icon">📚</view>
          <text class="mode-title">Learn Mode</text>
          <text class="mode-subtitle">Study at your own pace</text>
          <view class="progress-info">
            <text class="progress-label">Progress</text>
            <text class="progress-value">{{ overallProgress }}%</text>
          </view>
        </view>

        <view class="mode-card test" @tap="selectMode('test')">
          <view class="mode-icon">📝</view>
          <text class="mode-title">Test Mode</text>
          <text class="mode-subtitle">Practice like the real exam</text>
          <view class="progress-info">
            <text class="progress-label">Practiced</text>
            <text class="progress-value">{{ testsPracticed }}x</text>
          </view>
        </view>
      </view>

      <!-- 测试模式视图 -->
      <view v-if="currentView === 'test'" class="options-container">
        <view class="options-card">
          <view class="option-item">
            <text class="option-label">Number of Questions</text>
            <view class="option-value" @tap="showQuantityPicker = true">
              <text>{{ testOptions.questionCount }}</text>
              <text style="color: #999;">›</text>
            </view>
          </view>
          <view class="option-item">
            <text class="option-label">Test All Questions</text>
            <view class="toggle-switch" :class="{active: testOptions.testAll}" @tap="toggleTestAll"></view>
          </view>
          <view class="option-item">
            <text class="option-label">Skip Correct Answers</text>
            <view class="toggle-switch" :class="{active: testOptions.skipCorrect}" @tap="toggleSkipCorrect"></view>
          </view>
        </view>

        <view class="button-container">
          <view class="action-button" @tap="startTest">Start Exam</view>
        </view>
      </view>

      <!-- 学习模式视图 -->
      <view v-if="currentView === 'learn'" class="categories-container">
        <view v-for="category in categories" 
              :key="category.id"
              class="category-card" 
              :class="{selected: selectedCategory === category.id}"
              @tap="selectCategory(category.id)">
          <view class="category-header">
            <view class="category-left">
              <view class="radio-button" :class="{selected: selectedCategory === category.id}"></view>
              <text class="category-name">{{ category.name }}</text>
            </view>
            <text class="category-progress">{{ category.progress }}%</text>
          </view>
          <view class="category-stats">
            <text>Total: {{ category.total }}</text>
            <text>Wrong: {{ category.wrong }}</text>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{width: category.progress + '%'}"></view>
          </view>
        </view>

        <view class="button-container">
          <view class="action-button" @tap="startLearning">Start Learning</view>
        </view>
      </view>
    </view>

    <!-- 数量选择器模态框 -->
    <view v-if="showQuantityPicker" class="modal-backdrop" @tap="closeModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">Select Number of Questions</text>
        </view>
        <view class="picker-container">
          <text class="range-value">{{ tempQuestionCount }}</text>
          <slider class="range-slider" 
                  :value="tempQuestionCount" 
                  :min="10" 
                  :max="100" 
                  :step="10"
                  @change="onSliderChange"
                  activeColor="#4A9EFF"
                  backgroundColor="#E0E0E0"
                  block-color="#4A9EFF"
                  block-size="24"/>
          <view class="range-labels">
            <text>10</text>
            <text>100</text>
          </view>
        </view>
        <view class="modal-actions">
          <view class="modal-button cancel" @tap="showQuantityPicker = false">Cancel</view>
          <view class="modal-button confirm" @tap="confirmQuantity">Confirm</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {getThree} from '@/http/api/testQuestions.js'
export default {
  data() {
    return {
      subject_id: null,
      currentView: 'home', // 当前视图状态
      overallProgress: 81, // 整体学习进度
      testsPracticed: 12, // 测试练习次数
      showQuantityPicker: false, // 是否显示数量选择器
      tempQuestionCount: 50, // 临时题目数量
      selectedCategory: 1, // 选中的学习分类
      testOptions: {
        questionCount: 50, // 测试题目数量
        testAll: true, // 是否测试所有题目
        skipCorrect: false // 是否跳过已答对的题目
      },
      categories: []
    }
  },
  computed: {
    // 计算页面标题
    pageTitle() {
      switch(this.currentView) {
        case 'home':
          return 'Theory Test';
        case 'test':
          return 'Test Mode';
        case 'learn':
          return 'Learn Mode';
        default:
          return 'Theory Test';
      }
    }
  },
  methods: {
    // 选择学习或测试模式
    selectMode(mode) {
      this.currentView = mode;
    },
    // 返回上一页或退出应用
    goBack() {
      if (this.currentView === 'home') {
        // 首页的返回按钮可以关闭应用或返回上级页面
        console.log('Navigate back or close app');
        // 实际应用中可以调用返回上级页面的API
        uni.navigateBack({
          fail: () => {
            // 如果没有上级页面，可以退出应用
            console.log('No previous page, exit app');
          }
        });
      } else {
        this.currentView = 'home';
      }
    },
    // 选择学习分类
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
    // 切换测试所有题目选项
    toggleTestAll() {
      this.testOptions.testAll = !this.testOptions.testAll;
    },
    // 切换跳过正确答案选项
    toggleSkipCorrect() {
      this.testOptions.skipCorrect = !this.testOptions.skipCorrect;
    },
    // 滑块变化事件
    onSliderChange(e) {
      this.tempQuestionCount = e.detail.value;
    },
    // 确认题目数量选择
    confirmQuantity() {
      this.testOptions.questionCount = this.tempQuestionCount;
      this.showQuantityPicker = false;
    },
    // 关闭模态框
    closeModal() {
      this.showQuantityPicker = false;
    },
    // 开始测试
    startTest() {
      console.log('Starting test with options:', this.testOptions);
      // 这里可以调用API开始测试
      uni.showToast({
        title: '开始测试',
        icon: 'success'
      });
    },
    // 开始学习
    startLearning() {
      const category = this.categories.find(c => c.id === this.selectedCategory);
      console.log('Starting learning for category:', category);
      // 这里可以调用API开始学习
      uni.showToast({
        title: '开始学习',
        icon: 'success'
      });
      // 跳转答题
      uni.navigateTo({
        url: '/pages/learnQuestion/index?cate_id=' + this.selectedCategory
      })
    },
    // 获取用户进度数据 - API调用示例
    async fetchUserProgress() {
      try {
        const response = await uni.request({
          url: '/api/user/progress',
          method: 'GET'
        });
        if (response[1].statusCode === 200) {
          this.overallProgress = response[1].data.overallProgress;
          this.testsPracticed = response[1].data.testsPracticed;
        }
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
      }
    },
    // 获取分类数据
    async fetchCategories() {
      try {
        const response = await getThree({
          kind: 'QUESTION',
          subject_id: this.subject_id
        })
        if (response.code === 1) {
          this.categories = response.data;
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
  },
  onLoad(options) {
    this.subject_id = options.id
    // this.fetchCategories();
  }
}
</script>

<style lang="scss">
/* 全局重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #333;
  padding-bottom: env(safe-area-inset-bottom, 0);
  overflow-x: hidden;
}

/* 渐变背景 */
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 100%);
}

.gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  background: linear-gradient(180deg, #FFFFFF 0%, #FFF4F4 100%);
}

/* Header 样式 */
.header {
  padding: 30rpx 40rpx;
  display: flex;
  align-items: center;
  background: transparent;
  position: relative;
  z-index: 10;
  min-height: 120rpx;
  gap: 24rpx;
}

.back-button {
  background: none;
  border: none;
  color: #666666;
  font-size: 40rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
}

.page-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
  margin-right: 80rpx;
}

/* 容器 */
.container {
  flex: 1;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  gap: 40rpx;
}

/* 模式选择卡片 */
.mode-cards-container {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280rpx, 1fr));
  justify-content: center;
  gap: 40rpx;
  max-width: 700rpx;
  width: 100%;
  margin: 0 auto;
}

.mode-card {
  background: white;
  border-radius: 40rpx;
  padding: 60rpx 50rpx;
  text-align: center;
  box-shadow: 0 16rpx 50rpx rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.mode-card:active {
  transform: scale(0.98);
}

.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8rpx;
}

.mode-card.learn::before {
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
}

.mode-card.test::before {
  background: linear-gradient(90deg, #FF6B6B 0%, #FF5252 100%);
}

.mode-icon {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto 40rpx;
  background: #F8F9FA;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
}

.mode-title {
  font-size: 44rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
  color: #333;
  display: block;
}

.mode-subtitle {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
  line-height: 1.4;
  display: block;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 32rpx;
  border-top: 2rpx solid #F0F0F0;
}

.progress-label {
  font-size: 28rpx;
  color: #999;
}

.progress-value {
  font-size: 48rpx;
  font-weight: 700;
}

.learn .progress-value {
  color: #4A9EFF;
}

.test .progress-value {
  color: #FF6B6B;
}

/* 选项容器 */
.options-container {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280rpx, 1fr));
  gap: 40rpx;
  max-width: 700rpx;
  width: 100%;
  margin: 0 auto;
}

.options-card {
  background: white;
  border-radius: 40rpx;
  padding: 50rpx;
  box-shadow: 0 16rpx 50rpx rgba(0, 0, 0, 0.08);
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36rpx 0;
  border-bottom: 2rpx solid #F5F5F5;
}

.option-item:last-child {
  border-bottom: none;
}

.option-label {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.option-value {
  font-size: 32rpx;
  color: #4A9EFF;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.toggle-switch {
  width: 96rpx;
  height: 56rpx;
  background: #E0E0E0;
  border-radius: 28rpx;
  position: relative;
  transition: background 0.3s;
}

.toggle-switch.active {
  background: #4A9EFF;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 44rpx;
  height: 44rpx;
  background: white;
  border-radius: 50%;
  top: 6rpx;
  left: 6rpx;
  transition: transform 0.3s;
  box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.2);
}

.toggle-switch.active::after {
  transform: translateX(40rpx);
}

/* 分类选择 */
.categories-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: calc(200rpx + env(safe-area-inset-bottom, 0));
  max-width: 700rpx;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280rpx, 1fr));
  gap: 32rpx;
}

.category-card {
  background: white;
  border-radius: 40rpx;
  padding: 40rpx;
  box-shadow: 0 10rpx 36rpx rgba(0,0,0,0.06);
  border: 4rpx solid transparent;
}

.category-card:active {
  transform: scale(0.98);
}

.category-card.selected {
  border-color: #4A9EFF;
  background: #F8FBFF;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.category-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.radio-button {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #4A9EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  flex-shrink: 0;
}

.radio-button.selected::after {
  content: '';
  width: 20rpx;
  height: 20rpx;
  background: #4A9EFF;
  border-radius: 50%;
}

.category-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.category-progress {
  font-size: 32rpx;
  font-weight: 600;
  color: #4A9EFF;
}

.category-stats {
  display: flex;
  gap: 50rpx;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 24rpx;
  padding-left: 64rpx;
}

.progress-bar {
  width: calc(100% - 64rpx);
  height: 12rpx;
  background: #F0F0F0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-left: 64rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
  border-radius: 6rpx;
  transition: width 0.5s ease;
}

/* 操作按钮 */
.button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 40rpx;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom, 0));
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 30%, white 100%);
  z-index: 20;
}

.action-button {
  width: 100%;
  max-width: 660rpx;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 12rpx 40rpx rgba(74, 158, 255, 0.35);
  text-align: center;
}

.action-button:active {
  transform: scale(0.98);
}

/* 模态框 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.modal-content {
  background: white;
  border-radius: 50rpx 50rpx 0 0;
  padding: 50rpx 40rpx calc(70rpx + env(safe-area-inset-bottom, 0));
  width: 100%;
  animation: slideUp 0.3s ease;
}

.modal-header {
  text-align: center;
  margin-bottom: 50rpx;
}

.modal-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
}

.picker-container {
  padding: 30rpx 0;
}

.range-slider {
  width: 100%;
  margin: 40rpx 0;
}

.range-value {
  text-align: center;
  font-size: 84rpx;
  font-weight: 700;
  color: #4A9EFF;
  margin: 30rpx 0;
  display: block;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #999;
  margin-top: 16rpx;
}

.modal-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 70rpx;
}

.modal-button {
  flex: 1;
  padding: 28rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-button.cancel {
  background: #F5F5F5;
  color: #666;
}

.modal-button.confirm {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  box-shadow: 0 6rpx 24rpx rgba(74, 158, 255, 0.3);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* 移动端优化 */
@media screen and (max-width: 750rpx) {
  .mode-cards-container {
    max-width: 640rpx;
  }

  .options-container,
  .categories-container {
    max-width: 640rpx;
  }

  .mode-card {
    padding: 50rpx 40rpx;
  }

  .mode-title {
    font-size: 40rpx;
  }

  .mode-icon {
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
  }
}
</style>
