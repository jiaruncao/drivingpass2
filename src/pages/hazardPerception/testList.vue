<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <view class="header-content">
        <text class="page-title">hazard Test</text>
        <!-- <view class="progress-circle" :style="progressCircleStyle">
          <text class="progress-text">{{ completionPercentage }}%</text>
        </view> -->
      </view>
    </view>

    <!-- 主要内容 -->
    <view class="container">
      <!-- 视频网格 -->
      <view class="videos-grid">
        <view 
          v-for="(video, index) in displayVideos" 
          :key="video.id" 
          class="video-card"
          @tap="handleVideoClick(video)"
        >
          <!-- 视频缩略图 -->
          <view class="video-thumbnail">
            <!-- 道路场景背景 -->
            <view class="road-scene-image"></view>
            
            <!-- 播放按钮 -->
            <view class="play-button"></view>
            
            <!-- 状态图标 - 右上角 -->
            <view v-if="video.accuracy === 100" class="status-icon completed"></view>
            <view v-else-if="video.accuracy !== 100" class="status-icon viewed"></view>
            
            <!-- 订阅绶带 - 左上角 -->
            <view 
              v-if="video.requiredSubscription !== 'free'" 
              class="subscription-ribbon" 
              :class="video.requiredSubscription"
            ></view>
            <text 
              v-if="video.requiredSubscription !== 'free'" 
              class="ribbon-text" 
              :class="video.requiredSubscription"
            >
              {{ video.requiredSubscription }}
            </text>
            
            <!-- 视频编号 -->
            <text class="video-number">{{ index + 1 }}</text>
            
            <!-- 下载图标 -->
            <view class="download-icon">
              <view class="arrow"></view>
            </view>
          </view>
          
          <!-- 锁定遮罩 -->
          <view v-if="video.isLocked" class="locked-overlay">
            <text class="lock-icon">🔒</text>
            <text class="unlock-text">
              Upgrade to {{ video.requiredSubscription }}
              to unlock
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 升级提示模态框 -->
    <view v-if="showUpgradeModal" class="modal-backdrop" @tap.self="closeModal">
      <view class="modal-content">
        <text class="modal-title">Upgrade Required</text>
        <text class="modal-text">
          This video requires a {{ requiredUpgrade }} subscription to access.
          Upgrade now to unlock all premium content!
        </text>
        <view class="modal-actions">
          <view class="modal-button cancel" @tap="closeModal">
            <text class="modal-button-text">Cancel</text>
          </view>
          <view class="modal-button upgrade" @tap="upgradeSubscription">
            <text class="modal-button-text upgrade-text">Upgrade</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cate_id: null,
      categoryName: 'Category 1', // 分类名称
      userSubscription: 'free', // 用户订阅类型: free, silver, gold
      showUpgradeModal: false, // 是否显示升级模态框
      requiredUpgrade: '', // 需要升级的订阅类型
      // 视频数据
      videos: []
    }
  },
  computed: {
    // 计算完成百分比
    completionPercentage() {
      const completedVideos = this.videos.filter(video => 
        video.status === 'completed' && !video.isLocked
      ).length;
      const accessibleVideos = this.videos.filter(video => !video.isLocked).length;
      return accessibleVideos > 0 ? Math.round((completedVideos / accessibleVideos) * 100) : 0;
    },
    // 进度圆环样式
    progressCircleStyle() {
      const percentage = this.completionPercentage;
      const degrees = (percentage / 100) * 360;
      return `background: conic-gradient(#4A9EFF 0deg, #4A9EFF ${degrees}deg, #E0E0E0 ${degrees}deg);`;
    },
    // 显示的视频
    displayVideos() {
      return this.videos;
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      console.log('Going back to category list');
      // 实际应用中导航回分类列表页面
      uni.navigateBack({
        delta: 1
      });
    },
    // 处理视频点击
    handleVideoClick(video) {
      if (video.isLocked) {
        // 显示升级提示
        this.requiredUpgrade = video.requiredSubscription;
        this.showUpgradeModal = true;
      } else {
        // 播放视频
        console.log('Playing video:', video.number);
        this.playVideo(video);
      }
    },
    // 播放视频
    playVideo(video) {
      // 实际应用中导航到视频播放页面
      console.log(`Playing video ${video.number}`);
      
      // 更新视频状态为已观看
      if (video.status === 'unwatched') {
        video.status = 'viewed';
      }
      
      // // 导航到视频播放页面
      // uni.navigateTo({
      //   url: `/pages/hazardPerception/hazardLearn?id=${video.id}`
      // });
      
      uni.navigateTo({
        url: `/pages/hazardPerception/hazardTest?id=${video.id}`
      })
    },
    // 关闭模态框
    closeModal() {
      this.showUpgradeModal = false;
    },
    // 升级订阅
    upgradeSubscription() {
      console.log(`Upgrading to ${this.requiredUpgrade} subscription`);
      // 实际应用中导航到订阅升级页面
      this.showUpgradeModal = false;
      uni.navigateTo({
        url: '/pages/subscription/upgrade'
      });
    },
    // 更新视频锁定状态
    updateVideoLockStatus() {
      this.videos.forEach(video => {
        if (video.requiredSubscription === 'silver') {
          video.isLocked = this.userSubscription === 'free';
        } else if (video.requiredSubscription === 'gold') {
          video.isLocked = this.userSubscription !== 'gold';
        } else {
          video.isLocked = false;
        }
      });
    },
    // 初始化视频数据
    initVideos() {
      const questions = uni.getStorageSync('questions')
      this.videos = questions ? questions : []
      // this.updateVideoLockStatus();
    }
  },
  onLoad(options) {
    // 从参数获取分类信息
    if (options.title) {
      this.categoryName = decodeURIComponent(options.title);
    }
    
    // 初始化数据
    this.initVideos();
    
    // 实际应用中调用API获取数据
    // this.fetchUserSubscription();
    // this.fetchVideos();
  },
  onShow() {
    // 页面显示时更新视频锁定状态
    this.updateVideoLockStatus();
  }
}
</script>

<style lang="scss" scoped>
/* 全局样式 */
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
  padding: 30rpx 40rpx;
  display: flex;
  align-items: center;
  background: transparent;
  position: relative;
  z-index: 10;
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

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 40rpx;
}

.page-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
}

/* 进度圆环样式 */
.progress-circle {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
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
  color: #4A9EFF;
  z-index: 1;
}

/* 容器 */
.container {
  flex: 1;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  padding-bottom: 60rpx;
}

/* 视频网格 */
.videos-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 800rpx;
  width: 100%;
  margin: 0 auto;
}

.video-card {
  width: 48%;
  background: white;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
  position: relative;
  margin-bottom: 32rpx;
}

.video-card:active {
  transform: scale(0.98);
}

/* 视频缩略图 - 16:9 比例 */
.video-thumbnail {
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%);
}

/* 道路场景背景 */
.road-scene-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 70%);
}

/* 播放按钮 */
.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.15);
}

.play-button::before {
  content: '';
  width: 0;
  height: 0;
  border-left: 32rpx solid #4A9EFF;
  border-top: 20rpx solid transparent;
  border-bottom: 20rpx solid transparent;
  margin-left: 8rpx;
}

/* 状态图标 - 右上角 */
.status-icon {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: white;
  font-weight: bold;
}

/* 已完成状态 - 绿色勾选 */
.status-icon.completed {
  background: #4CAF50;
}

.status-icon.completed::before {
  content: '';
  width: 28rpx;
  height: 14rpx;
  border-left: 6rpx solid white;
  border-bottom: 6rpx solid white;
  transform: rotate(-45deg);
  margin-bottom: 6rpx;
}

/* 已观看状态 - 蓝色眼睛 */
.status-icon.viewed {
  background: #4A9EFF;
}

.status-icon.viewed::before {
  content: '';
  width: 40rpx;
  height: 24rpx;
  border: 4rpx solid white;
  border-radius: 60% 20%;
  position: relative;
}

.status-icon.viewed::after {
  content: '';
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 订阅绶带 - 左上角 */
.subscription-ribbon {
  position: absolute;
  top: 0;
  left: 0;
  width: 110rpx;
  height: 110rpx;
  overflow: hidden;
  z-index: 1;
}

.subscription-ribbon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 110rpx 110rpx 0 0;
  border-color: transparent;
}

.subscription-ribbon.silver::before {
  border-top-color: #C0C0C0;
}

.subscription-ribbon.gold::before {
  border-top-color: #FFD700;
}

/* 绶带文字 */
.ribbon-text {
  position: absolute;
  top: 24rpx;
  left: 8rpx;
  font-size: 18rpx;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.6rpx;
  transform: rotate(-45deg);
  transform-origin: center;
  z-index: 2;
  width: 80rpx;
  text-align: center;
}

.ribbon-text.gold {
  color: #333;
}

/* 视频编号 */
.video-number {
  position: absolute;
  bottom: 16rpx;
  left: 20rpx;
  color: white;
  font-size: 40rpx;
  font-weight: 700;
  text-shadow: 4rpx 4rpx 8rpx rgba(0,0,0,0.5);
}

/* 下载图标 */
.download-icon {
  position: absolute;
  bottom: 16rpx;
  right: 20rpx;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.download-icon::before {
  content: '';
  width: 28rpx;
  height: 28rpx;
  border: 4rpx solid white;
  border-top: none;
  border-radius: 0 0 4rpx 4rpx;
  position: relative;
  filter: drop-shadow(2rpx 2rpx 4rpx rgba(0,0,0,0.5));
}

.download-icon::after {
  content: '';
  position: absolute;
  width: 4rpx;
  height: 20rpx;
  background: white;
  top: 4rpx;
  filter: drop-shadow(2rpx 2rpx 4rpx rgba(0,0,0,0.5));
}

.download-icon .arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-top: 10rpx solid white;
  bottom: 14rpx;
  filter: drop-shadow(2rpx 2rpx 4rpx rgba(0,0,0,0.5));
}

/* 锁定遮罩 */
.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 32rpx;
}

.lock-icon {
  font-size: 56rpx;
  margin-bottom: 16rpx;
}

.unlock-text {
  font-size: 24rpx;
  text-align: center;
  line-height: 1.3;
  font-weight: 500;
  padding: 0 20rpx;
}

/* 升级提示模态框 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.modal-content {
  background: white;
  border-radius: 50rpx;
  padding: 60rpx 50rpx;
  width: 100%;
  max-width: 640rpx;
  text-align: center;
  animation: modalSlideUp 0.3s ease;
}

.modal-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.modal-text {
  font-size: 32rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 50rpx;
  display: block;
}

.modal-actions {
  display: flex;
  gap: 24rpx;
}

.modal-button {
  flex: 1;
  padding: 28rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-button.cancel {
  background: #F5F5F5;
}

.modal-button-text {
  color: #666;
  font-size: 32rpx;
  font-weight: 600;
}

.modal-button.upgrade {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
}

.upgrade-text {
  color: white !important;
}

@keyframes modalSlideUp {
  from { 
    transform: translateY(60rpx); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
}

/* 响应式优化 - 小屏幕 */
@media screen and (max-width: 375px) {
  .container {
    padding: 30rpx;
  }
  
  .videos-grid {
    max-width: 640rpx;
  }
  
  .video-card {
    width: 47%;
    margin-bottom: 24rpx;
  }
  
  .video-number {
    font-size: 36rpx;
  }

  .subscription-ribbon {
    width: 100rpx;
    height: 100rpx;
  }

  .subscription-ribbon::before {
    border-width: 100rpx 100rpx 0 0;
  }

  .ribbon-text {
    top: 20rpx;
    left: 6rpx;
    font-size: 16rpx;
  }
}
</style>