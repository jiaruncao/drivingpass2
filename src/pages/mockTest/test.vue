<template>
  <view>
    <view class="container">
      <!-- 顶部栏 -->
      <view class="top-bar">
        <text class="question-counter">Question {{ currentQuestion }} of {{questionsData.length}}</text>
        <text :class="['time-remaining', timeRemaining <= 300 ? 'warning' : '']">
          Time: {{ formattedTime }}
        </text>
      </view>
    
      <!-- 主要内容区域 -->
      <view :class="['main-content', !currentQuestionData.title_video_url ? 'no-image' : '']">
        <!-- 左侧问题区域 -->
        <view class="question-section">
          <view class="question-header">
            <text class="question-text">{{ currentQuestionData.title }}</text>
            <view class="mark-instruction">Mark one answer</view>
          </view>
    
          <view class="answer-options">
            <view 
              v-for="(option, index) in currentQuestionData.options_json" 
              :key="index"
              :class="['answer-option', currentQuestionData.selectedOption === option.key ? 'selected' : '']"
              @click="selectAnswer(option.key, index)"
            >
              <view class="answer-checkbox"></view>
              <text class="answer-text">{{ option.value }}</text>
            </view>
          </view>
        </view>
    
        <!-- 右侧图片区域 -->
        <view v-if="currentQuestionData.title_video_url" class="image-section">
          <image 
            :src="currentQuestionData.title_video_url" 
            class="question-image"
            mode="aspectFit"
          />
        </view>
      </view>
    
      <!-- 底部控制栏 -->
      <view class="bottom-controls">
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
      </view>
    
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
    <u-modal :width="modalWidth" :show="modalShow" :title="modalTitle" :showCancelButton="showCancel" :content='modalContent' :cancelText="cancelText" :confirmText="confirmText" @cancel="cancel" @confirm="confirm" ></u-modal>
  </view>
  
</template>

<script>
import {getExamQuestion, submitExamQuestion} from '@/http/api/testQuestions.js'
export default {
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
      modalWidth: '400px',
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      showCancel: true,
      resizeListener: null,

      // 视频题倒计时
      videoTime: 3 * 60,
      videoTimer: null
    }
  },
  
  computed: {
    // 格式化的时间显示
    formattedTime() {
      const minutes = Math.floor(this.timeRemaining / 60)
      const seconds = this.timeRemaining % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
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
    }
  },
  
  mounted() {
    this.getExamQuestion()
    // 启动倒计时
    this.startTimer()
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
      getExamQuestion().then(res => {
        console.log(res)
        if (res.code == 1) {
          // this.paperInfo = res.data.paper
          this.paper_id = res.data.paper.paper_id
          // this.timeRemaining = res.data.paper.limit_time * 60
          this.timeRemaining = 57 * 60
          this.questionsData = res.data.questions.filter(item => item.kind == 'SINGLE') // 单选题
          this.videoData = res.data.questions.filter(item => item.kind == 'VIDEO') // 视频题
          
          uni.setStorageSync('videoMockTest', {
            paper_id: this.paper_id,
            videoData: this.videoData
          })
          
          // 初始化题目状态
          this.initQuestionStates()
        }
      })
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
    
    // 启动倒计时
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--
        } else {
          uni.setStorageSync('mockTestResult', {
            paper_id: this.paper_id,
            questions: this.questionStates.map(q => ({
              id: q.id,
              answer: q.selectedOption
            }))
          })
          this.endTestAfter()
          clearInterval(this.timer)
        }
      }, 1000)
    },
    
    // 选择答案
    selectAnswer(key, index) {
      this.questionStates[this.currentQuestion - 1].answered = true
      this.questionStates[this.currentQuestion - 1].selectedOption = key
    },
    
    // 切换标记状态
    toggleFlag() {
      const current = this.questionStates[this.currentQuestion - 1]
      current.flagged = !current.flagged
    },
    
    // 下一题
    nextQuestion() {
      console.log(this.questionStates)
      if (this.currentQuestion < this.questionsData.length) {
        this.goToQuestion(this.currentQuestion + 1)
      } else {
        uni.showToast({
          title: 'This is the last question. Click Review to check your answers.',
          icon: 'none',
          duration: 2000
        })
      }
    },
    
    // 上一题
    previousQuestion() {
      if (this.currentQuestion > 1) {
        this.goToQuestion(this.currentQuestion - 1)
      } else {
        uni.showToast({
          title: 'This is the first question.',
          icon: 'none',
          duration: 2000
        })
      }
    },
    
    // 播放音频
    playAudio() {
      uni.showToast({
        title: 'No audio available for this question',
        icon: 'none',
        duration: 2000
      })
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
    },
    
    // 从Review面板跳转到题目
    goToQuestionFromReview(questionNumber) {
      this.goToQuestion(questionNumber)
      this.closeReview()
    },
    confirm () {
      this.modalShow = false
      if (this.modalType === 'EndTest') {
        // uni.showToast({
        //   title: 'Test ended. Calculating results...',
        //   icon: 'none',
        //   duration: 2000
        // })
        this.closeReview()
        // 这里可以添加跳转到结果页面的逻辑
        // submitExamQuestion({
        //   paper_id: this.paper_id,
        //   questions: this.questionStates.map(q => ({
        //     id: q.id,
        //     answer: q.selectedOption
        //   }))
        // }).then(res => {
        //   console.log(res)
        // })
        // 缓存答题情况，跳转视频题
        
        uni.setStorageSync('mockTestResult', {
          paper_id: this.paper_id,
          questions: this.questionStates.map(q => ({
            id: q.id,
            answer: q.selectedOption
          }))
        })
        
        this.endTestAfter()
      } else if (this.modalType === 'Finished') {
        this.goToVideo()
        clearInterval(this.timer)
        clearInterval(this.videoTimer)
      }
    },
    cancel () {
      this.modalShow = false
    },
    // 结束考试
    endTest() {
      const unanswered = this.questionStates.filter(q => !q.answered).length
      this.reviewVisible = false
      this.modalShow = true
      this.showCancel = true
      this.modalTitle =  'End Test'
      this.modalType = 'EndTest'
      this.modalContent = `Are you sure you want to end the test? You have ${unanswered} unanswered questions.`

    },
    endTestAfter () {
      this.reviewVisible = false
      this.modalShow = true
      this.showCancel = false
      this.modalTitle =  'Finished Multiple-Choice'
      this.modalType = 'Finished'
      this.modalContent = `You have finished answering multiple-choice questions and have 3 minutes to rest. You can also choose to skip and continue answering dangerous driving questions. Do you want to skip?`
      this.startVideoTimer()

    },
    startVideoTimer() {
      this.videoTimer = setInterval(() => {
        if (this.videoTime > 0) {
          this.videoTime--
          const minutes = Math.floor(this.videoTime / 60)
          const seconds = this.videoTime % 60
          const videoTimeValue = `${minutes}:${seconds.toString().padStart(2, '0')}`
          this.modalContent = `You have finished answering multiple-choice questions and have ${videoTimeValue} minutes to rest. You can also choose to skip and continue answering dangerous driving questions. Do you want to skip?`
        } else {
          this.goToVideo()
          clearInterval(this.videoTimer)
        }
      }, 1000)
    },
    // 跳转视频题
    goToVideo () {
      this.modelShow = false
      uni.redirectTo({
        url: '/pages/mockTest/testVideo'
      })
    },
    updateModalWidth(windowWidth) {
      let width = windowWidth
      if (!width) {
        try {
          const systemInfo = uni.getSystemInfoSync()
          width = systemInfo.windowWidth
        } catch (error) {
          width = 0
        }
      }

      if (!width || typeof width !== 'number') {
        this.modalWidth = '400px'
        return
      }

      const maxWidth = 700
      const minWidth = 320
      const computedWidth = Math.max(Math.min(width * 0.7, maxWidth), minWidth)
      this.modalWidth = `${computedWidth}px`
    }
  },
  onLoad (option) {
    // this.paper_id = option.paper_id
    this.updateModalWidth()
  },
  onReady() {
    if (typeof uni.onWindowResize === 'function') {
      this.resizeListener = (res) => {
        const newWidth = res && res.size ? res.size.windowWidth : undefined
        this.updateModalWidth(newWidth)
      }
      uni.onWindowResize(this.resizeListener)
    }
  },
  onUnload() {
    if (this.resizeListener && typeof uni.offWindowResize === 'function') {
      uni.offWindowResize(this.resizeListener)
    }
    this.resizeListener = null
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
  flex-direction: row;
  padding: 0.625rem 0.9375rem; /* 10px 15px → 0.625rem 0.9375rem */
  background: #FFFFFF;
  min-height: 0;
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
  padding: 0.75rem 1.25rem; /* 12px 20px → 0.75rem 1.25rem */
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
  min-height: 3rem; /* 48px → 3rem */
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
  
  .main-content {
    padding: 0.5rem 0.75rem 0 0.75rem; /* 8px 12px → 0.5rem 0.75rem */
  }
  
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
    min-height: 2.75rem; /* 44px → 2.75rem */
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
</style>