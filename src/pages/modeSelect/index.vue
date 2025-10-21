<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <text class="page-title">{{camelCaseToSpacesAdvanced(currentViewTitle)}}</text>
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
            <text class="progress-value">{{ testsPracticed }}</text>
          </view>
        </view>
      </view>

      <!-- 测试模式视图 -->
      <view v-if="currentView === 'test'" class="options-container">
        <view class="options-card" v-if="currentViewTitle != 'HazardTest'">
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
        
        <view class="options-card" v-if="currentViewTitle == 'HazardTest'">
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
          <view class="action-button" @tap="startTrain">Start Exam</view>
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
            <view>Total: {{ category.total }}</view>
            <view style="margin-left: 20rpx;">Wrong: {{ category.wrong }}</view>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{width: category.progress + '%'}"></view>
          </view>
        </view>

        <view class="button-container">
          <view class="action-button" @tap="startTrain">Start Learning</view>
        </view>
      </view>
      
      <view v-if="currentView === 'road-signs'" class="road-signs-container">
        <!-- 搜索栏 -->
        <view class="search-container">
          <input type="text" class="search-input" placeholder="Search by keywords" v-model="searchKeyword" />
          <view class="search-button" @tap="searchSigns">Search</view>
        </view>
      
        <!-- 道路标志分类列表 -->
        <view v-for="category in filteredCategories" :key="category.id" class="category-section">
          <view class="category-header" @tap="enterCategoryDetail(category)">
            <text class="category-title">{{ category.name }}</text>
            <view class="category-meta">
              <text class="category-count">{{ category.question.length }} signs</text>
              <text class="next-arrow" style="margin-left: 10rpx;">›</text>
            </view>
          </view>
      
          <!-- 道路标志网格 -->
          <view class="signs-grid">
            <view v-for="(sign, idx) in category.question" :key="idx" class="sign-item" @tap="selectDetailSign(sign)">
              <!-- <view class="sign-icon" :class="sign.iconClass">{{ sign.symbol }}</view> -->
              <image :src="sign.title_video_url" class="sign-icon" mode="scaleToFill"></image>
            </view>
          </view>
      
          <!-- 进度条 -->
          <view class="category-progress" @tap="enterCategoryDetail(category)">
            <view class="progress-bar">
              <view class="progress-fill" :style="{width: category.progress + '%'}"></view>
            </view>
            <text class="progress-percentage">{{ category.progress }}%</text>
          </view>
        </view>
      </view>
      
      <!-- 分类详情页面视图 -->
      <view v-if="currentView === 'category-detail' && selectedSignCategory" class="category-detail-container">
        <!-- 分类完成度 -->
        <view class="category-detail-header">
          <view class="category-completion">Completed: {{ selectedSignCategory.progress }}%</view>
        </view>
      
        <!-- 道路标志详情网格 - 2列布局 -->
        <view class="detail-signs-grid">
          <view v-for="sign in selectedSignCategory.signs" :key="sign.id" class="detail-sign-item" @tap="selectDetailSign(sign)">
            <view class="detail-sign-icon" :class="sign.iconClass">
              <image :src="sign.title_video_url" mode="scaleToFill"></image>
            </view>
            <text class="detail-sign-name">{{ sign.title }}</text>
          </view>
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
    
    <!-- 升级弹框 -->
    <u-modal title="Feature Locked" :show="showFeature" :showCancelButton="true" cancelText="Cancel" confirmText="Upgrade" :content='content' @confirm="confirmFeature" @cancel="cancelFeature"></u-modal>
  </view>
</template>

<script>
import {
  getTypeFind
} from '@/http/api/index.js'
import {getThree, startTrain, getTestRecordCount} from '@/http/api/testQuestions.js'
import {queryMemberInfo} from '@/http/api/login.js'
export default {
  data() {
    return {
      subject_id: null,
      currentViewTitle: '',
      currentView: 'home', // 当前视图状态
      overallProgress: 0, // 整体学习进度
      testsPracticed: 0, // 测试练习次数
      showQuantityPicker: false, // 是否显示数量选择器
      tempVideoCount: 10,
      tempQuestionCount: 50, // 临时题目数量
      selectedCategory: null, // 选中的学习分类
      testOptions: {
        questionCount: 50, // 测试题目数量
        testAll: true, // 是否测试所有题目
        skipCorrect: false ,// 是否跳过已答对的题目
        videoCount: 10, // 测试视频数量
        videoSelection: 'all' // 视频选择类型：all, not_full_score, unpracticed
      },
      searchKeyword: '',
      categories: [],
      // 道路标志分类数据
      roadSignCategories: [],
      // selectedCategoryId: null, // 选中的分类ID
      selectedCategoryName: '',
      selectedSignCategory: {
        signs: [],
        progress: 0
      },
      showFeature: false,
      content: ''
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
    },
    // 过滤后的分类列表（用于搜索功能）
    filteredCategories() {
      if (!this.searchKeyword.trim()) {
        return this.roadSignCategories;
      }

      return this.roadSignCategories.map(category => {

        const filteredSigns = category.question.filter(sign =>
          sign.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );

        return {
          ...category,
          question: filteredSigns
        };
      }).filter(category => category.question.length > 0);
    },
  },
  methods: {
    camelCaseToSpacesAdvanced(str) {
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
            .trim();
    },
    // 选择学习或测试模式
    selectMode(mode) {
      if (mode === 'learn' && this.currentViewTitle == 'RodeSign') {
        this.currentView = 'road-signs'; // Learn模式直接进入Road Signs页面
      } else {
        this.currentView = mode;
      }
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
      } else if (this.currentView === 'category-detail') {
        this.currentView = 'road-signs'; // 从分类详情返回道路标志列表
        this.selectedCategory = null;
      } else if (this.currentView === 'road-signs') {
        this.currentView = 'home'; // 从Road Signs页面返回首页
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
      if (this.currentViewTitle == 'HazardTest') {
        this.tempVideoCount = e.detail.value;
      } else {
        this.tempQuestionCount = e.detail.value;
      }
    },
    // 确认题目数量选择
    confirmQuantity() {
      if (this.currentViewTitle == 'HazardTest') {
        this.testOptions.videoCount = this.tempVideoCount;
      } else {
        this.testOptions.questionCount = this.tempQuestionCount;
      }
      
      this.showQuantityPicker = false;
    },
    // 选择视频类型
    selectVideoType(type) {
      this.testOptions.videoSelection = type;
    },
    // 关闭模态框
    closeModal() {
      this.showQuantityPicker = false;
    },
    // 进入分类详情页面
    enterCategoryDetail(category) {
      console.log('Entering category detail for:', category.name);
      this.selectedCategory = category.id;
      this.selectedCategoryName = category.name;
      this.currentView = 'category-detail';
      this.selectedSignCategory.progress = category.progress
      this.startTrain()
    },
    // 开始测试
    startTest() {
      console.log('Starting test with options:', this.testOptions);
      // 这里可以调用API开始测试
      // uni.showToast({
      //   title: '开始测试',
      //   icon: 'success'
      // });
      switch (this.currentViewTitle) {
        case 'TheoryTest':
          // 跳转答题
          uni.navigateTo({
            url: '/pages/learnQuestion/index?subject_id=' + this.subject_id + '&mode=test'
          })
          break;
        case 'HighwayCode':
          // 跳转答题
          uni.navigateTo({
            url: '/pages/learnQuestion/index?subject_id=' + this.subject_id + '&mode=test'
          })
          break;
        case 'RodeSign':
          // 跳转答题
          uni.navigateTo({
            url: '/pages/learnQuestion/index?subject_id=' + this.subject_id + '&mode=test'
          })
          break;
        case 'HazardTest':
          // 跳转答题
          uni.navigateTo({
            url: '/pages/hazardPerception/testList?subject_id=' + this.subject_id + '&mode=test'
          })
          break;
      }
    },
    // 开始学习
    startLearning() {
      const category = this.categories.find(c => c.id === this.selectedCategory);
      console.log('Starting learning for category:', category);
      
      // 如果没题目，提示没题目
      if (category.question && !category.question.length) {
        uni.showToast({
          title: 'has no data',
          icon: 'none'
        });
        return
      }
      // 区别什么类型的科目
      switch (this.currentViewTitle){
        case 'TheoryTest':
          // 跳转答题
          uni.navigateTo({
            url: '/pages/learnQuestion/index?cate_id=' + this.selectedCategory + '&subject_id=' + this.subject_id + '&mode=learn'
          })
          break;
        case 'HazardTest':
          // 跳转答题
          uni.navigateTo({
            url: `/pages/hazardPerception/list?cate_id=${this.selectedCategory}&subject_id=${this.subject_id}&title=${encodeURIComponent(category.name)}&mode=learn`
          })
          break;
        case 'HighwayCode':
          // 跳转答题
          uni.navigateTo({
            url: '/pages/highwayCode/highwayCode?cate_id=' + this.selectedCategory + '&subject_id=' + this.subject_id + '&mode=learn'
          })
          break;
        case 'RodeSign':
          // 跳转答题
          uni.navigateTo({
            url: `/pages/roadSign/roadSign?id=${this.subject_id}`
          })
          break;
        default:
          break;
      }
      
    },
    // 获取分类数据
    async fetchCategories() {
      
      const subjects = uni.getStorageSync('subjects')
      let categories = subjects.filter(item => item.id == this.subject_id)[0].cate
      // 处理总数
      categories.forEach(item => {
        item.total = item.question ? item.question.length : 0
        item.wrong = item.wrongQuestions ? item.wrongQuestions.length : 0
        item.progress = item.answerQuestions ? (item.answerQuestions.length / item.total * 100).toFixed(2) : 0
      })

      if (this.currentViewTitle == 'RodeSign') {
        this.roadSignCategories = categories
      } else {
        this.categories = categories
        this.selectedCategory = this.categories[0].id
      }
    },
    // 获取题目
    async startTrain () {
      
      // 如果是test模式，查询是否还有test次数
      if (this.currentView == 'test') {
        const testCountRes = await getTestRecordCount({
          subject_id: this.subject_id
        })
        if (testCountRes.code == 1) {
          const testCount = testCountRes.data.count
          // 对比
          if (!this.contrastMebmberInfo(testCount)) {
            this.showFeature = true
            this.content = `Not enough times, Upgrade to unlock this feature`
            return false
          }
        }
      }

      let params
      if (this.currentView == 'learn' || this.currentView == 'category-detail') {
        // 学习模式
        params = this.getTrainParams()
      } else if (this.currentView == 'test') {
        // params = this.getTrainParamsOfTest()
        // 测试模式
        params = {
          subject_id: this.subject_id,
          page_count: this.tempQuestionCount,
          mode: 'test',// normal=普通模式，random=随机查询，test=练习模式
          jump: this.testOptions.skipCorrect ? 1 : 0,
          type: 'all'
        }
      }
      
      if (this.currentView == 'learn') {
        const questions = this.selectSubjects(params)
        uni.setStorageSync('questions', questions)
        this.startLearning()
      } else if (this.currentView == 'test') {
        // this.startTest()
        startTrain(params).then(res => {
          uni.setStorageSync('questions', res.data.data)
          this.startTest()
        })
      } else if (this.currentView == 'category-detail') {
        const questions = this.selectSubjects(params)
        uni.setStorageSync('questions', questions)
        this.selectedSignCategory.signs = questions
      }
      // startTrain(params).then(res => {
      //   uni.setStorageSync('questions', res.data.data)
      //   if (this.currentView == 'learn') {
      //     this.startLearning()
      //   } else if (this.currentView == 'test') {
      //     this.startTest()
      //   } else if (this.currentView == 'category-detail') {
      //     this.selectedSignCategory.signs = res.data.data
      //   }
      // })
    },
    // 搜索道路标志
    searchSigns() {
      console.log('Searching for signs with keyword:', this.searchKeyword);
      // 搜索功能已通过computed属性filteredCategories实现
    },
    // 选择特定道路标志
    selectSign(sign) {
      console.log('Selected road sign:', sign);
      // 这里可以导航到标志详情页面或开始学习
    },
    // 选择详情页面中的道路标志
    selectDetailSign(sign) {
      this.selectedCategory = sign.cate_id
      const params = this.getTrainParams()
      const questions = this.selectSubjects(params)
      uni.setStorageSync('questions', questions)
      this.selectedSignCategory.signs = questions
      console.log('Selected detail sign:', sign);
      // 这里可以导航到标志学习页面或显示标志详细信息
      uni.navigateTo({
        url: `/pages/roadSign/learn?cate_id=${sign.cate_id}&categoryProgress=${this.selectedSignCategory.progress}&subject_id=${this.subject_id}&question_id=${sign.id}`
      })
    },
    // 查询用户会员权益
    queryMemberInfo () {
      queryMemberInfo().then(res => {
        if (res.code == 1) {
          uni.setStorageSync('memberInfo', res.data)
          // this.getTrainParams()
        }
      })
    },
    // 根据会员权益，得到请求参数
    getTrainParams () {
      const memberInfo = uni.getStorageSync('memberInfo')
      // TheoryTest
      if (this.currentViewTitle == 'TheoryTest') {
        const features = memberInfo.features_list.filter(item => item.title == 'THEORY TEST')[0].features
        return {
          cate_id: this.selectedCategory,
          page_count: features['DVSA Official Questions'] == 'true' ? 0 : features['DVSA Official Questions'],
          type: features['Exclusive Questions'] ? 'all' : 'official'
        }
      } else if (this.currentViewTitle == 'HazardTest') {
        // HazardTest
        return {
          cate_id: this.selectedCategory,
          page_count: 0,
          type: 'all'
        }
      } else if (this.currentViewTitle == 'HighwayCode') {
        // HighwayCode
        const features = memberInfo.features_list.filter(item => item.title == 'STUDY MATERIALS')[0].features
        return {
          cate_id: this.selectedCategory,
          page_count: features['Highway Code - Learn Mode'] == 'true' ? 0 : features['Highway Code - Learn Mode'],
          type: 'all'
        }
      } else if (this.currentViewTitle == 'RodeSign') {
        // RodeSign
        const features = memberInfo.features_list.filter(item => item.title == 'STUDY MATERIALS')[0].features
        return {
          cate_id: this.selectedCategory,
          page_count: features['Road Signs - Learn Mode'] == 'true' ? 0 : features['Road Signs - Learn Mode'],
          type: 'all'
        }
      }
    },
    // 对比权益，判断是否有次数
    contrastMebmberInfo (testCount) {
      const memberInfo = uni.getStorageSync('memberInfo')
      if (this.currentViewTitle == 'TheoryTest') {
        const features = memberInfo.features_list.filter(item => item.title == 'THEORY TEST')[0].features
        const count = features['Test Mode']
        console.log('typeof count', typeof count == 'boolean')
        if (count == 'true') {
          return true
        } else if (count > testCount) {
          return true
        } else {
          return false
        }
      } else if (this.currentViewTitle == 'HazardTest') {
        const features = memberInfo.features_list.filter(item => item.title == 'HAZARD PERCEPTION')[0].features
        const count = features['Test Mode']
        if (count == 'true') {
          return true
        } else if (count > testCount) {
          return true
        } else {
          return false
        }
      } else if (this.currentViewTitle == 'HighwayCode') {
        const features = memberInfo.features_list.filter(item => item.title == 'STUDY MATERIALS')[0].features
        const count = features['Highway Code - Test Mode']
        if (count == 'true') {
          return true
        } else if (count > testCount) {
          return true
        } else {
          return false
        }
      } else if (this.currentViewTitle == 'RodeSign') {
        const features = memberInfo.features_list.filter(item => item.title == 'STUDY MATERIALS')[0].features
        const count = features['Road Signs - Test Mode']
        if (count == 'true') {
          return true
        } else if (count > testCount) {
          return true
        } else {
          return false
        }
      }
    },
    confirmFeature () {
      this.showFeature = false
      uni.navigateTo({
        url: '/pages/my/subscription',
      })
    },
    cancelFeature () {
      this.showFeature = false
    },
    // 查询本地题目
    selectSubjects (params) {
      const subjects = uni.getStorageSync('subjects')
      console.log(params)
      
      for (let item of subjects) {
        if (item.id == this.subject_id) {
          for (let jtem of item.cate) {
            if (jtem.id == params.cate_id) {
              return jtem.question // 直接返回找到的数据
            }
          }
        }
      }
      return null // 如果没有找到，返回null或undefined
    },
    // 查询总进度
    getTypeFind () {
      getTypeFind().then((res) => {
        const drivingTest = res.data[0].children
        
        drivingTest.forEach(item => {
          if (item.id == this.subject_id) {
            this.testsPracticed = item.practiced
            this.overallProgress = item.progress
          }
        })
      });
    }
   },
  onLoad(options) {
    this.subject_id = options.id
    this.currentViewTitle = options.title
    // this.fetchCategories();
    // this.queryMemberInfo()
  },
  onShow () {
    this.fetchCategories();
    this.queryMemberInfo()
    this.getTypeFind()
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
  overflow-x: hidden;
  background: rgba(255, 255, 255, 0.92);
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
  position: sticky;
  top: 0;
  padding: calc(env(safe-area-inset-top) + 24rpx) 40rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 20;
  min-height: 120rpx;
  backdrop-filter: blur(16rpx);
}

.back-button {
  position: absolute;
  left: 40rpx;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  font-size: 40rpx;
  padding: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
}

.page-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
}

/* 容器 */
.container {
  flex: 1;
  padding: 40rpx 48rpx 160rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  gap: 48rpx;
}

/* 模式选择卡片 */
.mode-cards-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40rpx;
  max-width: 700rpx;
  width: 100%;
  margin: 0 auto;
}

.mode-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 40rpx;
  padding: 60rpx 50rpx;
  text-align: center;
  box-shadow: 0 16rpx 50rpx rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
  min-height: 320rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
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
  margin: 0 auto 32rpx;
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
  margin-bottom: 32rpx;
  line-height: 1.5;
  display: block;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  display: flex;
  flex-direction: column;
  max-width: 700rpx;
  width: 100%;
  margin: 0 auto;
  gap: 32rpx;
}

.options-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 40rpx;
  padding: 48rpx;
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36rpx 0;
  border-bottom: 2rpx solid #F5F5F5;
  flex-wrap: wrap;
  gap: 24rpx;
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
  font-size: 36rpx;
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
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  background: white;
  border-radius: 50%;
  top: 4rpx;
  left: 4rpx;
  transition: transform 0.3s;
  box-shadow: 0 8rpx 20rpx rgba(74, 158, 255, 0.2);
}

.toggle-switch.active::after {
  transform: translateX(40rpx);
}

/* 分类选择 */
.categories-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 160rpx;
  max-width: 700rpx;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.category-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 40rpx;
  padding: 40rpx;
  box-shadow: 0 12rpx 40rpx rgba(0,0,0,0.06);
  border: 4rpx solid transparent;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
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
  gap: 24rpx;
  flex-wrap: wrap;
}

.category-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
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

// .category-progress {
//   font-size: 16px;
//   font-weight: 600;
//   color: #4A9EFF;
// }

.category-progress {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 8rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #4A9EFF;
}

.category-progress:active {
  opacity: 0.7;
}

.category-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  font-size: 28rpx;
  color: #666;
  padding-left: 64rpx;
}

// .progress-bar {
//   width: calc(100% - 32px);
//   height: 6px;
//   background: #F0F0F0;
//   border-radius: 3px;
//   overflow: hidden;
//   margin-left: 32px;
// }
.progress-bar {
  flex: 1;
  height: 16rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
  border-radius: 8rpx;
  transition: width 0.5s ease;
}

/* 操作按钮 */
.button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 40rpx calc(env(safe-area-inset-bottom) + 40rpx);
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
  padding: 50rpx 40rpx 70rpx;
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
@media screen and (max-width: 23.5rem) {
  .mode-card {
    padding: 40rpx;
  }
}
/* 搜索栏 */
.search-container {
  margin-bottom: 60rpx;
  display: flex;
  gap: 20rpx;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  background: #f5f5f5;
  border: none;
  border-radius: 50rpx;
  padding: 30rpx 40rpx;
  font-size: 32rpx;
  color: #333;
  outline: none;
  min-height: 88rpx;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 30rpx 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 12rpx 36rpx rgba(74, 158, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:active {
  transform: scale(0.98);
}
/* Road Sign分类列表 */
.road-signs-container {
  flex: 1;
  overflow-y: auto;
  max-width: 800rpx;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  padding-bottom: 160rpx;
}

.category-section {
  margin: 0;
  padding: 40rpx;
  background: rgba(255,255,255,0.92);
  border-radius: 40rpx;
  box-shadow: 0 16rpx 50rpx rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24rpx;
  flex-wrap: wrap;
}

.category-header:active {
  opacity: 0.7;
}

.category-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
  color: #999;
  font-size: 28rpx;
  flex-wrap: wrap;
}

.category-count {
  font-size: 28rpx;
  color: #999;
}

.next-arrow {
  font-size: 32rpx;
  color: #999;
}

/* 道路标志网格 */
.signs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180rpx, 1fr));
  gap: 24rpx;
}

.signs-grid:active {
  opacity: 0.7;
}

.sign-item {
  background: white;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 40rpx rgba(0,0,0,0.08);
  min-height: 220rpx;
  padding: 32rpx;
  transition: transform 0.3s ease;
}

.sign-item image {
  width: 100%;
  height: auto;
  max-width: 100%;
}

/* 用CSS创建道路标志图标 */
.sign-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 禁止类标志 - 红色圆形 */
.sign-icon.no-entry,
.sign-icon.no-right-turn,
.sign-icon.no-overtaking,
.sign-icon.no-stopping,
.sign-icon.no-pedestrians,
.sign-icon.no-horn {
  background: #ff4444;
  border: 6rpx solid #cc0000;
}

/* 警告类标志 - 黄色三角形 */
.sign-icon.warning-general,
.sign-icon.road-narrows,
.sign-icon.children-crossing,
.sign-icon.animals-crossing {
  background: #ffcc00;
  border: 6rpx solid #ff9900;
  color: #000;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 0;
}

/* 强制类标志 - 蓝色圆形 */
.sign-icon.turn-right,
.sign-icon.turn-left,
.sign-icon.ahead-only,
.sign-icon.roundabout {
  background: #4A9EFF;
  border: 6rpx solid #2196F3;
}

/* 信息类标志 - 绿色或蓝色方形 */
.sign-icon.information,
.sign-icon.parking,
.sign-icon.hospital,
.sign-icon.petrol-station {
  background: #00cc66;
  border: 6rpx solid #009944;
  border-radius: 16rpx;
}

/* 分类详情页面样式 */
.category-detail-container {
  flex: 1;
  overflow-y: auto;
  max-width: 800rpx;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 160rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.category-detail-header {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 10rpx 10rpx 40rpx 10rpx;
}

.category-completion {
  font-size: 32rpx;
  color: #4A9EFF;
  font-weight: 500;
}

/* 详情页面的道路标志网格 - 2列布局 */
.detail-signs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240rpx, 1fr));
  gap: 32rpx;
  padding: 0 20rpx;
}

.detail-sign-item {
  background: white;
  border-radius: 40rpx;
  padding: 50rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
  box-shadow: 0 16rpx 40rpx rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.detail-sign-item:active {
  transform: scale(0.96);
}

.detail-sign-icon {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  color: white;
  font-weight: bold;
  overflow: hidden;

  > image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

/* 详情页面图标样式 */
.detail-sign-icon.no-entry,
.detail-sign-icon.no-right-turn,
.detail-sign-icon.no-overtaking,
.detail-sign-icon.no-stopping,
.detail-sign-icon.no-pedestrians,
.detail-sign-icon.no-horn {
  background: #ff4444;
  border: 8rpx solid #cc0000;
}

.detail-sign-icon.warning-general,
.detail-sign-icon.road-narrows,
.detail-sign-icon.children-crossing,
.detail-sign-icon.animals-crossing {
  background: #ffcc00;
  border: 8rpx solid #ff9900;
  color: #000;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 0;
}

.detail-sign-icon.turn-right,
.detail-sign-icon.turn-left,
.detail-sign-icon.ahead-only,
.detail-sign-icon.roundabout {
  background: #4A9EFF;
  border: 8rpx solid #2196F3;
}

.detail-sign-icon.information,
.detail-sign-icon.parking,
.detail-sign-icon.hospital,
.detail-sign-icon.petrol-station {
  background: #00cc66;
  border: 8rpx solid #009944;
  border-radius: 24rpx;
}

.detail-sign-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  text-align: center;
  line-height: 1.4;
}


.option-item-no-border {
  border-bottom: none !important;
  flex-direction: column !important;
  align-items: stretch !important;
  padding-bottom: 20rpx !important;
}

.option-label {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.option-label-mb {
  margin-bottom: 30rpx !important;
}
/* 单选按钮组 */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 0;
}

.radio-circle {
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

.radio-circle.selected::after {
  content: '';
  width: 20rpx;
  height: 20rpx;
  background: #4A9EFF;
  border-radius: 50%;
}

.radio-text {
  font-size: 30rpx;
  color: #333;
}
</style>
