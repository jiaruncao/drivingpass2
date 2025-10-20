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
    <u-modal width="400px" :show="modalShow" :title="modalTitle" :showCancelButton="showCancel" :content='modalContent' :cancelText="cancelText" :confirmText="confirmText" @cancel="cancel" @confirm="confirm"></u-modal>
    
    <view v-if="showPopup" class="result-modal">
      <view class="result-backdrop" @tap="closeResultPopup"></view>
      <view class="result-content" @tap.stop>
        <view class="result-close" @tap="closeResultPopup">×</view>
        <view class="result-header">
          <view class="result-title">Mock Test Summary</view>
          <view class="result-subtitle">{{ resultSummary.message }}</view>
        </view>

        <view class="score-grid">
          <view class="score-card">
            <view class="score-card-header">
              <text class="score-card-label">Multiple Choice</text>
              <text :class="['score-card-status', resultSummary.multipleChoice.pass ? 'pass' : 'review']">
                {{ resultSummary.multipleChoice.pass ? 'Pass' : 'Review' }}
              </text>
            </view>
            <view class="score-card-value">
              <text class="score-number">{{ formatScore(resultSummary.multipleChoice.score) }}</text>
              <text class="score-total">/ {{ resultSummary.multipleChoice.total }}</text>
            </view>
            <view class="score-progress">
              <view class="score-progress-fill" :style="{ width: multipleChoiceProgress + '%' }"></view>
            </view>
            <text class="score-card-hint">{{ resultSummary.multipleChoice.feedback }}</text>
          </view>

          <view class="score-card hazard">
            <view class="score-card-header">
              <text class="score-card-label">Hazard Perception</text>
              <text :class="['score-card-status', resultSummary.hazardPerception.pass ? 'pass' : 'review']">
                {{ resultSummary.hazardPerception.pass ? 'Pass' : 'Review' }}
              </text>
            </view>
            <view class="score-card-value">
              <text class="score-number">{{ formatScore(resultSummary.hazardPerception.score) }}</text>
              <text class="score-total">/ {{ resultSummary.hazardPerception.total }}</text>
            </view>
            <view class="score-progress">
              <view class="score-progress-fill hazard" :style="{ width: hazardPerceptionProgress + '%' }"></view>
            </view>
            <text class="score-card-hint">{{ resultSummary.hazardPerception.feedback }}</text>
          </view>
        </view>

        <view class="overall-status" :class="resultSummary.pass ? 'overall-pass' : 'overall-review'">
          <view class="overall-status-label">{{ resultSummary.pass ? 'Pass' : 'Keep practising' }}</view>
          <view class="overall-status-desc">{{ resultSummary.passMessage }}</view>
        </view>

        <view v-if="hasWrongQuestions" class="wrong-review">
          <view class="wrong-review-header" @tap="toggleWrongReview">
            <view>
              <text class="wrong-review-title">Review incorrect questions</text>
              <text class="wrong-review-subtitle">{{ totalWrongCount }} question{{ totalWrongCount === 1 ? '' : 's' }} to revisit</text>
            </view>
            <view class="wrong-review-toggle">
              <text>{{ wrongReviewExpanded ? 'Hide' : 'View' }}</text>
              <view :class="['chevron', wrongReviewExpanded ? 'expanded' : '']"></view>
            </view>
          </view>

          <view v-if="wrongReviewExpanded" class="wrong-review-body">
            <view class="wrong-tabs">
              <view
                :class="['wrong-tab', activeWrongTab === 'multiple' ? 'active' : '', !wrongQuestions.multiple.length ? 'disabled' : '']"
                @tap.stop="switchWrongTab('multiple')"
              >
                Multiple Choice ({{ wrongQuestions.multiple.length }})
              </view>
              <view
                :class="['wrong-tab', activeWrongTab === 'hazard' ? 'active' : '', !wrongQuestions.hazard.length ? 'disabled' : '']"
                @tap.stop="switchWrongTab('hazard')"
              >
                Hazard Perception ({{ wrongQuestions.hazard.length }})
              </view>
            </view>

            <scroll-view class="wrong-list" scroll-y>
              <view v-if="!currentWrongList.length" class="wrong-empty">
                <text>No mistakes in this section 🎉</text>
              </view>
              <view
                v-for="(item, index) in currentWrongList"
                :key="item.id || item.question_id || index"
                class="wrong-item"
              >
                <view class="wrong-item-header">
                  <text class="wrong-item-index">{{ index + 1 }}.</text>
                  <text class="wrong-item-title">{{ resolveQuestionTitle(item) }}</text>
                </view>
                <view v-if="item.user_answer" class="wrong-item-meta">
                  <text class="wrong-item-label">Your answer</text>
                  <text class="wrong-item-value">{{ formatAnswer(item.user_answer) }}</text>
                </view>
                <view v-if="item.correct_answer" class="wrong-item-meta">
                  <text class="wrong-item-label">Correct</text>
                  <text class="wrong-item-value">{{ formatAnswer(item.correct_answer) }}</text>
                </view>
                <view v-if="item.explanation" class="wrong-item-meta">
                  <text class="wrong-item-label">Explanation</text>
                  <text class="wrong-item-value">{{ item.explanation }}</text>
                </view>
                <view class="wrong-item-actions">
                  <view class="link-button" @tap="openQuestionDetail(item)">View details</view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>

        <view class="result-actions">
          <button class="result-button ghost" @tap="doExit">Back to Mock Home</button>
          <button class="result-button primary" @tap="toRecords">Your Records</button>
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
      recentClicks: [], // 最近的点击时间记录
      scoreDisqualified: false ,// 分数是否被取消
      showPopup: false,
      score: 0,
      resultSummary: {
        pass: false,
        message: 'Here is your performance breakdown.',
        passMessage: '',
        multipleChoice: {
          score: 0,
          total: 50,
          pass: false,
          feedback: 'Aim for at least 43/50 to pass the DVSA mark.'
        },
        hazardPerception: {
          score: 0,
          total: 75,
          pass: false,
          feedback: 'Aim for at least 44/75 to pass the DVSA mark.'
        }
      },
      wrongQuestions: {
        multiple: [],
        hazard: []
      },
      wrongReviewExpanded: false,
      activeWrongTab: 'multiple'
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

    multipleChoiceProgress() {
      const total = this.resultSummary.multipleChoice.total || 1
      const score = this.resultSummary.multipleChoice.score || 0
      return Math.max(0, Math.min(100, Math.round((score / total) * 100)))
    },

    hazardPerceptionProgress() {
      const total = this.resultSummary.hazardPerception.total || 1
      const score = this.resultSummary.hazardPerception.score || 0
      return Math.max(0, Math.min(100, Math.round((score / total) * 100)))
    },

    hasWrongQuestions() {
      return (this.wrongQuestions.multiple && this.wrongQuestions.multiple.length > 0) ||
        (this.wrongQuestions.hazard && this.wrongQuestions.hazard.length > 0)
    },

    currentWrongList() {
      if (this.activeWrongTab === 'hazard') {
        return this.wrongQuestions.hazard || []
      }
      return this.wrongQuestions.multiple || []
    },

    totalWrongCount() {
      const multiple = this.wrongQuestions.multiple ? this.wrongQuestions.multiple.length : 0
      const hazard = this.wrongQuestions.hazard ? this.wrongQuestions.hazard.length : 0
      return multiple + hazard
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
      const videoMockTest = uni.getStorageSync('videoMockTest')
      // {
      //   paper_id: this.paper_id,
      //   videoData: this.videoData
      // }
      this.paper_id = videoMockTest.paper_id
      // 点击置空
      videoMockTest.videoData.forEach(item => {
        item['userMarks'] = []
      })
      
      this.questionsData = videoMockTest.videoData
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
        this.submitScore()
      } else if (this.modalType === 'Finished') {
        // clearInterval(this.playInterval)
        this.submitScore()
      }
    },
    cancel () {
      this.modalShow = false
    },
    // 提交成绩
    submitScore () {
      // 先缓存答案
      this.cacheCurrentVideoScore()
      // 这里获取单选成绩
      const mockTestResult = uni.getStorageSync('mockTestResult')

      const questions = mockTestResult.questions

      console.log('this.userMarks', this.userMarks)

      // 提交
      submitExamQuestion({
        paper_id: this.paper_id,
        questions: questions
      }).then(res => {
        console.log(res)
        const payload = this.unwrapSubmitResponse(res)
        if (!payload) {
          return
        }

        const parsed = this.buildResultSummary(payload)
        this.resultSummary = parsed.summary
        this.wrongQuestions = parsed.wrongQuestions
        this.score = parsed.summary.totalScore
        this.activeWrongTab = parsed.activeTab
        this.wrongReviewExpanded = parsed.autoExpandWrongReview
        this.showPopup = true
        this.persistWrongQuestions(parsed.wrongQuestions)
      })
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
    },
    doExit () {
      uni.redirectTo({
        url: '/pages/mockTest/mockTest'
      })
    },
    toRecords () {
      uni.redirectTo({
        url: '/pages/mockTest/record'
      })
    },
    closeResultPopup () {
      this.showPopup = false
    },
    toggleWrongReview () {
      this.wrongReviewExpanded = !this.wrongReviewExpanded
    },
    switchWrongTab (tab) {
      if (tab === this.activeWrongTab) {
        return
      }
      if (tab === 'multiple' && (!this.wrongQuestions.multiple || !this.wrongQuestions.multiple.length)) {
        return
      }
      if (tab === 'hazard' && (!this.wrongQuestions.hazard || !this.wrongQuestions.hazard.length)) {
        return
      }
      this.activeWrongTab = tab
    },
    resolveQuestionTitle (item = {}) {
      return item.title || item.question || item.content || item.stem || 'Untitled question'
    },
    formatAnswer (answer) {
      if (Array.isArray(answer)) {
        return answer.join(', ')
      }
      if (typeof answer === 'number') {
        return answer.toString()
      }
      if (!answer) {
        return '—'
      }
      return String(answer)
    },
    openQuestionDetail (item = {}) {
      const questionId = item.question_id || item.id
      if (!questionId) {
        uni.showToast({
          title: 'Missing question ID',
          icon: 'none'
        })
        return
      }
      this.closeResultPopup()
      uni.navigateTo({
        url: `/pages/learnQuestion/detail?question_id=${questionId}&mode=wrong`
      })
    },
    formatScore (score) {
      if (score === null || score === undefined || score === '') {
        return '0'
      }
      const value = Number(score)
      if (Number.isNaN(value)) {
        return '0'
      }
      return value % 1 === 0 ? value.toString() : value.toFixed(1)
    },
    unwrapSubmitResponse (response) {
      if (!response || typeof response !== 'object') {
        uni.showToast({
          title: 'Unable to parse result',
          icon: 'none'
        })
        return null
      }

      if (Object.prototype.hasOwnProperty.call(response, 'code')) {
        if (response.code !== 1) {
          uni.showToast({
            title: response.msg || 'Failed to submit mock test',
            icon: 'none'
          })
          return null
        }
        return response.data || {}
      }

      return response
    },
    buildResultSummary (payload = {}) {
      const multiplePassMark = this.ensureNumber(
        payload.multiple_choice_pass_mark ?? payload.multiple_choice?.pass_mark ?? payload.multiplePassMark,
        43
      )
      const hazardPassMark = this.ensureNumber(
        payload.hazard_perception_pass_mark ?? payload.hazard_perception?.pass_mark ?? payload.hazardPassMark,
        44
      )

      const multipleScore = this.ensureNumber(
        payload.multiple_choice_score ?? payload.multipleScore ?? payload.multiple_choice?.score ?? payload.mc_score
      )
      const multipleTotal = this.ensureNumber(
        payload.multiple_choice_total ?? payload.multiple_choice?.total ?? payload.multipleTotal,
        50
      ) || 50
      const hazardScore = this.ensureNumber(
        payload.hazard_perception_score ?? payload.hazardScore ?? payload.hazard_perception?.score ?? payload.hp_score ?? payload.hazard_score
      )
      const hazardTotal = this.ensureNumber(
        payload.hazard_perception_total ?? payload.hazard_perception?.total ?? payload.hazardTotal,
        75
      ) || 75

      const multiplePass = multipleScore >= multiplePassMark
      const hazardPass = hazardScore >= hazardPassMark
      const passStatus = payload.pass ?? payload.passed ?? payload.pass_status === 'pass' || (multiplePass && hazardPass)

      const multipleGap = Math.max(0, multiplePassMark - multipleScore)
      const hazardGap = Math.max(0, hazardPassMark - hazardScore)

      const multipleFeedback = multiplePass
        ? `Great job! You reached the pass mark (${multiplePassMark}).`
        : `Need ${multipleGap} more point${multipleGap === 1 ? '' : 's'} to hit ${multiplePassMark}.`

      const hazardFeedback = hazardPass
        ? `Strong spotting! You reached the pass mark (${hazardPassMark}).`
        : `Need ${hazardGap} more point${hazardGap === 1 ? '' : 's'} to hit ${hazardPassMark}.`

      const summary = {
        totalScore: this.ensureNumber(payload.total_score ?? payload.score, multipleScore + hazardScore),
        pass: Boolean(passStatus),
        message: payload.message || payload.summary || 'Here is your performance breakdown.',
        passMessage: payload.pass_message || payload.advice || (passStatus
          ? 'Excellent effort—keep maintaining this standard.'
          : 'Review the highlighted questions to boost your score next time.'),
        multipleChoice: {
          score: multipleScore,
          total: multipleTotal,
          pass: multiplePass,
          feedback: multipleFeedback
        },
        hazardPerception: {
          score: hazardScore,
          total: hazardTotal,
          pass: hazardPass,
          feedback: hazardFeedback
        }
      }

      const wrongQuestions = {
        multiple: this.normaliseWrongQuestionList(
          payload.multiple_wrong_questions ?? payload.multipleWrongQuestions ?? payload.wrong_multiple ?? payload.multiple_wrong
        ),
        hazard: this.normaliseWrongQuestionList(
          payload.hazard_wrong_questions ?? payload.hazardWrongQuestions ?? payload.wrong_hazard ?? payload.hazard_wrong
        )
      }

      const hasMultipleWrong = wrongQuestions.multiple.length > 0
      const hasHazardWrong = wrongQuestions.hazard.length > 0

      return {
        summary,
        wrongQuestions,
        activeTab: hasMultipleWrong ? 'multiple' : 'hazard',
        autoExpandWrongReview: hasMultipleWrong || hasHazardWrong
      }
    },
    ensureNumber (value, fallback = 0) {
      const numberValue = Number(value)
      return Number.isFinite(numberValue) ? numberValue : fallback
    },
    normaliseWrongQuestionList (list) {
      if (!Array.isArray(list)) {
        return []
      }
      return list.map(item => {
        const normalised = { ...item }
        if (normalised.user_answer === undefined) {
          normalised.user_answer = normalised.answer ?? normalised.userAnswer ?? ''
        }
        if (normalised.correct_answer === undefined) {
          normalised.correct_answer = normalised.correct ?? normalised.correctAnswer ?? normalised.right_answer ?? ''
        }
        return normalised
      })
    },
    persistWrongQuestions (wrongQuestions) {
      try {
        uni.setStorageSync('mockTestWrongQuestions', wrongQuestions)
      } catch (error) {
        console.error('Failed to persist wrong questions', error)
      }
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

.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.result-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
}

.result-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 92%;
  max-width: 640px;
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 1.5rem 3rem rgba(15, 23, 42, 0.18);
}

.result-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  box-shadow: 0 0.5rem 1.5rem rgba(148, 163, 184, 0.35);
}

.result-close:active {
  background: #e5e7eb;
}

.result-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.result-title {
  font-size: 1.45rem;
  font-weight: 700;
  color: #0f172a;
}

.result-subtitle {
  margin-top: 0.35rem;
  font-size: 0.95rem;
  color: #64748b;
}

.score-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

@media screen and (min-width: 45rem) {
  .score-grid {
    flex-direction: row;
  }
}

.score-card {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  border-radius: 1.25rem;
  padding: 1.2rem;
  box-shadow: 0 0.75rem 1.75rem rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.score-card.hazard {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.score-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.score-card-label {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2933;
}

.score-card-status {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-card-status.pass {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.score-card-status.review {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
}

.score-card-value {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  color: #0f172a;
}

.score-number {
  font-size: 2.25rem;
  font-weight: 700;
}

.score-total {
  font-size: 1rem;
  color: #475569;
}

.score-progress {
  width: 100%;
  height: 0.55rem;
  background: rgba(226, 232, 240, 0.85);
  border-radius: 999px;
  overflow: hidden;
  margin: 0.75rem 0;
}

.score-progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.score-progress-fill.hazard {
  background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%);
}

.score-card-hint {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.4;
}

.overall-status {
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  text-align: center;
  margin-bottom: 1rem;
}

.overall-pass {
  background: #ecfdf5;
  color: #047857;
}

.overall-review {
  background: #fef2f2;
  color: #b91c1c;
}

.overall-status-label {
  font-size: 1.1rem;
  font-weight: 700;
}

.overall-status-desc {
  margin-top: 0.25rem;
  font-size: 0.92rem;
  color: #0f172a;
}

.wrong-review {
  margin-top: 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  background: #f8fafc;
}

.wrong-review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
}

.wrong-review-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.wrong-review-subtitle {
  display: block;
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.wrong-review-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2563eb;
}

.chevron {
  width: 0.6rem;
  height: 0.6rem;
  border-right: 0.125rem solid currentColor;
  border-bottom: 0.125rem solid currentColor;
  transform: rotate(-45deg);
  transition: transform 0.2s ease;
}

.chevron.expanded {
  transform: rotate(135deg);
}

.wrong-review-body {
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
}

.wrong-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.wrong-tab {
  flex: 1;
  text-align: center;
  padding: 0.75rem 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  position: relative;
}

.wrong-tab.disabled {
  opacity: 0.4;
}

.wrong-tab.active {
  color: #1d4ed8;
}

.wrong-tab.active::after {
  content: '';
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: 0.1rem;
  height: 0.1875rem;
  border-radius: 999px;
  background: #1d4ed8;
}

.wrong-list {
  max-height: 14rem;
  padding: 0.75rem 1.1rem;
}

@media screen and (min-width: 48rem) {
  .wrong-list {
    max-height: 18rem;
  }
}

.wrong-item {
  border: 1px solid #e2e8f0;
  border-radius: 0.9rem;
  padding: 0.75rem 0.85rem;
  margin-bottom: 0.75rem;
  background: #f9fafb;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.08);
}

.wrong-item:last-child {
  margin-bottom: 0;
}

.wrong-item-header {
  display: flex;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.45rem;
}

.wrong-item-index {
  color: #6366f1;
}

.wrong-item-title {
  flex: 1;
  line-height: 1.45;
}

.wrong-item-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.wrong-item-label {
  font-weight: 600;
  color: #1f2937;
}

.wrong-item-value {
  flex: 1;
  color: #334155;
}

.wrong-item-actions {
  margin-top: 0.6rem;
  display: flex;
  justify-content: flex-end;
}

.link-button {
  color: #2563eb;
  font-weight: 600;
  font-size: 0.85rem;
}

.link-button:active {
  opacity: 0.7;
}

.wrong-empty {
  padding: 1.5rem 1rem;
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
}

.result-actions {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media screen and (min-width: 40rem) {
  .result-actions {
    flex-direction: row;
  }
}

.result-button {
  flex: 1;
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.result-button.ghost {
  background: #f8fafc;
  color: #1f2937;
  border: 1px solid #e2e8f0;
}

.result-button.ghost:active {
  background: #e2e8f0;
}

.result-button.primary {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  box-shadow: 0 1rem 1.8rem rgba(79, 70, 229, 0.25);
}

.result-button.primary:active {
  transform: translateY(1px);
}
</style>
