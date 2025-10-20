<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <text class="page-title">Hazard Test</text>
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
            <text class="option-label">Number of Videos</text>
            <view class="option-value" @tap="showQuantityPicker = true">
              <text>{{ testOptions.videoCount }}</text>
              <text style="color: #999;">›</text>
            </view>
          </view>
          <view class="option-item option-item-no-border">
            <text class="option-label option-label-mb">Video Selection</text>
            <view class="radio-group">
              <view class="radio-option" @tap="selectVideoType('all')">
                <view class="radio-circle" :class="{selected: testOptions.videoSelection === 'all'}"></view>
                <text class="radio-text">All Videos</text>
              </view>
              <view class="radio-option" @tap="selectVideoType('not_full_score')">
                <view class="radio-circle" :class="{selected: testOptions.videoSelection === 'not_full_score'}"></view>
                <text class="radio-text">Videos without Full Score</text>
              </view>
              <view class="radio-option" @tap="selectVideoType('unpracticed')">
                <view class="radio-circle" :class="{selected: testOptions.videoSelection === 'unpracticed'}"></view>
                <text class="radio-text">Unpracticed Videos</text>
              </view>
            </view>
          </view>
        </view>

        <view class="button-container">
          <view class="action-button" @tap="startTest">Start Test</view>
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
            <text>Practiced: {{ category.practiced }}</text>
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
          <text class="modal-title">Select Number of Videos</text>
        </view>
        <view class="picker-container">
          <text class="range-value">{{ tempVideoCount }}</text>
          <slider class="range-slider" 
                  :value="tempVideoCount" 
                  :min="1" 
                  :max="50" 
                  :step="1"
                  @change="onSliderChange"
                  activeColor="#4A9EFF"
                  backgroundColor="#E0E0E0"
                  block-color="#4A9EFF"
                  block-size="24"/>
          <view class="range-labels">
            <text>1</text>
            <text>50</text>
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
export default {
  data() {
    return {
      currentView: 'home', // 当前视图状态：home, test, learn
      overallProgress: 73, // 整体学习进度百分比
      testsPracticed: 8, // 测试练习次数
      showQuantityPicker: false, // 是否显示视频数量选择器
      tempVideoCount: 10, // 临时视频数量
      selectedCategory: 1, // 选中的学习分类ID
      testOptions: {
        videoCount: 10, // 测试视频数量
        videoSelection: 'all' // 视频选择类型：all, not_full_score, unpracticed
      },
      categories: [
        {
          id: 1,
          name: 'City & Town Driving',
          total: 45,
          practiced: 38,
          progress: 84
        },
        {
          id: 2,
          name: 'Rural Roads',
          total: 32,
          practiced: 12,
          progress: 38
        },
        {
          id: 3,
          name: 'Dual Carriageways',
          total: 28,
          practiced: 28,
          progress: 100
        },
        {
          id: 4,
          name: 'Night Driving',
          total: 25,
          practiced: 8,
          progress: 32
        },
        {
          id: 5,
          name: 'Weather Conditions',
          total: 35,
          practiced: 21,
          progress: 60
        }
      ]
    }
  },
  computed: {
    // 计算页面标题
    pageTitle() {
      switch(this.currentView) {
        case 'home':
          return 'Hazard Perception';
        case 'test':
          return 'Test Mode';
        case 'learn':
          return 'Learn Mode';
        default:
          return 'Hazard Perception';
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
    // 选择视频类型
    selectVideoType(type) {
      this.testOptions.videoSelection = type;
    },
    // 滑块变化事件
    onSliderChange(e) {
      this.tempVideoCount = e.detail.value;
    },
    // 确认视频数量选择
    confirmQuantity() {
      this.testOptions.videoCount = this.tempVideoCount;
      this.showQuantityPicker = false;
    },
    // 关闭模态框
    closeModal() {
      this.showQuantityPicker = false;
    },
    // 开始测试
    startTest() {
      console.log('Starting hazard perception test with options:', this.testOptions);
      // 这里可以调用API开始危险感知测试
      // 根据选择的视频类型过滤视频列表
      let selectedVideos = [];
      switch(this.testOptions.videoSelection) {
        case 'all':
          console.log('包含所有视频');
          break;
        case 'not_full_score':
          console.log('包含未获得满分的视频');
          break;
        case 'unpracticed':
          console.log('包含未练习的视频');
          break;
      }
      uni.showToast({
        title: '开始测试',
        icon: 'success'
      });
    },
    // 开始学习
    startLearning() {
      const category = this.categories.find(c => c.id === this.selectedCategory);
      console.log('Starting hazard perception learning for category:', category);
      // 这里可以调用API开始危险感知学习
      uni.showToast({
        title: '开始学习',
        icon: 'success'
      });
      uni.navigateTo({
        url: '/pages/hazardPerception/hazardTest'
      })
    },
    // 获取用户进度数据 - API调用示例
    async fetchUserProgress() {
      try {
        const response = await uni.request({
          url: '/api/hazard-perception/progress',
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
    // 获取分类数据 - API调用示例
    async fetchCategories() {
      try {
        const response = await uni.request({
          url: '/api/hazard-perception/categories',
          method: 'GET'
        });
        if (response[1].statusCode === 200) {
          this.categories = response[1].data;
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
  },
  onLoad() {
    // 页面加载时获取数据
    // this.fetchUserProgress();
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
  padding: 15px 20px;
  display: flex;
  align-items: center;
  background: transparent;
  position: relative;
  z-index: 10;
  min-height: 60px;
}

.back-button {
  background: none;
  border: none;
  color: #666;
  font-size: 20px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
  margin-right: 40px;
}

/* 容器 */
.container {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

/* 模式选择卡片 */
.mode-cards-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
}

.mode-card {
  background: white;
  border-radius: 20px;
  padding: 30px 25px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
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
  height: 4px;
}

.mode-card.learn::before {
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
}

.mode-card.test::before {
  background: linear-gradient(90deg, #FF6B6B 0%, #FF5252 100%);
}

.mode-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: #F8F9FA;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.mode-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  display: block;
}

.mode-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.4;
  display: block;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 16px;
  border-top: 1px solid #F0F0F0;
}

.progress-label {
  font-size: 14px;
  color: #999;
}

.progress-value {
  font-size: 24px;
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
  display: flex;
  flex-direction: column;
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
}

.options-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #F5F5F5;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item-no-border {
  border-bottom: none !important;
  flex-direction: column !important;
  align-items: stretch !important;
  padding-bottom: 10px !important;
}

.option-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.option-label-mb {
  margin-bottom: 15px !important;
}

.option-value {
  font-size: 16px;
  color: #4A9EFF;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #4A9EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  flex-shrink: 0;
}

.radio-circle.selected::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #4A9EFF;
  border-radius: 50%;
}

.radio-text {
  font-size: 15px;
  color: #333;
}

/* 分类选择 */
.categories-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px;
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 5px 18px rgba(0,0,0,0.06);
  border: 2px solid transparent;
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
  margin-bottom: 12px;
}

.category-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.radio-button {
  width: 20px;
  height: 20px;
  border: 2px solid #4A9EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  flex-shrink: 0;
}

.radio-button.selected::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #4A9EFF;
  border-radius: 50%;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.category-progress {
  font-size: 16px;
  font-weight: 600;
  color: #4A9EFF;
}

.category-stats {
  display: flex;
  gap: 25px;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  padding-left: 32px;
}

.progress-bar {
  width: calc(100% - 32px);
  height: 6px;
  background: #F0F0F0;
  border-radius: 3px;
  overflow: hidden;
  margin-left: 32px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* 操作按钮 */
.button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 30%, white 100%);
  z-index: 20;
}

.action-button {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(74, 158, 255, 0.35);
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
  border-radius: 25px 25px 0 0;
  padding: 25px 20px 35px;
  width: 100%;
  animation: slideUp 0.3s ease;
}

.modal-header {
  text-align: center;
  margin-bottom: 25px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.picker-container {
  padding: 15px 0;
}

.range-slider {
  width: 100%;
  margin: 20px 0;
}

.range-value {
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: #4A9EFF;
  margin: 15px 0;
  display: block;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
  margin-top: 8px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 35px;
}

.modal-button {
  flex: 1;
  padding: 14px;
  border-radius: 20px;
  font-size: 16px;
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
  box-shadow: 0 3px 12px rgba(74, 158, 255, 0.3);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* 移动端优化 */
@media screen and (max-width: 375px) {
  .mode-cards-container {
    max-width: 320px;
  }
  
  .options-container,
  .categories-container {
    max-width: 320px;
  }
  
  .mode-card {
    padding: 25px 20px;
  }
  
  .mode-title {
    font-size: 20px;
  }
  
  .mode-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
}
</style>