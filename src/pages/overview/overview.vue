<template>
  <view class="app">
    <!-- 渐变背景 -->
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- Header -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <text class="page-title">Questions Overview</text>
    </view>

    <!-- 主容器 -->
    <view class="container">
      <!-- 左侧面板（横版）/ 顶部面板（竖版） -->
      <view class="left-panel">
        <!-- 统计卡片 -->
        <view class="stats-card">
          <view class="stats-row">
            <view class="stat-item correct">
              <text class="stat-value">{{ correctCount }}</text>
              <text class="stat-label">Correct</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item incorrect">
              <text class="stat-value">{{ incorrectCount }}</text>
              <text class="stat-label">Incorrect</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item score">
              <text class="stat-value">{{ correctCount }}/{{ totalQuestions }}</text>
              <text class="stat-label">Score</text>
            </view>
          </view>
        </view>

        <!-- 图例 -->
        <view class="legend">
          <view class="legend-item">
            <view class="legend-dot correct"></view>
            <text>Correct</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot incorrect"></view>
            <text>Incorrect</text>
          </view>
        </view>

        <!-- 横版模式下按钮显示在左侧 -->
        <view class="button-container desktop-buttons">
          <view class="action-buttons">
            <view class="action-button secondary" @tap="reviewIncorrect">
              Review Incorrect
            </view>
            <view class="action-button" @tap="continueTest">
              Continue Test
            </view>
          </view>
        </view>
      </view>

      <!-- 题目网格 -->
      <view class="questions-container">
        <view class="questions-grid">
          <view 
            v-for="(question, index) in questions" 
            :key="question.id"
            class="question-circle"
            :class="[question.status, {flagged: question.flagged}]"
            @tap="viewQuestion(question.id, index)">
            <text class="question-number">{{ index + 1 }}</text>
            <text v-if="question.flagged" class="flag-icon">🚩</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 竖版模式下底部按钮 - 始终显示在底部 -->
    <view class="button-container mobile-buttons">
      <view class="action-buttons">
        <view class="action-button secondary" @tap="reviewIncorrect" v-if="mode == 'learn'">
          Review Incorrect
        </view>
        <view class="action-button" @tap="continueTest">
          Exit Test
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mode: 'learn',
      // 50道题目数据
      questions: [],
      // 统计数据
      stats: {
        correct: 35,
        incorrect: 15
      },
      // 屏幕信息
      screenInfo: {
        width: 375,
        height: 667
      }
    }
  },
  computed: {
    // 总题目数
    totalQuestions() {
      return this.questions.length;
    },
    correctCount () {
      const correctQuestions = this.questions.filter(q => q.status === 'correct');
      return correctQuestions.length;
    },
    incorrectCount () {
      const incorrectQuestions = this.questions.filter(q => q.status === 'incorrect');
      return incorrectQuestions.length;
    },
    // 是否为横屏
    isLandscape() {
      return this.screenInfo.width > this.screenInfo.height && this.screenInfo.width >= 768;
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      console.log('Go back');
      uni.navigateBack({
        delta: 2,
        fail: () => {
          // 如果没有上一页，返回首页
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      });
      
    },
    // 查看题目详情
    viewQuestion(questionId, index) {
      console.log('View question:', questionId);
      // 跳转到题目详情页面
      // uni.navigateTo({
      //   url: `/pages/learnQuestion/detail?question_id=${questionId}`
      // });
      uni.$emit('chooseQuestion', {
        index: index,
        question: questionId
      })
      uni.navigateBack()
    },
    // 复习错题
    reviewIncorrect() {
      console.log('Review incorrect questions');
      const incorrectQuestions = this.questions.filter(q => q.status === 'incorrect');
      console.log('Incorrect questions:', incorrectQuestions);
      
      if (!incorrectQuestions.length) {
        uni.showToast({
          title: 'No incorrect questions',
          icon: 'none'
        });
        return false
      }
      
      // 跳转到错题复习页面
      uni.navigateTo({
        url: '/pages/learnQuestion/wrong',
        // success: () => {
        //   // 传递错题数据
        //   uni.$emit('incorrectQuestions', incorrectQuestions);
        // }
      });
    },
    // 继续测试
    continueTest() {
      console.log('Continue test');
      // 返回测试页面或开始新测试
      // uni.navigateTo({
      //   url: '/pages/test/index'
      // });
      this.goBack()
    },
    // 更新屏幕信息
    updateScreenInfo() {
      const info = uni.getSystemInfoSync();
      this.screenInfo.width = info.windowWidth;
      this.screenInfo.height = info.windowHeight;
    },
    // 从服务器获取题目数据
    async fetchQuestions() {
      try {
        const response = await uni.request({
          url: '/api/test/questions',
          method: 'GET'
        });
        if (response[1].statusCode === 200) {
          this.questions = response[1].data.questions;
          this.calculateStats();
        }
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        uni.showToast({
          title: 'Failed to load questions',
          icon: 'none'
        });
      }
    },
    // 计算统计数据
    calculateStats() {
      this.stats.correct = this.questions.filter(q => q.status === 'correct').length;
      this.stats.incorrect = this.questions.filter(q => q.status === 'incorrect').length;
    }
  },
  onLoad(options) {
    this.mode = options.mode ? options.mode : 'learn'
    // 页面加载时更新屏幕信息
    this.updateScreenInfo();
    
    // 如果有传递的测试ID，获取对应的题目数据
    // if (options.testId) {
    //   this.fetchQuestions();
    // }
    
    const records = uni.getStorageSync('records')
    this.questions = records
  },
  onResize() {
    // 监听屏幕旋转
    this.updateScreenInfo();
  }
}
</script>

<style lang="scss">
/* 全局样式重置 */
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
  padding: calc(env(safe-area-inset-top) + 20rpx) 40rpx 20rpx;
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 100%);
  position: sticky;
  top: 0;
  z-index: 20;
  min-height: 120rpx;
}

.back-button {
  background: none;
  border: none;
  color: #666;
  font-size: 40rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
}

.back-button:active {
  transform: scale(0.95);
}

.page-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
  margin-right: 80rpx;
  word-break: break-word;
}

/* 主容器 - 竖版默认 */
.container {
  flex: 1;
  padding: 20rpx 40rpx calc(env(safe-area-inset-bottom) + 200rpx);
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

/* 统计卡片 */
.stats-card {
  background: white;
  border-radius: 40rpx;
  padding: 40rpx;
  margin-bottom: 50rpx;
  box-shadow: 0 16rpx 50rpx rgba(0,0,0,0.08);
}

.stats-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 64rpx;
  font-weight: 700;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 28rpx;
  color: #666;
}

.stat-item.correct .stat-value {
  color: #4CAF50;
}

.stat-item.incorrect .stat-value {
  color: #FF6B6B;
}

.stat-item.score .stat-value {
  color: #4A9EFF;
  font-size: 56rpx;
}

.stat-divider {
  width: 2rpx;
  height: 100rpx;
  background: #F0F0F0;
}

/* 图例 */
.legend {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  flex-wrap: wrap;
  padding: 30rpx;
  background: white;
  border-radius: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0,0,0,0.05);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 28rpx;
  color: #666;
}

.legend-dot {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
}

.legend-dot.correct {
  background: #E3F2FD;
}

.legend-dot.incorrect {
  background: #FFEBEE;
}

/* 题目网格容器 */
.questions-container {
  background: white;
  border-radius: 40rpx;
  padding: 40rpx;
  box-shadow: 0 16rpx 50rpx rgba(0,0,0,0.08);
}

/* 题目网格 - 竖版 */
.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120rpx, 1fr));
  gap: 24rpx;
}

/* 题目圆圈 */
.question-circle {
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
  position: relative;
}

.question-circle:active {
  transform: scale(0.95);
}

.question-number {
  font-size: 28rpx;
  font-weight: 600;
}

/* 答对的题目 - 蓝色 */
.question-circle.correct {
  background: #E3F2FD;
  color: #2196F3;
}

.question-circle.correct:hover {
  background: #BBDEFB;
}

/* 答错的题目 - 粉色 */
.question-circle.incorrect {
  background: #FFEBEE;
  color: #F44336;
}

.question-circle.incorrect:hover {
  background: #FFCDD2;
}

/* 标记图标 */
.flag-icon {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  font-size: 24rpx;
}

/* 底部按钮 - 竖版固定底部 */
.button-container {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 40rpx calc(env(safe-area-inset-bottom) + 40rpx);
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 40%, white 100%);
  z-index: 20;
}

/* 竖版模式下显示底部按钮 */
.mobile-buttons {
  display: flex;
  width: 100%;
}

/* 横版模式下的按钮默认隐藏 */
.desktop-buttons {
  display: none;
  position: static;
  background: none;
  padding: 0;
}

.action-buttons {
  display: flex;
  gap: 24rpx;
  max-width: 800rpx;
  margin: 0 auto;
  width: 100%;
  flex-wrap: wrap;
}

.action-button {
  flex: 1;
  padding: 32rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 12rpx 40rpx rgba(74, 158, 255, 0.35);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button.secondary {
  background: white;
  color: #4A9EFF;
  border: 4rpx solid #4A9EFF;
  box-shadow: 0 8rpx 30rpx rgba(0,0,0,0.1);
}

.action-button:active {
  transform: scale(0.98);
}

/* 横版布局 - 平板和大屏幕 */
@media screen and (min-width: 1536rpx) and (orientation: landscape),
       screen and (min-width: 2048rpx) {

  .header {
    padding: calc(env(safe-area-inset-top) + 20rpx) 60rpx 20rpx;
    min-height: 100rpx;
  }

  .page-title {
    font-size: 44rpx;
    text-align: left;
    margin-right: 0;
    margin-left: 40rpx;
  }

  .container {
    display: flex;
    gap: 40rpx;
    padding: 0 60rpx calc(env(safe-area-inset-bottom) + 40rpx);
  }

  /* 左侧面板 */
  .left-panel {
    width: 560rpx;
    display: flex;
    flex-direction: column;
    gap: 30rpx;
  }

  .stats-card {
    margin-bottom: 0;
  }

  .stats-row {
    flex-direction: column;
    gap: 40rpx;
  }

  .stat-divider {
    display: none;
  }

  .stat-item {
    padding: 20rpx 0;
    border-bottom: 2rpx solid #F0F0F0;
  }

  .stat-item:last-child {
    border-bottom: none;
  }

  .legend {
    flex-direction: column;
    gap: 24rpx;
    margin-bottom: 0;
  }

  /* 右侧题目面板 */
  .questions-container {
    flex: 1;
    margin-bottom: 0;
  }

  .questions-grid {
    gap: 30rpx;
  }

  /* 横版显示左侧按钮 */
  .desktop-buttons {
    display: flex !important;
    margin-top: auto;
  }

  /* 隐藏竖版的底部固定按钮 */
  .mobile-buttons {
    display: none !important;
  }
}

/* 小屏幕优化 */
@media screen and (max-width: 750rpx) {
  .questions-grid {
    grid-template-columns: repeat(auto-fit, minmax(100rpx, 1fr));
    gap: 20rpx;
  }
  
  .questions-container {
    padding: 30rpx;
  }
  
  .page-title {
    font-size: 40rpx;
  }
  
  .stat-value {
    font-size: 56rpx;
  }

  .stat-item.score .stat-value {
    font-size: 48rpx;
  }

  .legend {
    gap: 50rpx;
  }
}
</style>