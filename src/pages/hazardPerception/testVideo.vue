<template>
  <view>
    <view class="container">
      <!-- 顶部栏 -->
      <view class="top-bar">
        <view class="question-counter">Video {{ currentQuestion }} of {{questionsData.length}}</view>
        <!-- <text :class="['time-remaining', timeRemaining <= 300 ? 'warning' : '']">
          Time: {{ formattedTime }}
        </text> -->
        
        <view style="display: flex;height: 100%;">
          <view class="control-button previous" @click="previousQuestion">
            <text class="arrow">←</text>
            <text>Previous</text>
          </view>
          <view class="control-button previous" @click="nextQuestion">
            <text>Next</text>
            <text class="arrow">→</text>
          </view>
          <view class="control-button next" @click="endTest">
            <text>End Test</text>
          </view>
        </view>
      </view>
    
      <!-- 主要内容区域 -->
      <view :class="['main-content', !currentQuestionData.title_video_url ? 'no-image' : '']">
        <view class="video-container" @tap="addMarkAtCurrentTime">
          <view class="video-content">
            <!-- <view class="road-scene">
              <view class="road-lines"></view>
            </view> -->
            <!-- <video id="videoId" class="video" :autoplay="true" :controls="false" :show-center-play-btn="false" :src="currentQuestionData.title_video_url" muted playsinline></video>  -->
            <DomVideoPlayer
              style="width:100%;height: 100%;"
              ref="domVideoPlayer"
              :src="currentQuestionData.title_video_url"
              :autoplay="autoplay"
              :loop="loop"
              :controls="controls"
              :muted="muted"
              :isLoading="true"
              @timeupdate="timeupdate"
            />
          </view>
        </view>
        
        <view class="bottom-controls-video">
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
              <view v-for="(mark, index) in currentQuestionData.userMarks" 
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
      </view>

      <!-- 底部控制栏 -->
      <!-- <view class="bottom-controls">
        <view class="control-buttons">
          <button class="control-button previous" @click="previousQuestion">
            <text class="arrow">←</text>
            <text>Previous</text>
          </button>
          <button 
            :class="['control-button', 'flag', questionStates[currentQuestion - 1].flagged ? 'flagged' : '']" 
            @click="toggleFlag"
          >
            <text class="flag-icon">!</text>
            <text>Flag</text>
          </button>
          <button class="control-button review" @click="showReview">
            <text class="review-icon">👓</text>
            <text>Review</text>
          </button>
          <button class="control-button sound" @click="playAudio">
            <text class="sound-icon">🔊</text>
          </button>
        </view>
        <button class="control-button next" @click="nextQuestion">
          <text>Next</text>
          <text class="arrow">→</text>
        </button>
      </view> -->
    
      <!-- Review面板遮罩层 -->
      <view v-if="reviewVisible" class="review-overlay active" @click="handleOverlayClick">
        <view class="review-panel" @click.stop>
          <view class="review-header">
            <text class="review-title">Review Questions</text>
            <button class="review-close" @click="closeReview">×</button>
          </view>
          
          <view class="review-stats">
            <view class="stat-item">
              <view class="stat-indicator answered"></view>
              <text>Answered: <text class="stat-bold">{{ answeredCount }}</text></text>
            </view>
            <view class="stat-item">
              <view class="stat-indicator flagged"></view>
              <text>Flagged: <text class="stat-bold">{{ flaggedCount }}</text></text>
            </view>
            <view class="stat-item">
              <view class="stat-indicator unanswered"></view>
              <text>Unanswered: <text class="stat-bold">{{ unansweredCount }}</text></text>
            </view>
          </view>
          
          <scroll-view class="review-grid-container" scroll-y>
            <view class="review-grid">
              <view 
                v-for="(state, index) in questionStates" 
                :key="index"
                :class="[
                  'question-box',
                  (index + 1) === currentQuestion ? 'current' : '',
                  state.answered ? 'answered' : '',
                  state.flagged ? 'flagged' : ''
                ]"
                @click="goToQuestionFromReview(index + 1)"
              >
                <text>{{ state.index }}</text>
              </view>
            </view>
          </scroll-view>
          
          <view class="review-footer">
            <view class="review-action-btn secondary" @click="closeReview">Continue Test</view>
            <view class="review-action-btn primary" @click="endTest">End Test</view>
          </view>
        </view>
      </view>
    </view>
    <u-modal width="400rpx" :show="modalShow" :title="modalTitle" :showCancelButton="showCancel" :content='modalContent' :cancelText="cancelText" :confirmText="confirmText" @cancel="cancel" @confirm="confirm"></u-modal>
    
    
    <!-- 结果弹窗 -->
    <view v-if="showResult" class="result-modal">
      <view class="result-backdrop" @tap.stop></view>
      <view class="result-content">
        <view class="result-header">
          <text class="result-title">Test Complete</text>
        </view>
        
        <view class="result-score">
          <view class="score-label">Your Score</view>
          <view class="score-display">
            <text class="score-number">{{ totalScore }}</text>
            <!-- <text class="score-divider">/</text>
            <text class="score-total">10</text> -->
          </view>
          
          
          <!-- 得分状态 -->
          <view class="score-status" :class="scoreStatusClass">
            <view class="status-text">{{ scoreStatusText }}</view>
          </view>
        </view>
        
        <!-- 标记统计 -->
        <view class="result-stats">
          <view class="stat-item">
            <view class="stat-label">Total Clicks</view>
            <view class="stat-value">{{ clickCount }}</view>
          </view>
          <view class="stat-item">
            <view class="stat-label">Valid Marks</view>
            <view class="stat-value">{{ validMarksCount }}</view>
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
    
  </view>
  
</template>

<script>
import {getExamQuestion, submitExamQuestion} from '@/http/api/testQuestions.js'
import DomVideoPlayer from 'uniapp-video-player'
export default {
  components: {
    DomVideoPlayer
  },
  data() {
    return {
      paper_id: null,
      // 题目数据
      paperInfo: {
        limit_time: 0,
        quantity: 0
      },
      // 当前题目编号
      currentQuestion: 1,
      // 倒计时剩余秒数
      timeRemaining: 57 * 60,
      // Review面板是否显示
      reviewVisible: false,
      // 计时器
      timer: null,
      
      // 题目状态数组
      questionStates: [],
      
      // 题目数据
      questionsData: [],
      
      modalShow: false,
      modalTitle: '',
      modalType: '',
      modalContent: '',
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      showCancel: true,
      
      score_list: [],
      currentTime: 0, // 当前时间（秒）
      duration: 0, // 视频总时长（秒）
      progress: 0, // 进度百分比
      autoplay: true, // 是否自动播放
      loop: false, // 是否循环播放
      controls: false, // 是否显示控制栏
      muted: false, // 是否静音
      isLoading: false, // Android系统加载时显示loading(为了遮挡安卓的黑色按钮)
      objectFit: 'contain', // 视频尺寸与video区域的适应模式
      userMarks: [], // 用户标记的危险点
      playInterval: null, // 播放定时器
      clickCount: 0, // 点击计数
      validMarksCount: 0,
      recentClicks: [], // 最近的点击时间记录
      scoreDisqualified: false ,// 分数是否被取消
      showResult: true,
      totalScore: 0
    }
  },
  
  computed: {
    // 当前题目数据
    currentQuestionData() {
      // 如果当前题号有特定数据，使用特定数据，否则使用默认数据
      if (this.questionsData[this.currentQuestion - 1]) {
        const data = this.questionsData[this.currentQuestion - 1]
        console.log(data)
        const state = this.questionStates[this.currentQuestion - 1]
        console.log('state', state)
        return {
          ...data,
          selectedOption: state ? state.selectedOption : null
        }
      }

      return {}
    },
    
    // 已回答题目数
    answeredCount() {
      return this.questionStates.filter(q => q.answered).length
    },
    
    // 已标记题目数
    flaggedCount() {
      return this.questionStates.filter(q => q.flagged).length
    },
    
    // 未回答题目数
    unansweredCount() {
      return this.questionsData.length - this.answeredCount
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
  
  mounted() {
    this.getExamQuestion()

    // this.startAutoPlay();
  },

  beforeDestroy() {
    // 清理计时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  
  // onUnload() {
  //   console.log('恢复竖屏')
  //   // 页面卸载时恢复竖屏
  //   // #ifdef APP-PLUS
  //   plus.screen.lockOrientation('portrait-primary');
  //   // #endif
  // },
  
  methods: {
    // 取题
    getExamQuestion () {

      const videoMockTest = uni.getStorageSync('questions')
      // {
      //   paper_id: this.paper_id,
      //   videoData: this.videoData
      // }
      // this.paper_id = videoMockTest.paper_id
      // 点击置空
      videoMockTest.forEach(item => {
        item['userMarks'] = []
      })
      
      this.questionsData = videoMockTest
      console.log(this.questionsData)
      this.duration = this.currentQuestionData.total_time
      
      // this.startAutoPlay()
      
      // this.initQuestionStates()
    },
    // 初始化题目状态
    initQuestionStates() {
      console.log('this.questionsData', this.questionsData)
      this.questionStates = this.questionsData.map((item, index) => ({
        index: index + 1,
        id: item.id,
        answered: false,
        flagged: false,
        selectedOption: null,
        hasImage: item.title_video_url ? true : false
      }))
      console.log('this.questionStates', this.questionStates)
    },
    

    // 切换标记状态
    toggleFlag() {
      const current = this.questionStates[this.currentQuestion - 1]
      current.flagged = !current.flagged
    },
    
    // 下一题
    nextQuestion() {
      clearInterval(this.playInterval);
      console.log(this.questionStates)
      if (this.currentQuestion < this.questionsData.length) {
        this.goToQuestion(this.currentQuestion + 1)
      } else {
        uni.showToast({
          title: 'This is the last video. Click Review to check your answers.',
          icon: 'none',
          duration: 2000
        })
      }
    },
    
    // 上一题
    previousQuestion() {
      clearInterval(this.playInterval);
      if (this.currentQuestion > 1) {
        this.goToQuestion(this.currentQuestion - 1)
      } else {
        uni.showToast({
          title: 'This is the first video.',
          icon: 'none',
          duration: 2000
        })
      }
    },
    
    // 显示Review面板
    showReview() {
      this.reviewVisible = true
    },
    
    // 关闭Review面板
    closeReview() {
      this.reviewVisible = false
    },
    
    // 处理遮罩层点击
    handleOverlayClick() {
      this.closeReview()
    },
    
    // 跳转到指定题目
    goToQuestion(questionNumber) {
      
      this.currentQuestion = questionNumber
      
      // 恢复该题目的选择状态
      const state = this.questionStates[questionNumber - 1]
      if (this.questionsData[questionNumber]) {
        this.questionsData[questionNumber].selectedOption = state.selectedOption
      }
      this.progress = 0
      this.currentTime = 0
      this.duration = this.currentQuestionData.total_time
      // this.startAutoPlay()
    },
    
    // 从Review面板跳转到题目
    goToQuestionFromReview(questionNumber) {
      this.goToQuestion(questionNumber)
      this.closeReview()
    },
    confirm () {
      this.modalShow = false
      if (this.modalType === 'EndTest') {
        uni.showToast({
          title: 'Test ended. Calculating results...',
          icon: 'none',
          duration: 2000
        })
        this.closeReview()
        // this.cacheCurrentVideoScore()
        this.onTestComplete()
      } else if (this.modalType === 'Finished') {
        // clearInterval(this.playInterval)
        this.onTestComplete()
      }
    },
    cancel () {
      this.modalShow = false
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

    // 结束考试
    endTest() {
      // const unanswered = this.questionStates.filter(q => !q.answered).length
      
      const unanswered = this.questionsData.filter(item => item.userMarks.length === 0).length

      this.modalShow = true
      this.showCancel = true
      this.modalTitle =  'End Test'
      this.modalType = 'EndTest'
      this.modalContent = `Are you sure you want to end the test? You have ${unanswered} unanswered video.`
    },
    endTestAfter () {
      
      this.modalShow = true
      this.showCancel = false
      this.modalTitle =  'Finished HazardTest'
      this.modalType = 'Finished'
      this.modalContent = `You have finished dangerous driving questions questions. Are you sure you want to end the test?`
    },
    timeupdate (e) {
      // console.log('更新进度',e)
      
      this.currentTime = e; // 获取当前播放时间
      this.progress = (this.currentTime / 20.04) * 100; // 计算进度条宽度
      
      if (this.progress == 100) {
        // this.recordAdd()
        // 判断最后一题
        if (this.currentQuestion != this.questionsData.length) {
          this.nextQuestion()
        } else {
          // 提示答题结束
          this.endTestAfter()
        }
      }
      // this.sliderValue = (this.currentTime / this.duration) * 100; // 设置slider的值，用于拖动时显示当前位置的时间点提示（如果需要）
    },
    // 自动播放
    startAutoPlay() {
      this.playInterval = setInterval(() => {
        if (this.currentTime < this.duration) {
          this.currentTime += 1;
          this.progress = (this.currentTime / this.duration) * 100;
        } else {
          clearInterval(this.playInterval);
          this.currentTime = this.duration;
          this.progress = 100;
          // 自动缓存当前视频分数
          this.cacheCurrentVideoScore()
          // 如果不是最后一题，跳转到下一题
          if (this.currentQuestion != this.questionsData.length) {
            this.nextQuestion()
          } else {
            // 提示答题结束
            this.endTestAfter()
          }
          // this.nextQuestion()
        }
      }, 100);
    },
    // 在当前时间添加标记
    addMarkAtCurrentTime() {
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
      this.questionsData[this.currentQuestion - 1].userMarks.forEach(mark => {
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
      this.questionsData[this.currentQuestion - 1].userMarks.push(newMark);
      
      console.log('点击', this.questionsData[this.currentQuestion - 1])
      
      console.log(`Mark ${this.clickCount} added at ${newMark.time}s with score ${finalScore}`);
    },
    
    // 显示标记信息
    showMarkInfo(mark, index) {
      console.log(`Mark ${index + 1} at ${mark.time}s with score ${mark.score}`);
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
    // 缓存当前视频分数
    cacheCurrentVideoScore () {
      const mockTestResult = uni.getStorageSync('mockTestResult')
      const bsQuestions = mockTestResult.questions // 笔试答案

      this.questionsData.forEach((qs, index) => {
        let result = qs.userMarks.map(mark => mark.time).join(',')
        // 查找是否已存在相同ID的题目
        const existingIndex = bsQuestions.findIndex(item => item.id === qs.id)
        
        if (existingIndex !== -1) {
          // 如果存在相同ID，替换answer
          bsQuestions[existingIndex].answer = result
        } else {
          // 如果不存在，添加新题目
          bsQuestions.push({
            id: qs.id,
            answer: result
          })
        }
        
      })

      uni.setStorageSync('mockTestResult', {
        paper_id: this.paper_id,
        questions: bsQuestions
      })
    }
  },
  onLoad (option) {
    // this.paper_id = option.paper_id
    
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
/* 全局样式重置 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  overflow: hidden;
}

/* 顶部栏 */
.top-bar {
  background: #F5F5F5;
  padding: 0.375rem 1.25rem; /* 6px 20px → 0.375rem 1.25rem */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.0625rem solid #E0E0E0; /* 1px → 0.0625rem */
  height: 2.5rem; /* 40px → 2.5rem */
}

.question-counter {
  font-size: 0.9375rem; /* 15px → 0.9375rem */
  font-weight: 600;
  color: #333333;
}

.time-remaining {
  font-size: 0.875rem; /* 14px → 0.875rem */
  color: #666666;
  font-weight: 500;
  transition: color 0.3s ease;
}

.time-remaining.warning {
  color: #CC0000;
  font-weight: 600;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* padding: 0.625rem 0.9375rem; */
  background: #FFFFFF;
  min-height: 0;
  position: relative;
}

/* 当没有图片时，问题区域占满 */
.main-content.no-image .question-section {
  max-width: 100%;
  flex: 1;
}

/* 左侧问题区域 */
.question-section {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  max-width: 55%;
  justify-content: space-between;
  padding-right: 0.9375rem; /* 15px → 0.9375rem */
  overflow: auto;
}

.question-header {
  flex-shrink: 0;
}

.question-text {
  font-size: 1.0625rem; /* 17px → 1.0625rem */
  line-height: 1.45;
  color: #333333;
  margin-bottom: 0.625rem; /* 10px → 0.625rem */
  font-weight: 500;
}

.mark-instruction {
  font-size: 0.875rem; /* 14px → 0.875rem */
  color: #CC0000;
  font-weight: 500;
  margin-bottom: 0.75rem; /* 12px → 0.75rem */
}

/* 答案选项 */
.answer-options {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-evenly;
}

.answer-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.75rem 0.875rem; /* 12px 14px → 0.75rem 0.875rem */
  background: #F9F9F9;
  border-radius: 0.5rem; /* 8px → 0.5rem */
  transition: all 0.2s ease;
  border: 0.125rem solid transparent; /* 2px → 0.125rem */
  min-height: 3rem; /* 48px → 3rem */
  margin-bottom: 0.5rem; /* 8px → 0.5rem */
}

.answer-checkbox {
  width: 1.5rem; /* 24px → 1.5rem */
  height: 1.5rem; /* 24px → 1.5rem */
  border: 0.125rem solid #0099CC; /* 2px → 0.125rem */
  border-radius: 0.25rem; /* 4px → 0.25rem */
  background: white;
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s ease;
  margin-right: 0.75rem; /* 12px → 0.75rem */
}

.answer-option:active {
  background: #E8F4F8;
  transform: scale(0.98);
}

.answer-option.selected {
  background: #E8F4F8;
  border: 0.125rem solid #0099CC; /* 2px → 0.125rem */
}

.answer-option.selected .answer-checkbox {
  background: #0099CC;
}

.answer-option.selected .answer-checkbox::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1rem; /* 16px → 1rem */
  font-weight: bold;
}

.answer-text {
  font-size: 0.9375rem; /* 15px → 0.9375rem */
  line-height: 1.35;
  color: #333333;
  flex: 1;
}

/* 右侧图片区域 */
.image-section {
  flex: 0.8;
  max-width: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3125rem; /* 5px → 0.3125rem */
}

.question-image {
  width: 100%;
  height: 100%;
  border-radius: 0.375rem; /* 6px → 0.375rem */
  box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.12); /* 2px 8px → 0.125rem 0.5rem */
}

/* 底部控制栏 */
.bottom-controls {
  background: #E8E4DC;
  padding: 0.625rem 0.9375rem; /* 10px 15px → 0.625rem 0.9375rem */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 0.0625rem solid #D0D0C0; /* 1px → 0.0625rem */
  height: 4.375rem; /* 70px → 4.375rem */
}

.control-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}

.control-button {
  font-size: 1rem; /* 16px → 1rem */
  border: 0.125rem solid #B0A090; /* 2px → 0.125rem */
  border-radius: 0.5rem; /* 8px → 0.5rem */
  background: #FFFFFF;
  color: #333333;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.1); /* 2px 4px → 0.125rem 0.25rem */
  white-space: nowrap;
  font-weight: 500;
  
  margin-right: 0.625rem; /* 10px → 0.625rem */
  height: 100%;
}

.control-button:active {
  transform: scale(0.98);
  box-shadow: 0 0.0625rem 0.125rem rgba(0,0,0,0.1); /* 1px 2px → 0.0625rem 0.125rem */
}

/* 各按钮的特定样式 */
.control-button.previous {
  color: #CC0000;
}

.control-button.previous .arrow {
  color: #CC0000;
  font-size: 1.125rem; /* 18px → 1.125rem */
  margin-right: 0.5rem; /* 8px → 0.5rem */
}

.control-button.flag {
  color: #CC0000;
}

.control-button.flag .flag-icon {
  font-size: 1.25rem; /* 20px → 1.25rem */
  margin-right: 0.5rem; /* 8px → 0.5rem */
}

.control-button.flag.flagged {
  background: #FFE4E4;
  border-color: #CC0000;
}

.control-button.review {
  color: #CC0000;
}

.control-button.review .review-icon {
  font-size: 1.25rem; /* 20px → 1.25rem */
  margin-right: 0.5rem; /* 8px → 0.5rem */
}

.control-button.sound {
  padding: 0.75rem 1rem; /* 12px 16px → 0.75rem 1rem */
  min-width: 3.5rem; /* 56px → 3.5rem */
}

.control-button.sound .sound-icon {
  font-size: 1.25rem; /* 20px → 1.25rem */
}

.control-button.next {
  color: #CC0000;
  margin-left: auto;
  margin-right: 0;
}

.control-button.next .arrow {
  color: #CC0000;
  font-size: 1.125rem; /* 18px → 1.125rem */
  margin-left: 0.5rem; /* 8px → 0.5rem */
}

/* Review面板遮罩层 */
.review-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 500;
}

.review-overlay.active {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.review-panel {
  background: white;
  border-radius: 0.75rem; /* 12px → 0.75rem */
  box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.3); /* 4px 20px → 0.25rem 1.25rem */
  width: 90%;
  max-width: 37.5rem; /* 600px → 37.5rem */
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

.review-header {
  padding: 0.4375rem 1.25rem; /* 15px 20px → 0.9375rem 1.25rem */
  border-bottom: 0.125rem solid #E0E0E0; /* 2px → 0.125rem */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #F5F5F5;
  border-radius: 0.75rem 0.75rem 0 0; /* 12px → 0.75rem */
}

.review-title {
  font-size: 1.125rem; /* 18px → 1.125rem */
  font-weight: 600;
  color: #333;
  flex: 1;
}

.review-close {
  width: 2rem; /* 32px → 2rem */
  height: 2rem; /* 32px → 2rem */
  border: none;
  background: #CC0000;
  color: white;
  border-radius: 50%;
  font-size: 1.125rem; /* 18px → 1.125rem */
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-close:active {
  transform: scale(0.9);
}

.review-stats {
  padding: 0.55rem 1.25rem; /* 12px 20px → 0.75rem 1.25rem */
  background: #FFF9E6;
  border-bottom: 0.0625rem solid #E0E0E0; /* 1px → 0.0625rem */
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.875rem; /* 14px → 0.875rem */
  /* margin: 0.3125rem; /* 5px → 0.3125rem */
}

.stat-indicator {
  width: 1.25rem; /* 20px → 1.25rem */
  height: 1.25rem; /* 20px → 1.25rem */
  border-radius: 0.25rem; /* 4px → 0.25rem */
  border: 0.125rem solid #999; /* 2px → 0.125rem */
  margin-right: 0.375rem; /* 6px → 0.375rem */
}

.stat-indicator.answered {
  background: #4CAF50;
  border-color: #4CAF50;
}

.stat-indicator.flagged {
  background: #FF9800;
  border-color: #FF9800;
}

.stat-indicator.unanswered {
  background: white;
  border-color: #999;
}

.stat-bold {
  font-weight: 600;
}

.review-grid-container {
  flex: 1;
  width: 100%;
  max-height: 11.5rem;
}

.review-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: left;
  max-width: 25rem; /* 400px → 25rem */
  margin: 0 auto;
  padding: 0.625rem 0;
}

.question-box {
  width: 3.75rem; /* 60px → 3.75rem */
  height: 3.75rem; /* 60px → 3.75rem */
  border: 0.125rem solid #CCC; /* 2px → 0.125rem */
  border-radius: 0.5rem; /* 8px → 0.5rem */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem; /* 16px → 1rem */
  font-weight: 600;
  position: relative;
  background: white;
  margin: 0.3125rem; /* 5px → 0.3125rem */
}

.question-box:active {
  transform: scale(0.95);
}

.question-box.current {
  border-color: #0099CC;
  background: #E8F4F8;
  box-shadow: 0 0 0 0.1875rem rgba(0, 153, 204, 0.2); /* 3px → 0.1875rem */
}

.question-box.answered {
  background: #E8F5E9;
  border-color: #4CAF50;
  color: #2E7D32;
}

.question-box.flagged::after {
  content: '🚩';
  position: absolute;
  top: -0.3125rem; /* -5px → -0.3125rem */
  right: -0.3125rem; /* -5px → -0.3125rem */
  font-size: 0.875rem; /* 14px → 0.875rem */
  background: white;
  border-radius: 50%;
  width: 1.25rem; /* 20px → 1.25rem */
  height: 1.25rem; /* 20px → 1.25rem */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.2); /* 2px 4px → 0.125rem 0.25rem */
}

.review-footer {
  padding: 0.7375rem 1.25rem; /* 15px 20px → 0.9375rem 1.25rem */
  border-top: 0.125rem solid #E0E0E0; /* 2px → 0.125rem */
  display: flex;
  flex-direction: row;
  justify-content: center;
  background: #F5F5F5;
  border-radius: 0 0 0.75rem 0.75rem; /* 12px → 0.75rem */
  height: 100%;
}

.review-action-btn {
  padding: 0.425rem 1.25rem; /* 10px 20px → 0.625rem 1.25rem */
  border: none;
  border-radius: 0.375rem; /* 6px → 0.375rem */
  font-size: 0.875rem; /* 14px → 0.875rem */
  font-weight: 500;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.1); /* 2px 4px → 0.125rem 0.25rem */
  margin: 0 0.3125rem; /* 5px → 0.3125rem */
  height: 100%;
}

.review-action-btn.primary {
  background: #0099CC;
  color: white;
}

.review-action-btn.secondary {
  background: white;
  color: #333;
  border: 0.0625rem solid #CCC; /* 1px → 0.0625rem */
}

.review-action-btn:active {
  transform: scale(0.95);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(1.25rem); /* 20px → 1.25rem */
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 横屏模式优化 */
@media screen and (orientation: landscape) and (max-height: 37.5rem) { /* 600px → 37.5rem */
  .top-bar {
    height: 2.25rem; /* 36px → 2.25rem */
    padding: 0.3125rem 0.9375rem; /* 5px 15px → 0.3125rem 0.9375rem */
  }
  
  .question-counter {
    font-size: 0.875rem; /* 14px → 0.875rem */
  }
  
  .time-remaining {
    font-size: 0.8125rem; /* 13px → 0.8125rem */
  }
  
  /* .main-content {
    padding: 0.5rem 0.75rem 0 0.75rem;
  } */
  
  .question-text {
    font-size: 1rem; /* 16px → 1rem */
    margin-bottom: 0.5rem; /* 8px → 0.5rem */
  }
  
  .mark-instruction {
    font-size: 0.8125rem; /* 13px → 0.8125rem */
    margin-bottom: 0.625rem; /* 10px → 0.625rem */
  }
  
  .answer-option {
    padding: 0.625rem 0.75rem; /* 10px 12px → 0.625rem 0.75rem */
    min-height: 2.75rem; /* 44px → 2.75rem */
  }
  
  .answer-text {
    font-size: 0.875rem; /* 14px → 0.875rem */
  }
  
  .answer-checkbox {
    width: 1.375rem; /* 22px → 1.375rem */
    height: 1.375rem; /* 22px → 1.375rem */
  }
  
  .bottom-controls {
    height: 3.75rem; /* 60px → 3.75rem */
    padding: 0.5rem 0.75rem; /* 8px 12px → 0.5rem 0.75rem */
  }
  
  .control-button {
    font-size: 0.875rem; /* 14px → 0.875rem */
    padding: 0.625rem 1rem; /* 10px 16px → 0.625rem 1rem */
    
  }
  
  .review-grid {
    max-width: 37.5rem; /* 600px → 37.5rem */
  }
  
  .question-box {
    width: 3.125rem; /* 50px → 3.125rem */
    height: 3.125rem; /* 50px → 3.125rem */
    font-size: 0.875rem; /* 14px → 0.875rem */
  }
  
  .review-panel {
    max-height: 90vh;
    max-width: 43.75rem;
  }
}

/* 竖屏模式 */
@media screen and (orientation: portrait) {
  .main-content {
    flex-direction: column;
    padding: 0.75rem; /* 12px → 0.75rem */
  }
  
  .question-section {
    max-width: 100%;
    flex: 0.55;
    justify-content: flex-start;
    padding-right: 0;
  }
  
  .image-section {
    max-width: 100%;
    flex: 0.45;
    padding: 0.5rem; /* 8px → 0.5rem */
  }
  
  .question-text {
    font-size: 1rem; /* 16px → 1rem */
    margin-bottom: 0.625rem; /* 10px → 0.625rem */
  }
  
  .answer-option {
    padding: 0.625rem 0.75rem; /* 10px 12px → 0.625rem 0.75rem */
  }
  
  .answer-text {
    font-size: 0.875rem; /* 14px → 0.875rem */
  }
}

/* 视频容器 */
.video-container {
  position: relative;
  width: 100%;
  flex: 1;
  background: #1a1a1a;
  overflow: hidden;
  padding: 0;
  margin: 0;
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
}

.video-content .video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

/* 底部控制区域 */
.bottom-controls-video {
  /* position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.9375rem;
  background: transparent; */
  height: 2rem;
  background: transparent;
}

/* 细进度条 */
.thin-progress-bar {
  position: absolute;
  height: 1.5625rem; /* 50rpx → 3.125rem */
  left: 0;
  right: 0;
  height: 0.375rem; /* 6rpx → 0.375rem */
  background: rgba(255, 255, 255, 0.2);
}

.thin-progress-fill {
  height: 100%;
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
  height: 1.5625rem; /* 50rpx → 3.125rem */
  display: flex;
  align-items: stretch;
  background: #f5f5f5;
}

/* 测试模式条 - 全灰色 */
.test-mode-bar {
  position: absolute;
  width: 100%;
  height: 100%;
  /* background: #a0a0a0; */
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
  width: 1.25rem; /* 40rpx → 2.5rem */
  height: 1.5625rem; /* 50rpx → 3.125rem */
}

.flag-pole {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.125rem; /* 4rpx → 0.25rem */
  height: 1.5625rem; /* 50rpx → 3.125rem */
  background: #333;
}

.flag-banner {
  position: absolute;
  left: 0.125rem; /* 4rpx → 0.25rem */
  top: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.375rem 0 0.375rem 0.75rem; /* 12rpx 0 12rpx 24rpx → 0.75rem 0 0.75rem 1.5rem */
  border-color: transparent transparent transparent #FF0000;
  filter: drop-shadow(0 0.0625rem 0.1875rem rgba(0,0,0,0.3)); /* 2rpx 6rpx → 0.125rem 0.375rem */
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
  margin-bottom: 1.05rem; /* 20rpx = 10px = 1.25rem */
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
  margin-bottom: 1.5rem; /* 40rpx = 20px = 2.5rem */
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
  font-size: 1.2rem; /* 32rpx = 16px = 2rem */
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
  height: 3.5rem; /* 56rpx = 28px = 3.5rem */
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
  bottom: 5rem; /* 80rpx = 40px = 5rem */
  left: 50%;
  transform: translateX(-50%);
  padding: 1.25rem 3.75rem; /* 20rpx 60rpx = 10px 30px */
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: 0.125rem solid rgba(255, 255, 255, 0.3); /* 2rpx = 1px = 0.125rem */
  border-radius: 3.125rem; /* 50rpx = 25px = 3.125rem */
  font-size: 1.75rem; /* 28rpx = 14px = 1.75rem */
  font-weight: 500;
  z-index: 301;
}
</style>