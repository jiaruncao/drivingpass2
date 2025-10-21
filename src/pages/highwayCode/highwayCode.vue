<template>
  <view class="app">
    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <view class="header-content">
        <text class="page-title">{{ currentCode.title }}</text>
        <view class="header-right">
          <view class="share-button" @tap="shareCode">
            <u-icon name="share" size="40rpx"></u-icon>
          </view>
          <view class="progress-circle" :style="{ '--accuracy': Number(categoryProgress) }">
            <text class="progress-text">{{ categoryProgress }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 主要内容 -->
    <view class="container">
      <!-- 滑动容器 -->
      <view class="swipe-container" 
            @touchstart="onTouchStart" 
            @touchmove="onTouchMove" 
            @touchend="onTouchEnd">
        <view class="swipe-wrapper" :style="{ transform: `translateX(${translateX}rpx)` }">
          <view v-for="(code, index) in codesList" :key="code.id" class="slide">
            <view class="code-card">
              <view class="code-content">
                <text class="code-title">{{ code.title }}</text>
                
                <view class="code-illustration">
                  <!-- 驾驶员插画 -->
                  <view v-if="code.title_video_url" class="illustration driver-illustration">
                    <!-- <view class="driver-figure">
                      <view class="driver-head"></view>
                      <view class="driver-body">
                        <view class="driver-arms"></view>
                      </view>
                    </view>
                    <view class="steering-wheel"></view>
                    <view class="car-outline"></view> -->
                    <image :src="code.title_video_url"></image>
                  </view>
                  
                  <!-- 车辆插画 -->
                  <!-- <view v-if="code.illustrationType === 'vehicle'" class="illustration vehicle-illustration">
                    <view class="vehicle-scene">
                      <view class="truck">
                        <view class="truck-cab"></view>
                        <view class="wheels"></view>
                      </view>
                      <text class="arrow">→</text>
                      <view class="car">
                        <view class="wheels"></view>
                      </view>
                    </view>
                  </view> -->
                </view>

                <text class="code-description">{{ code.explain }}</text>
              </view>

              <view class="navigation-section">
                <text class="nav-arrow" :class="{enabled: canGoPrevious, disabled: !canGoPrevious}" @tap="goToPrevious">‹</text>
                <text class="page-counter">{{ currentIndex + 1 }} of {{ totalCodes }}</text>
                <text class="nav-arrow" :class="{enabled: canGoNext, disabled: !canGoNext}" @tap="goToNext">›</text>
              </view>

              <view class="status-button" :class="{unread: !code.is_read}" @tap="toggleReadStatus(index)">
                <text class="status-text">{{ code.is_read ? 'Readed' : 'Mark as Read' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 滑动指示器 -->
      <view class="swipe-indicators">
        <view v-for="(code, index) in codesList" 
              :key="index" 
              class="indicator" 
              :class="{active: currentIndex === index}"
              @tap="goToSlide(index)">
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {startTrain, collectAdd, collectCancel, wrongAdd, recordAdd} from '@/http/api/testQuestions.js'
export default {
  data() {
    return {
      subject_id: null,
      cate_id: null,
      currentIndex: 0, // 当前代码索引
      categoryProgress: 0, // 分类进度
      translateX: 0, // 滑动偏移量
      startX: 0, // 触摸起始位置
      isDragging: false, // 是否正在拖拽
      slideWidth: 0, // 滑块宽度
      // 公路代码数据列表
      codesList: []
    }
  },
  computed: {
    // 当前显示的代码
    currentCode() {
      return this.codesList[this.currentIndex] || this.codesList[0];
    },
    // 代码总数
    totalCodes() {
      return this.codesList.length;
    },
    // 是否可以前往上一个
    canGoPrevious() {
      return this.currentIndex > 0;
    },
    // 是否可以前往下一个
    canGoNext() {
      return this.currentIndex < this.totalCodes - 1;
    }
  },
  methods: {
    startTrain () {
      startTrain({
        cate_id: this.cate_id
      }).then(res => {
        console.log(res)
        // 获取第一题
        this.codesList = res.data.data
      })
    },
    // 返回上一页
    goBack() {
      console.log('Going back to category list');
      // 实际应用中导航回分类列表页面
      uni.navigateBack({
        fail: () => {
          console.log('No previous page, exit app');
        }
      });
    },
    // 分享代码
    shareCode() {
      console.log('Sharing code:', this.currentCode.title);
      // 实际应用中调用系统分享功能
      uni.share({
        provider: "weixin",
        type: 0,
        title: this.currentCode.title,
        summary: this.currentCode.description,
        success: function (res) {
          console.log("success:" + JSON.stringify(res));
        },
        fail: function (err) {
          console.log("fail:" + JSON.stringify(err));
        }
      });
    },
    // 切换已读状态
    toggleReadStatus(index) {
      // this.codesList[index].is_read = true;
      // this.updateProgress();
      this.saveProgress(index);
      
      // this.setStorageSyncSubjects(this.codesList[index].id, 'is_read', true)
    },
    // 前往上一个
    goToPrevious() {
      if (this.canGoPrevious) {
        this.currentIndex--;
        this.updateTranslate();
      }
    },
    // 前往下一个
    goToNext() {
      if (this.canGoNext) {
        this.currentIndex++;
        this.updateTranslate();
      }
    },
    // 触摸开始
    onTouchStart(e) {
      this.startX = e.touches[0].clientX;
      this.isDragging = true;
      // 获取容器宽度（rpx转px）
      const query = uni.createSelectorQuery().in(this);
      query.select('.swipe-container').boundingClientRect(data => {
        this.slideWidth = data.width;
      }).exec();
    },
    // 触摸移动
    onTouchMove(e) {
      if (!this.isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const diffX = currentX - this.startX;
      const currentTranslate = -this.currentIndex * this.slideWidth;
      
      // 转换为rpx单位
      this.translateX = (currentTranslate + diffX) * 2;
    },
    // 触摸结束
    onTouchEnd(e) {
      if (!this.isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - this.startX;
      const threshold = this.slideWidth * 0.3; // 30% 的滑动距离触发切换
      
      if (diffX > threshold && this.currentIndex > 0) {
        // 向右滑动，前往上一个
        this.currentIndex--;
      } else if (diffX < -threshold && this.currentIndex < this.totalCodes - 1) {
        // 向左滑动，前往下一个
        this.currentIndex++;
      }
      this.$utils.updateSubjectStorage('subjects', {
        subjectId: this.subject_id,
        cateId: this.cate_id
      }, {
        'current_question_index': this.currentIndex
      });
      this.updateTranslate();
      this.isDragging = false;
    },
    // 直接跳转到指定滑块
    goToSlide(index) {
      this.currentIndex = index;
      
      // 记录当前题目
      this.$utils.updateSubjectStorage('subjects', {
        subjectId: this.subject_id,
        cateId: this.cate_id
      }, {
        'current_question_index': this.currentIndex
      });
      
      this.updateTranslate();
    },
    // 更新滑动位置
    updateTranslate() {
      if (!this.slideWidth) {
        const query = uni.createSelectorQuery().in(this);
        query.select('.swipe-container').boundingClientRect(data => {
          this.slideWidth = data.width;
          this.translateX = -this.currentIndex * this.slideWidth * 2; // 转换为rpx
        }).exec();
      } else {
        this.translateX = -this.currentIndex * this.slideWidth * 2; // 转换为rpx
      }
    },
    // 更新进度
    updateProgress() {
      const readCount = this.codesList.filter(code => code.is_read).length;
      this.categoryProgress = Math.round((readCount / this.totalCodes) * 100);
    },
    addRecord () {
      // 获取记录数组
      const subjects = uni.getStorageSync('subjects');
      if (!subjects) return;
    
      // 检查并添加
      const added = this.$utils.addQuestionIfNotExists(
        subjects, 
        this.subject_id, 
        this.cate_id, 
        this.currentCode.id
      );
      
      if (added) {
        // 更新缓存
        uni.setStorageSync('subjects', subjects);
      }
    },
    // 保存学习进度 
    async saveProgress(index) {
      try {
        const response = await recordAdd({
          question_id: this.currentCode.id
        })
        
        if (response.code == 1) {
          
          this.addRecord()
          
          this.$utils.updateSubjectStorage('subjects', {
            subjectId: this.subject_id,
            cateId: this.cate_id,
            questionId: this.currentCode.id
          }, {
            'is_read': true
          });
          
          this.codesList[index].is_read = true;
          
          this.updateProgress()
          console.log('Progress saved successfully');
        }
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  },
  watch: {
    // 监听当前索引变化，自动保存进度
    currentIndex(newIndex) {
      if (!this.subject_id || !this.cate_id) return;

      this.$utils.updateSubjectStorage('subjects', {
        subjectId: this.subject_id,
        cateId: this.cate_id
      }, {
        'current_question_index': newIndex
      });
    }
  },
  onLoad(option) {
    // 页面加载后初始化数据
    // this.updateProgress();
    // this.updateTranslate();
    this.cate_id = option.cate_id
    this.subject_id = option.subject_id
    
    // 取缓存数据
    const questions = uni.getStorageSync('questions');
    if (questions) {
      this.codesList = questions;
      this.updateProgress()
    }
    
    // 自动跳转到当前题目
    const subjects = uni.getStorageSync('subjects');
    
    if (!subjects) return;
    
    this.currentIndex = this.$utils.getCurrentQuestionIndex(subjects, this.subject_id, this.cate_id)
    
    this.$nextTick(function() {
      this.updateTranslate();
    })
    // this.updateTranslate();
    console.log('this.currentQuestionIndex', this.currentIndex)
    
    
    // this.startTrain()
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
  background: #F8F9FA;
}

/* Header 样式 */
.header {
  padding: 30rpx 40rpx;
  display: flex;
  align-items: center;
  background: white;
  position: relative;
  z-index: 10;
  min-height: 120rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.back-button {
  color: #666;
  font-size: 40rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 40rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  width: 300rpx;
  white-space: nowrap;      /* 不换行 */
  overflow: hidden;         /* 溢出隐藏 */
  text-overflow: ellipsis;  /* 显示省略号 */
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.share-button {
  color: #666;
  padding: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
}

.share-icon {
  font-size: 36rpx;
}

.progress-circle {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  // background: conic-gradient(from 0deg,
  //     #667eea 0deg,
  //     #764ba2 calc(var(--accuracy) * 3.6deg),
  //     #e5e7eb calc(var(--accuracy) * 3.6deg));
  background: conic-gradient(from 0deg, #FFA500 0deg, #FFA500 calc(var(--accuracy) * 3.6deg), #E0E0E0 calc(var(--accuracy) * 3.6deg));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: white;
  position: absolute;
}

.progress-text {
  position: relative;
  font-size: 24rpx;
  font-weight: 600;
  color: #FFA500;
  z-index: 1;
}

/* 容器 */
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  padding: 80rpx 40rpx calc(80rpx + env(safe-area-inset-bottom));
  align-items: center;
  justify-content: center;
}

/* 滑动容器 */
.swipe-container {
  width: 100%;
  max-width: 700rpx;
  position: relative;
  overflow: hidden;
}

.swipe-wrapper {
  display: flex;
  transition: transform 0.3s ease;
  width: 600%;
}

.slide {
  width: 16.666%;
  flex-shrink: 0;
}

/* 公路代码卡片 */
.code-card {
  background: white;
  border-radius: 60rpx;
  padding: 100rpx 70rpx;
  box-shadow: 0 16rpx 50rpx rgba(0,0,0,0.08);
  text-align: center;
  width: 100%;
  min-height: 1100rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.code-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.code-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 60rpx;
  line-height: 1.3;
  display: block;
}

.code-illustration {
  width: 480rpx;
  height: 360rpx;
  margin: 0 auto 60rpx;
  background: #F8F9FA;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 插画样式 */
.illustration {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 驾驶员插画 */
.driver-illustration {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.driver-figure {
  width: 160rpx;
  height: 200rpx;
  position: relative;
}

.driver-head {
  width: 60rpx;
  height: 60rpx;
  background: #FFB74D;
  border-radius: 50%;
  margin: 0 auto 10rpx;
}

.driver-body {
  width: 80rpx;
  height: 100rpx;
  background: #2196F3;
  border-radius: 16rpx;
  margin: 0 auto;
  position: relative;
}

.driver-arms {
  position: absolute;
  top: 20rpx;
  left: -30rpx;
  right: -30rpx;
  height: 8rpx;
  background: #FFB74D;
}

.steering-wheel {
  position: absolute;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #666;
  border-radius: 50%;
}

.car-outline {
  position: absolute;
  bottom: 0;
  left: 20rpx;
  right: 20rpx;
  height: 120rpx;
  background: #FF9800;
  border-radius: 30rpx 30rpx 10rpx 10rpx;
  opacity: 0.3;
}

/* 车辆插画 */
.vehicle-illustration {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
}

.vehicle-scene {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.truck {
  width: 200rpx;
  height: 120rpx;
  background: #FF5722;
  border-radius: 16rpx;
  position: relative;
  margin-right: 40rpx;
}

.truck-cab {
  position: absolute;
  top: -40rpx;
  left: 120rpx;
  width: 80rpx;
  height: 80rpx;
  background: #FF5722;
  border-radius: 16rpx 16rpx 0 0;
}

.car {
  width: 160rpx;
  height: 80rpx;
  background: #2196F3;
  border-radius: 40rpx;
  position: relative;
}

.wheels {
  position: absolute;
  bottom: -16rpx;
  left: 20rpx;
  right: 20rpx;
  height: 32rpx;
}

.wheels::before,
.wheels::after {
  content: '';
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  background: #333;
  border-radius: 50%;
  top: 0;
}

.wheels::before {
  left: 0;
}

.wheels::after {
  right: 0;
}

.arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #4CAF50;
  font-size: 80rpx;
}

.code-description {
  font-size: 32rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 60rpx;
  text-align: left;
  display: block;
}

/* 导航控制 */
.navigation-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.nav-arrow {
  color: #999;
  font-size: 36rpx;
  padding: 20rpx;
  user-select: none;
}

.nav-arrow.disabled {
  opacity: 0.3;
}

.nav-arrow.enabled {
  color: #4A9EFF;
}

.page-counter {
  font-size: 32rpx;
  color: #666;
  font-weight: 500;
}

/* 状态按钮 */
.status-button {
  padding: 24rpx 60rpx;
  border: 4rpx solid #4A9EFF;
  border-radius: 50rpx;
  background: #4A9EFF;
  display: inline-block;
}

.status-button.unread {
  background: transparent;
}

.status-text {
  color: white;
  font-size: 32rpx;
  font-weight: 500;
}

.status-button.unread .status-text {
  color: #4A9EFF;
}

/* 滑动指示器 */
.swipe-indicators {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-top: 60rpx;
  flex-wrap: wrap;
}

.indicator {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #E0E0E0;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #4A9EFF;
  width: 32rpx;
  border-radius: 6rpx;
}

/* 响应式优化 */
@media screen and (max-width: 375px) {
  .container {
    padding: 60rpx 30rpx 60rpx;
  }
  
  .swipe-container {
    max-width: 640rpx;
  }
  
  .code-card {
    padding: 80rpx 50rpx;
    min-height: 960rpx;
  }
  
  .code-illustration {
    width: 400rpx;
    height: 300rpx;
    margin-bottom: 50rpx;
  }
  
  .code-title {
    font-size: 36rpx;
  }

  .driver-figure {
    width: 120rpx;
    height: 160rpx;
  }

  .truck {
    width: 160rpx;
    height: 100rpx;
  }

  .car {
    width: 120rpx;
    height: 60rpx;
  }
}
</style>