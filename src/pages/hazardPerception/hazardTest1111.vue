<template>
  <view>
    <view class="app">
      <!-- 视频区域 - 点击任何地方都能添加标记 -->
      <view class="video-container" @tap="addMarkAtCurrentTime">
        <view class="video-content">
          <!-- <view class="road-scene">
            <view class="road-lines"></view>
          </view> -->
          <!-- <video id="videoId" class="video" :autoplay="true" :controls="false" :show-center-play-btn="false" :src="title_video_url" muted playsinline></video> -->
          
          
          <DomVideoPlayer
            style="width:100%;height: 100%;"
            ref="domVideoPlayer"
            :src="title_video_url"
            :autoplay="autoplay"
            :loop="loop"
            :controls="controls"
            :muted="muted"
            :isLoading="true"
            @timeupdate="timeupdate"
          />
          
          <view class="video-overlay" @tap.stop="addMarkAtCurrentTime">
            <view class="exit-button">
              <view class="exit-button-text" @tap.stop="exitTestMode">
                exit
              </view>
            </view>
          </view>
        </view>
    
        <!-- 退出按钮 -->
        <!-- <button class="exit-button" @tap.stop="exitTestMode">Exit</button> -->
      </view>
    
      <!-- 底部控制区域 -->
      <view class="bottom-controls">
        <!-- 细进度条 -->
        <view class="thin-progress-bar">
          <view class="thin-progress-fill" :style="{width: progress + '%'}"></view>
        </view>
    
        <!-- 测试模式得分条 - 不显示得分区间，只显示灰色背景 -->
        <view class="score-bar-container">
          <!-- 全灰色背景，不显示得分 -->
          <view class="test-mode-bar"></view>
    
          <!-- 用户标记的旗子 -->
          <view class="user-marks">
            <view v-for="(mark, index) in userMarks" 
                  :key="mark.id"
                  class="user-mark" 
                  :style="{left: mark.position + '%'}"
                  @tap.stop="showMarkInfo(mark, index)">
              <view class="flag-container">
                <view class="flag-pole"></view>
                <view class="flag-banner"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    
      <!-- 结果弹窗 -->
      <view v-if="showResult" class="result-modal">
        <view class="result-backdrop" @tap.stop></view>
        <view class="result-content">
          <view class="result-header">
            <text class="result-title">Test Complete</text>
          </view>
          
          <view class="result-score">
            <text class="score-label">Your Score</text>
            <view class="score-display">
              <text class="score-number">{{ totalScore }}</text>
              <text class="score-divider">/</text>
              <text class="score-total">10</text>
            </view>
            
            <!-- 得分状态 -->
            <view class="score-status" :class="scoreStatusClass">
              <text class="status-text">{{ scoreStatusText }}</text>
            </view>
          </view>
    
          <!-- 标记统计 -->
          <view class="result-stats">
            <view class="stat-item">
              <text class="stat-label">Total Clicks</text>
              <text class="stat-value">{{ clickCount }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">Valid Marks</text>
              <text class="stat-value">{{ validMarksCount }}</text>
            </view>
          </view>
    
          <!-- 操作按钮 -->
          <view class="result-actions">
            <button class="result-button exit-btn" @tap="handleExit">
              Exit
            </button>
            <button class="result-button review-btn" @tap="handleReview">
              Review
            </button>
          </view>
        </view>
      </view>
    
      <!-- Review模式遮罩 -->
      <view v-if="reviewMode" class="review-overlay">
        <view class="review-bar">
          <view v-for="(item, index) in score_list" :key="index">
            <view v-for="(jtem, idx) in item" :key="idx" class="score-zone" :class="'zone-' + jtem.score" 
            :style="{
              'left': jtem.startTime / duration * 100 + '%',
              'width': (jtem.endTime - jtem.startTime) / duration * 100 + '%'
            }">
              {{jtem.score}}
            </view>
          </view>
        </view>
        
        <button class="close-review-btn" @tap="closeReview">
          Close Review
        </button>
      </view>
    </view>
    
    <u-modal :show="modalShow" :title="modalTitle" :showCancelButton="true" :content='modalContent' :cancelText="cancelText" :confirmText="confirmText" @cancel="cancel" @confirm="confirm"></u-modal>
  </view>
  
</template>

<script>
import DomVideoPlayer from 'uniapp-video-player'
export default {
  components: {
    DomVideoPlayer
  },
  data() {
    return {
      questionId: null,
      title_video_url: null,
      autoplay: true, // 是否自动播放
      loop: false, // 是否循环播放
      controls: false, // 是否显示控制栏
      muted: false, // 是否静音
      isLoading: false, // Android系统加载时显示loading(为了遮挡安卓的黑色按钮)
      objectFit: 'contain', // 视频尺寸与video区域的适应模式
      score_list: [],
      currentTime: 0, // 当前时间（秒）
      duration: 70, // 视频总时长（秒）
      progress: 0, // 进度百分比
      userMarks: [], // 用户标记的危险点
      playInterval: null, // 播放定时器
      clickCount: 0, // 点击计数
      recentClicks: [], // 最近的点击时间记录
      scoreDisqualified: false, // 分数是否被取消
      showResult: false, // 是否显示结果弹窗
      totalScore: 0, // 总得分
      reviewMode: false, // 是否处于review模式
      testCompleted: false ,// 测试是否已完成
      modalShow: false,
      modalTitle: '',
      modalType: '',
      modalContent: '',
      showCancelButton: false,
      cancelText: 'Cancel',
      confirmText: 'Confirm'
    }
  },
  
  computed: {
    // 计算有效标记数量
    validMarksCount() {
      return this.userMarks.filter(mark => mark.score > 0).length;
    },
    
    // 得分状态样式类
    scoreStatusClass() {
      if (this.totalScore >= 8) return 'excellent';
      if (this.totalScore >= 5) return 'good';
      if (this.totalScore >= 3) return 'pass';
      return 'fail';
    },
    
    // 得分状态文字
    scoreStatusText() {
      if (this.totalScore >= 8) return 'Excellent!';
      if (this.totalScore >= 5) return 'Good Job!';
      if (this.totalScore >= 3) return 'Pass';
      return 'Need Practice';
    }
  },
  
  methods: {
    // 自动播放
    startAutoPlay() {
      this.playInterval = setInterval(() => {
        if (this.currentTime < this.duration) {
          this.currentTime += 0.1;
          this.progress = (this.currentTime / this.duration) * 100;
        } else {
          // 视频播放完成
          clearInterval(this.playInterval);
          this.currentTime = this.duration;
          this.progress = 100;
          this.onTestComplete();
        }
      }, 100);
    },
    
    // 测试完成
    onTestComplete() {
      this.testCompleted = true;
      this.calculateTotalScore();
      // 延迟显示结果，给用户一个缓冲
      setTimeout(() => {
        this.showResult = true;
      }, 500);
    },
    
    // 计算总分
    calculateTotalScore() {
      // 取最高的两个得分
      const sortedMarks = [...this.userMarks]
        .filter(mark => mark.score > 0)
        .sort((a, b) => b.score - a.score);
      
      // 计算总分（最多10分 = 5+5）
      if (sortedMarks.length >= 2) {
        this.totalScore = sortedMarks[0].score + sortedMarks[1].score;
      } else if (sortedMarks.length === 1) {
        this.totalScore = sortedMarks[0].score;
      } else {
        this.totalScore = 0;
      }
    },
    
    // 在当前时间添加标记
    addMarkAtCurrentTime() {
      // 如果测试已完成，不再允许点击
      if (this.testCompleted) {
        return;
      }
      
      // 检查是否已被取消资格
      if (this.scoreDisqualified) {
        return;
      }

      // 防作弊检测
      if (this.checkForCheating()) {
        return;
      }

      // 计算当前进度对应的得分（内部计算，不显示给用户）
      let score = 0;
      
      this.score_list.forEach((item) => {
        item.forEach(jtem => {
          if (this.progress >= jtem.startTime && this.progress <= jtem.endTime) {
            score = jtem.score;
          }
        })
      })

      // 添加标记
      this.addMark(this.progress, score);
    },
    
    // 防作弊检测
    checkForCheating() {
      const now = Date.now();
      
      // 规则1: 两次点击之间至少要间隔0.5秒
      if (this.recentClicks.length > 0) {
        const lastClick = this.recentClicks[this.recentClicks.length - 1];
        if (now - lastClick < 500) {
          this.handleCheating('Clicks too fast');
          return true;
        }
      }
      
      // 清理3秒前的点击记录
      this.recentClicks = this.recentClicks.filter(time => now - time < 3000);
      
      // 添加当前点击
      this.recentClicks.push(now);
      
      // 规则2: 3秒内不超过3次点击
      if (this.recentClicks.length > 3) {
        this.handleCheating('Too many clicks in 3 seconds');
        return true;
      }
      
      // 规则3: 整个视频最多15次点击
      if (this.clickCount >= 15) {
        this.handleCheating('Maximum clicks exceeded');
        return true;
      }
      
      return false;
    },
    
    // 处理作弊行为
    handleCheating(reason) {
      this.scoreDisqualified = true;
      
      // 清除所有标记的分数
      this.userMarks.forEach(mark => {
        mark.score = 0;
      });
      
      // Test模式下不立即显示警告，等结束后在结果中体现
      console.log('Score disqualified:', reason);
    },
    
    // 添加标记
    addMark(position, score) {
      console.log('position, score', position, score)
      this.clickCount++;
      
      // 如果已被取消资格，分数为0
      const finalScore = this.scoreDisqualified ? 0 : score;
      
      const newMark = {
        id: Date.now(),
        time: Math.round((position / 100) * this.duration),
        position: position,
        score: finalScore,
        clickNumber: this.clickCount
      };
      
      // 添加标记
      this.userMarks.push(newMark);
      
      console.log(`Mark ${this.clickCount} added at ${newMark.time}s`);
    },
    
    // 显示标记信息（测试模式下不显示得分）
    showMarkInfo(mark, index) {
      console.log(`Mark ${index + 1} at ${mark.time}s`);
    },
    
    // 退出测试模式
    exitTestMode() {
      if (this.playInterval) {
        clearInterval(this.playInterval);
      }

      this.modalShow = true
      this.modalTitle =  'Exit Test'
      this.modalType = 'ExitTest'
      this.showCancelButton = true
      this.confirmText = 'Confirm'
      this.modalContent = `Are you sure you want to exit? Your progress will be lost.`
    },
    
    // 处理结果弹窗的Exit按钮
    handleExit() {
      uni.navigateBack();
    },
    
    // 处理Review按钮
    handleReview() {
      this.showResult = false;
      this.reviewMode = true;
    },
    
    // 关闭Review模式
    closeReview() {
      this.reviewMode = false;
      this.showResult = true;
    },
    // 记录
    recordAdd () {
      recordAdd({
        question_id: this.questionId
      }).then(res => {
    
      })
    },
    confirm () {
      this.modalShow = false
      if (this.modalType == 'ExitTest') {
        uni.navigateBack();
      }
    },
    cancel () {
      this.modalShow = false
      if (this.modalType == 'ExitTest') {
        if (!this.testCompleted) {
          this.startAutoPlay();
        }
      }
    },
  },
  
  onLoad(options) {
    // if (options.id) {
    //   this.questionId = options.id
    //   this.getQuestionDetail()
    // }
    const questions = uni.getStorageSync('questions')
    console.log('Hazard Perception Test Mode loaded', questions);
    
    this.title_video_url = questions[0].title_video_url
    this.score_list = questions[0].score_list
    
    // 自动开始播放
    this.startAutoPlay();
    // #ifdef APP-PLUS
    // APP端强制横屏
    plus.screen.lockOrientation('landscape-primary');
    plus.navigator.setFullscreen(true); // 全屏显示，隐藏状态栏和导航栏
    plus.navigator.hideSystemNavigation(); // 隐藏系统导航栏
    // #endif
  },
  
  onUnload() {
    // 清理定时器
    if (this.playInterval) {
      clearInterval(this.playInterval);
    }
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary');
    // #endif
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
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}

/* 视频容器 */
.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #1a1a1a;
  overflow: hidden;
}

/* 模拟视频背景 - 道路场景 */
.video-content {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #4a5568 0%, #2d3748 40%, #1a202c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  .video {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
}
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
/* 道路模拟 */
.road-scene {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(to bottom, 
    #87CEEB 0%,    /* 天空 */
    #87CEEB 35%,   
    #90A955 35%,   /* 地平线 */
    #4a5f3a 45%,   /* 远山 */
    #3d4f33 55%,   /* 近景 */
    #2a2a2a 55%,   /* 路面 */
    #1a1a1a 100%
  );
}

.road-scene::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200%;
  height: 45%;
  background: linear-gradient(to top,
    #2a2a2a 0%,
    #3a3a3a 50%,
    transparent 100%
  );
  clip-path: polygon(45% 100%, 50% 0%, 55% 100%);
}

/* 道路中线 */
.road-lines {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8rpx;
  height: 45%;
  background: repeating-linear-gradient(
    to bottom,
    #FFD700 0rpx,
    #FFD700 40rpx,
    transparent 40rpx,
    transparent 80rpx
  );
}

/* 退出按钮 */
.exit-button {
  position: absolute;
  top: 60rpx;
  left: 60rpx;
  padding: 20rpx 50rpx;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 500;
  z-index: 100;
  transition: all 0.3s ease;
}

/* 底部控制区域 */
.bottom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56rpx;
  background: transparent;
}

/* 细进度条 */
.thin-progress-bar {
  position: absolute;
  bottom: 50rpx;
  left: 0;
  right: 0;
  height: 6rpx;
  background: rgba(255, 255, 255, 0.2);
}

.thin-progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  width: 0%;
  transition: width 0.1s linear;
}

/* 得分条容器 */
.score-bar-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50rpx;
  display: flex;
  align-items: stretch;
  background: #f5f5f5;
}

/* 测试模式条 - 全灰色 */
.test-mode-bar {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #a0a0a0;
}

/* 用户标记旗子 */
.user-marks {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.user-mark {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  z-index: 10;
  transition: transform 0.2s ease;
}

/* 旗子样式 */
.flag-container {
  position: relative;
  width: 40rpx;
  height: 50rpx;
}

.flag-pole {
  position: absolute;
  left: 0;
  top: 0;
  width: 4rpx;
  height: 50rpx;
  background: #333;
}

.flag-banner {
  position: absolute;
  left: 4rpx;
  top: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 12rpx 0 12rpx 24rpx;
  border-color: transparent transparent transparent #FF0000;
  filter: drop-shadow(0 2rpx 6rpx rgba(0,0,0,0.3));
}

/* 结果弹窗 */
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
}

.result-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
}

.result-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600rpx;
  background: white;
  border-radius: 30rpx;
  padding: 50rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
}

.result-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.result-title {
  font-size: 42rpx;
  font-weight: 600;
  color: #333;
}

.result-score {
  text-align: center;
  margin-bottom: 40rpx;
}

.score-label {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 20rpx;
}

.score-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 20rpx;
}

.score-number {
  font-size: 80rpx;
  font-weight: bold;
  color: #4A9EFF;
}

.score-divider {
  font-size: 40rpx;
  color: #999;
  margin: 0 10rpx;
}

.score-total {
  font-size: 50rpx;
  color: #666;
}

/* 得分状态 */
.score-status {
  display: inline-block;
  padding: 10rpx 30rpx;
  border-radius: 20rpx;
  margin-top: 10rpx;
}

.score-status.excellent {
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
}

.score-status.good {
  background: linear-gradient(135deg, #42A5F5 0%, #2196F3 100%);
}

.score-status.pass {
  background: linear-gradient(135deg, #FFA726 0%, #FF9800 100%);
}

.score-status.fail {
  background: linear-gradient(135deg, #EF5350 0%, #F44336 100%);
}

.status-text {
  color: white;
  font-size: 28rpx;
  font-weight: 600;
}

/* 统计信息 */
.result-stats {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 0;
  border-top: 1rpx solid #eee;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 40rpx;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 10rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

/* 操作按钮 */
.result-actions {
  display: flex;
  gap: 30rpx;
}

.result-button {
  flex: 1;
  padding: 26rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.exit-btn {
  background: #f5f5f5;
  color: #666;
}

.exit-btn:active {
  background: #e0e0e0;
}

.review-btn {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  box-shadow: 0 8rpx 30rpx rgba(74, 158, 255, 0.3);
}

.review-btn:active {
  transform: scale(0.98);
}

/* Review模式覆盖层 */
.review-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56rpx;
  z-index: 300;
}

.review-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50rpx;
  background: #f5f5f5;
}

/* 灰色无分区域 */
.gray-zone {
  position: absolute;
  height: 100%;
  background: #e0e0e0;
}

/* 得分区间 */
.score-zone {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.5);
  height: 100%;
}

/* 得分区间样式 */
.zone-5 {
  background: linear-gradient(135deg, #FFA726 0%, #FF9800 100%);
}

.zone-4 {
  background: linear-gradient(135deg, #EF5350 0%, #F44336 100%);
}

.zone-3 {
  background: linear-gradient(135deg, #42A5F5 0%, #2196F3 100%);
}

.zone-2 {
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
}

/* 关闭Review按钮 */
.close-review-btn {
  position: fixed;
  bottom: 80rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: 20rpx 60rpx;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: 500;
  z-index: 301;
}

/* 响应式调整 */
@media screen and (max-width: 375px) {
  .result-content {
    width: 520rpx;
    padding: 40rpx;
  }
  
  .score-number {
    font-size: 70rpx;
  }
  
  .score-total {
    font-size: 45rpx;
  }
}
</style>