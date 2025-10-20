<template>
  <view>
    <view class="app">
      <!-- 视频区域 - 点击任何地方都能添加标记 -->
      <view class="video-container">
        <view class="video-content">
          <!-- <view class="road-scene">
            <view class="road-lines"></view>
          </view> -->
          <!-- <video id="videoId" class="video" :autoplay="true" :controls="false" :show-center-play-btn="false" :src="title_video_url" muted :enable-progress-gesture="false" @timeupdate="timeupdate">
          </video> -->
          
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
              <view class="exit-button-text" @tap.stop="exitLearnMode">
                exit
              </view>
            </view>
          </view>
          
          <!-- <cover-view class="modal" v-if="modalShow">
            <cover-view class="modal-content">
              <cover-view class="modal-title">提示</cover-view>
              <cover-view class="modal-text">这是一个覆盖在视频上的模态框</cover-view>
              <cover-view class="modal-buttons">
                <cover-view class="modal-btn" @tap="closeModal">取消</cover-view>
                <cover-view class="modal-btn confirm" @tap="confirmAction">确认</cover-view>
              </cover-view>
            </cover-view>
          </cover-view> -->
        </view>
      </view>
    
      <!-- 底部控制区域 -->
      <view class="bottom-controls">
        <!-- 细进度条 -->
        <view class="thin-progress-bar">
          <view class="thin-progress-fill" :style="{width: progress + '%'}"></view>
        </view>
    
        <!-- 得分条 -->
        <view class="score-bar-container">
          <!-- 得分区间 - 分段显示，模拟两个危险区间 -->
          <!-- 第一个危险区间：15%-45% -->
          <!-- <view class="gray-zone" style="left: 0; width: 15%;"></view> -->
          <!-- <view v-for="(item, index) in score_list" :key="index">
            <view v-for="(jtem, idx) in item" :key="idx" class="score-zone" :class="'zone-' + jtem.score" 
            :style="{
              'left': jtem.startTime / duration * 100 + '%',
              'width': (jtem.endTime - jtem.startTime) / duration * 100 + '%'
            }">
              <view>{{jtem.score}}</view>
            </view>
          </view> -->

          <!-- 用户标记的旗子 -->
          <view class="user-marks">
            <view v-for="(mark, index) in userMarks" 
                  :key="mark.id"
                  class="user-mark" 
                  :style="{left: mark.position + '%'}"
                  @tap.stop="showMarkInfo(mark, index)">
              <view class="mark-tooltip">
                <view>Click {{ index + 1 }} - {{ mark.time }}s ({{ mark.score }} points)</view>
              </view>
              <view class="flag-container">
                <view class="flag-pole"></view>
                <view class="flag-banner"></view>
              </view>
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
          <view class="result-button exit-btn" @tap="handleExit">
            Exit
          </view>
          <view class="result-button review-btn" @tap="handleReview">
            Review
          </view>
        </view>
      </view>
    </view>
        
    <!-- Review模式遮罩 -->
    <view v-if="reviewMode" class="review-overlay">
      <view class="score-bar-container">
       <!-- <view v-for="(item, index) in score_list" :key="index">
          <view v-for="(jtem, idx) in item" :key="idx" class="score-zone" :class="'zone-' + jtem.score" 
          :style="{
            'left': jtem.startTime / duration * 100 + '%',
            'width': (jtem.endTime - jtem.startTime) / duration * 100 + '%'
          }">
            {{jtem.score}}
          </view>
        </view> -->
        <view v-for="(item, index) in score_list" :key="index">
          <view v-for="(jtem, idx) in item" :key="idx" class="score-zone" :class="'zone-' + jtem.score" 
          :style="{
            'left': jtem.startTime / duration * 100 + '%',
            'width': (jtem.endTime - jtem.startTime) / duration * 100 + '%'
          }">
            <view>{{jtem.score}}</view>
          </view>
        </view>
      </view>
      
      <button class="close-review-btn" @tap="closeReview">
        Close Review
      </button>
    </view>
    
    
    <view>
      <u-modal width="400rpx" :show="modalShow" :title="modalTitle" :showCancelButton="showCancelButton" :content='modalContent' :cancelText="cancelText" :confirmText="confirmText" @cancel="cancel" @confirm="confirm"></u-modal>
    </view>
  </view>
  
</template>

<script>
import {getQuestionDetail, recordAdd} from '@/http/api/testQuestions.js'
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
      duration: 20, // 视频总时长（秒）
      progress: 0, // 进度百分比
      userMarks: [], // 用户标记的危险点
      playInterval: null, // 播放定时器
      clickCount: 0, // 点击计数
      recentClicks: [], // 最近的点击时间记录
      scoreDisqualified: false ,// 分数是否被取消
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
    },
    // 有效点击，是有得分的
    validMarksCount () {
      let clickCount = 0
      this.userMarks.forEach(item => {
        if (item.score > 0) {
          clickCount++
        }
      })
      return clickCount
    }
  },
  methods: {
    // durationchange (e) {
    //   this.duration = e
    //   console.log('总时长', e)
    // },
    // 更新视频进度
    timeupdate (e) {

      this.currentTime = e; // 获取当前播放时间
      this.progress = (this.currentTime / 20.04) * 100; // 计算进度条宽度
      
      if (this.progress == 100) {
        this.recordAdd()
        this.onTestComplete()
        // 计算分数
      }
      // this.sliderValue = (this.currentTime / this.duration) * 100; // 设置slider的值，用于拖动时显示当前位置的时间点提示（如果需要）
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
      console.log('标记点')
      // 检查是否已被取消资格
      if (this.scoreDisqualified) {
        return;
      }

      // 防作弊检测
      if (this.checkForCheating()) {
        return;
      }

      // 计算当前进度对应的得分
      // 得分区间设置（只在危险区间内有分数）
      let score = 0;
      
      // 判断得分
      this.score_list.forEach((item) => {
        item.forEach(jtem => {
          if (this.progress >= jtem.startTime && this.progress <= jtem.endTime) {
            score = jtem.score;
          }
        })
      })
      console.log('this.progress', this.progress)
      // 添加标记
      this.addMark(this.progress, score);
    },
    
    // 防作弊检测
    checkForCheating() {
      const now = Date.now();
      
      // 规则1: 两次点击之间至少要间隔0.5秒（500ms）
      if (this.recentClicks.length > 0) {
        const lastClick = this.recentClicks[this.recentClicks.length - 1];
        if (now - lastClick < 500) {
          this.handleCheating('Clicks too fast (minimum 0.5s between clicks)');
          return true;
        }
      }
      
      // 清理3秒前的点击记录
      this.recentClicks = this.recentClicks.filter(time => now - time < 3000);
      
      // 添加当前点击
      this.recentClicks.push(now);
      
      // 规则2: 3秒内不超过3次点击
      if (this.recentClicks.length > 3) {
        this.handleCheating('Too many clicks in 3 seconds (max 3)');
        return true;
      }
      
      // 规则3: 整个视频最多15次点击
      if (this.clickCount >= 15) {
        this.handleCheating('Maximum 15 clicks exceeded');
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
      
      // 显示警告
      // uni.showModal({
      //   title: '⚠️ Score Disqualified!',
      //   content: `You scored 0 for this video.\n\nReason: ${reason}`,
      //   showCancel: false,
      //   confirmText: 'OK'
      // });
      this.modalShow = true
      this.modalTitle =  '⚠️ Score Disqualified!'
      this.modalType = 'Score'
      this.showCancelButton = false
      this.confirmText = 'OK'
      this.modalContent = `You scored 0 for this video.\n\nReason: ${reason}`
      console.log('Score disqualified:', reason);
    },
    
    // 添加标记
    addMark(position, score) {
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
      
      // 添加标记（允许重叠）
      this.userMarks.push(newMark);
      console.log(`Mark ${this.clickCount} added at ${newMark.time}s with score ${finalScore}`);
      console.log(this.userMarks)
    },
    
    // 显示标记信息
    showMarkInfo(mark, index) {
      console.log(`Mark ${index + 1} at ${mark.time}s with score ${mark.score}`);
    },
    
    // 退出学习模式
    exitLearnMode() {
      console.log('点击退出')
      if (this.playInterval) {
        clearInterval(this.playInterval);
      }

      this.modalShow = true
      this.modalTitle =  'Exit'
      this.modalType = 'Exit'
      this.showCancelButton = true
      this.confirmText = 'OK'
      this.modalContent = `Are you sure you want to exit?`
    },
    confirm () {
      this.modalShow = false
      if (this.modalType == 'Score') {
        
      } else if (this.modalType == 'Exit') {
        uni.navigateBack();
      }
    },
    cancel () {
      this.modalShow = false
    },
    // 查询详情
    getQuestionDetail () {
      getQuestionDetail({
        id: this.questionId
      }).then(res => {
        if (res.code == 1) {
          console.log(res.data)
          this.duration = res.data.total_time
          this.title_video_url = res.data.title_video_url
          this.score_list = res.data.score_list
        }
      })
    },
    // 记录
    recordAdd () {
      recordAdd({
        question_id: this.questionId
      })
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
  },
  
  onLoad(options) {
    if (options.id) {
      this.questionId = options.id
      this.getQuestionDetail()
    }
    console.log('Hazard Perception Learn Mode loaded');

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
  flex: 1;
  background: #1a1a1a;
  overflow: hidden;
}

/* 模拟视频背景 - 道路场景 */
.video-content {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #4a5568 0%, #2d3748 40%, #1a202c 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .video {
    width: 100%;
    height: 100%;
    /* object-fit: fill; */
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

/* 退出按钮 */
.exit-button {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  /* padding: 0.5rem 1.25rem; */
  background: rgba(255,255,255,0.3);
  color: #fff;
  border: none;
  border-radius: 1.25rem;
  font-size: 1.2rem;
  font-weight: 500;
  z-index: 10000;
  transition: all 0.2s ease;
  width: 3.5rem;
  height: 2rem;
  line-height: 2rem;
  text-align:center;
  .exit-button-text {
    width: 3.5rem;
    height: 2rem;
    line-height: 2rem;
  }
}

.exit-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* 底部控制区域 */
.bottom-controls {
  /* position: absolute; */
  /* bottom: 0; */
  /* left: 0; */
  /* right: 0; */
  height: 2rem;
  background: transparent;
}

/* 细进度条 */
.thin-progress-bar {
  position: absolute;
  bottom: 1.85rem;
  left: 0;
  right: 0;
  height: 0.15rem;
  background: rgba(255, 255, 255, 0.2);
}

.thin-progress-fill {
  height: 0.15rem;
  background: rgba(255, 0, 0, 0.8);
  width: 0%;
  transition: width 0.25s linear;
}

/* 得分条容器 */
.score-bar-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.85rem;
  display: flex;
  align-items: stretch;
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
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 0 0.05rem 0.1rem rgba(0,0,0,0.5);
  height: 100%;
}

/* 得分区间样式 - 渐变效果 */
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

/* 区间分隔线 */
.score-zone::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  bottom: 20%;
  width: 0.05rem;
  background: rgba(255,255,255,0.3);
}

.score-zone:last-child::after {
  display: none;
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
  top: 0;
  /* transform: translate(-50%, -50%); */
  pointer-events: auto;
  z-index: 10;
  transition: transform 0.2s ease;
}

.user-mark:hover {
  transform: translate(-50%, -50%) scale(1.2);
  z-index: 20;
}

/* 旗子样式 */
.flag-container {
  position: relative;
  width: 1rem;
  height: 1.85rem;
}

.flag-pole {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.15rem;
  height: 1.85rem;
  background: #333;
}

.flag-banner {
  position: absolute;
  left: 0.1rem;
  top: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.5rem 0 0.5rem 1rem;
  border-color: transparent transparent transparent #FF0000;
  filter: drop-shadow(0 0.05rem 0.15rem rgba(0,0,0,0.3));
}

/* 悬停提示 */
.mark-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 0.6rem;
  border-radius: 0.3rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.user-mark:hover .mark-tooltip {
  opacity: 1;
}

.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
  .modal-content {
    width: 400rpx;
    background: white;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
  }
  
  .modal-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .modal-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-around;
  }
  
  .modal-btn {
    flex: 1;
    padding: 10px 0;
    text-align: center;
    border-right: 1px solid #eee;
  }
  
  .modal-btn:last-child {
    border-right: none;
  }
  
  .modal-btn.confirm {
    color: #007AFF;
  }
  
  .custom-controls {
    position: absolute;
    bottom: 50px;
    right: 20px;
    z-index: 100;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .control-icon {
    width: 24px;
    height: 24px;
  }
}

/* 响应式调整 - 小屏幕适配 */
@media screen and (max-width: 375px) {
  .exit-button {
    top: 1rem;
    left: 1rem;
    padding: 0.4rem 1rem;
    font-size: 0.7rem;
  }

  .score-zone {
    font-size: 0.5rem;
  }

  .bottom-controls {
    height: 1.15rem;
  }

  .thin-progress-bar {
    bottom: 1.15rem;
  }

  .score-bar-container {
    height: 1.15rem;
  }
}

/* 转换说明：
   基于小程序rpx到px的转换逻辑：在750px设计稿中，1rpx = 0.5px
   然后按照 font-size: 16px 进行rem转换：rem = px / 16
   例如：60rpx = 60 * 0.5px = 30px = 30 / 16 = 1.875rem
   但考虑到实际视觉效果，这里采用更合理的转换比例
*/

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
  width: 37.5rem; /* 600rpx = 300px = 37.5rem */
  height: 80%;
  background: white;
  border-radius: 0.875rem; /* 30rpx = 15px = 1.875rem */
  padding: 1.125rem; /* 50rpx = 25px = 3.125rem */
  box-shadow: 0 1.25rem 3.75rem rgba(0, 0, 0, 0.3); /* 20rpx 60rpx = 10px 30px */
}

.result-header {
  text-align: center;
  margin-bottom: 0.5rem; /* 40rpx = 20px = 2.5rem */
}

.result-title {
  font-size: 1.625rem; /* 42rpx = 21px = 2.625rem */
  font-weight: 600;
  color: #333;
}

.result-score {
  /* display: flex;
  text-align: center;
  justify-content: space-between; */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem; /* 40rpx = 20px = 2.5rem */
}

.score-label {
  font-size: 1.25rem; /* 28rpx = 14px = 1.75rem */
  color: #666;
  display: block;
  margin-bottom: 0.25rem; /* 20rpx = 10px = 1.25rem */
}

.score-display {
  /* display: flex;
  align-items: baseline;
  justify-content: center; */
  margin-bottom: 0.5rem; /* 20rpx = 10px = 1.25rem */
}

.score-number {
  font-size: 2rem; /* 80rpx = 40px = 5rem */
  font-weight: bold;
  color: #4A9EFF;
}

.score-divider {
  font-size: 2rem; /* 40rpx = 20px = 2.5rem */
  color: #999;
  margin: 0 0.625rem; /* 10rpx = 5px = 0.625rem */
}

.score-total {
  font-size: 2.125rem; /* 50rpx = 25px = 3.125rem */
  color: #666;
}

/* 得分状态 */
.score-status {
  
  display: inline-block;
  justify-content: center;
  align-items: center;
  /* height: 2rem; */
  padding: 0.425rem 0.875rem; /* 10rpx 30rpx = 5px 15px */
  border-radius: 0.55rem; /* 20rpx = 10px = 1.25rem */
  /* margin-top: 0.425rem; */ /* 10rpx = 5px = 0.625rem */
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
  font-size: 1.05rem; /* 28rpx = 14px = 1.75rem */
  font-weight: 600;
  
}

/* 统计信息 */
.result-stats {
  display: flex;
  justify-content: space-around;
  padding: 0.875rem 0; /* 30rpx = 15px = 1.875rem */
  border-top: 0.0625rem solid #eee; /* 1rpx = 0.5px = 0.0625rem */
  border-bottom: 0.0625rem solid #eee; /* 1rpx = 0.5px = 0.0625rem */
  margin-bottom: 0.5rem; /* 40rpx = 20px = 2.5rem */
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 1.05rem; /* 24rpx = 12px = 1.5rem */
  color: #999;
  display: block;
  /* margin-bottom: 0.425rem; *//* 10rpx = 5px = 0.625rem */
}

.stat-value {
  font-size: 1.25rem; /* 36rpx = 18px = 2.25rem */
  font-weight: 600;
  color: #333;
  margin-left: 1rem;
}

/* 操作按钮 */
.result-actions {
  display: flex;
  /* gap: 1.875rem; /* 30rpx = 15px = 1.875rem */
}

.result-button {
  flex: 1;
  padding: 0.625rem; /* 26rpx = 13px = 1.625rem */
  border-radius: 3.125rem; /* 50rpx = 25px = 3.125rem */
  font-size: 1rem; /* 32rpx = 16px = 2rem */
  font-weight: 600;
  text-align: center;
  border: none;
  transition: all 0.3s ease;
}

.exit-btn {
  background: #f5f5f5;
  color: #666;
  margin-right: 0.625rem;
}

.exit-btn:active {
  background: #e0e0e0;
}

.review-btn {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  box-shadow: 0 0.5rem 1.875rem rgba(74, 158, 255, 0.3); /* 8rpx 30rpx = 4px 15px */
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
  height: 1.5rem; /* 56rpx = 28px = 3.5rem */
  z-index: 300;
}

.review-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3.125rem; /* 50rpx = 25px = 3.125rem */
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
  font-size: 1.5rem; /* 24rpx = 12px = 1.5rem */
  font-weight: bold;
  text-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.5); /* 2rpx 4rpx = 1px 2px */
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
  bottom: 3rem; /* 80rpx = 40px = 5rem */
  left: 50%;
  transform: translateX(-50%);
  padding: 1.05rem 2.75rem; /* 20rpx 60rpx = 10px 30px */
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: 0.125rem solid rgba(255, 255, 255, 0.3); /* 2rpx = 1px = 0.125rem */
  border-radius: 3.125rem; /* 50rpx = 25px = 3.125rem */
  font-size: 1.25rem; /* 28rpx = 14px = 1.75rem */
  font-weight: 500;
  z-index: 301;
}
</style>
