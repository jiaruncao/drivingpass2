<template>
  <view class="app">
    <!-- 主要内容 -->
    <view class="container">
      <!-- 用户信息卡片 -->
      <view class="profile-card">
        <view class="edit-profile-btn" @tap="editProfile">
          <text class="edit-icon">✏️</text>
        </view>
        <view class="profile-content">
          <view class="avatar-container">
            <view class="avatar" v-if="userData.avatar">
              <image class="image" :src="userData.avatar" mode="aspectFill"></image>
            </view>
            <view class="avatar" v-else>
              <text class="avatar-text">{{ userInitial }}</text>
            </view>
          </view>
          <text class="username">{{ userData.nickname }}</text>
          <view v-if="userData.testCentre" class="test-centre">
            <text class="location-icon">📍</text>
            <text class="test-centre-text">{{ userData.testCentre }}</text>
          </view>
          <text v-if="userData.examDate" class="next-attempt">Test Date: {{ userData.examDate }}</text>
          <text class="bio">{{ userData.bio }}</text>
          <view class="stats-row">
            <view class="stat-item">
              <text class="stat-value">{{ userData.following || 0 }}</text>
              <text class="stat-label">Following</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ userData.followers || 0 }}</text>
              <text class="stat-label">Followers</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ userData.likes || 0 }}</text>
              <text class="stat-label">Likes</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 订阅卡片 -->
      <view class="subscription-card"  @click="toFeature">
        <view class="subscription-header">
          <text class="subscription-title">Subscription</text>
          <!-- <view class="subscription-badge" :class="getBadgeClass">
            <text class="badge-text">{{ replace(subscriptionData.type) }}</text>
          </view> -->
          <view>
            Change plan
          </view>
        </view>
        <view class="expires-text" v-if="replace(subscriptionData.type) !== 'free'">
          Current plan: 
          <view style="margin-left: 16rpx;" class="subscription-badge" :class="getBadgeClass">
            <text class="badge-text">{{ replace(subscriptionData.type) }}</text>
          </view>
        </view>
        
        <view class="features-grid">
          <!-- Silver Features - 第一行 -->
          <view class="feature-item" 
                :class="getFeatureClass('silver', 'official_questions')"
                @tap.stop="handleFeatureClick('official_questions')">
            <view class="feature-icon-wrapper">
              <view class="feature-icon">
                <text class="icon-text">📝</text>
              </view>
            </view>
            <text class="feature-label">DVSA Official Questions</text>
          </view>
          
          <view class="feature-item" 
                :class="getFeatureClass('silver', 'official_hazard')"
                @tap.stop="handleFeatureClick('official_hazard')">
            <view class="feature-icon-wrapper">
              <view class="feature-icon">
                <text class="icon-text">🎬</text>
              </view>
            </view>
            <text class="feature-label">Official Hazard Videos</text>
          </view>
          
          <view class="feature-item" 
                :class="getFeatureClass('silver', 'mock_tests')"
                @tap.stop="handleFeatureClick('mock_tests')">
            <view class="feature-icon-wrapper">
              <view class="feature-icon">
                <text class="icon-text">📊</text>
              </view>
            </view>
            <text class="feature-label">Realistic Mock Tests</text>
          </view>
          
          <view class="feature-item" 
                :class="getFeatureClass('silver', 'study_material')"
                @tap.stop="handleFeatureClick('study_material')">
            <view class="feature-icon-wrapper">
              <view class="feature-icon">
                <text class="icon-text">📚</text>
              </view>
            </view>
            <text class="feature-label">Highway Code + Road Signs</text>
          </view>

          <!-- 分隔线 -->
          <view class="subscription-divider"></view>

          <!-- Gold Features - 第二行 -->
          <view class="feature-item" 
                :class="getFeatureClass('gold', 'exclusive_questions')"
                @tap.stop="handleFeatureClick('exclusive_questions')">
            <view class="feature-icon-wrapper">
              <view class="feature-icon">
                <text class="icon-text">⭐</text>
              </view>
            </view>
            <text class="feature-label">Exclusive Question Banks</text>
          </view>
          
          <view class="feature-item" 
                :class="getFeatureClass('gold', 'exclusive_hazard')"
                @tap.stop="handleFeatureClick('exclusive_hazard')">
            <view class="feature-icon-wrapper">
              <view class="feature-icon">
                <text class="icon-text">🎯</text>
              </view>
            </view>
            <text class="feature-label">Exclusive Hazard Videos</text>
          </view>
          
          <view class="feature-item" 
                :class="getFeatureClass('gold', 'exclusive_study')"
                @tap.stop="handleFeatureClick('exclusive_study')">
            <view class="feature-icon-wrapper">
              <view class="feature-icon">
                <text class="icon-text">🛣️</text>
              </view>
            </view>
            <text class="feature-label">Exclusive Study Material</text>
          </view>
          
          <view class="feature-item" 
                :class="getFeatureClass('gold', 'priority_support')"
                @tap.stop="handleFeatureClick('priority_support')">
            <view class="feature-icon-wrapper">
              <view class="feature-icon">
                <text class="icon-text">💎</text>
              </view>
            </view>
            <text class="feature-label">Priority Support</text>
          </view>
        </view>
      </view>

      <!-- 测试进度卡片 -->
      <view class="progress-card">
        <view class="progress-header">
          <text class="progress-title">Test Progress</text>
          <view class="view-details-btn" @tap="viewDetails">
            <text class="btn-text">View Details›</text>
          </view>
        </view>
        <view class="question-bank-selector">
          <text class="bank-label">Question Bank:</text>
          <view class="bank-type" @tap="switchQuestionBank">
            <text class="bank-type-text">{{ currentQuestionBank }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="pass-rate">
          <text class="pass-rate-label">Current pass rate: </text>
          <view class="pass-rate-value" style="margin-left: 16rpx;">{{ passRate }}%</view>
        </view>
      </view>

      <!-- 菜单列表 -->
      <view class="menu-list">
        <view class="menu-item" @tap="navigateTo('saved')">
          <view class="menu-icon star">
            <text class="menu-icon-text">⭐</text>
          </view>
          <text class="menu-text">Saved Items</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @tap="rateApp">
          <view class="menu-icon rate">
            <text class="menu-icon-text">💙</text>
          </view>
          <text class="menu-text">Rate the App</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @tap="shareApp">
          <view class="menu-icon share">
            <text class="menu-icon-text">🔗</text>
          </view>
          <text class="menu-text">Share App</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @tap="contactUs">
          <view class="menu-icon contact">
            <text class="menu-icon-text">📧</text>
          </view>
          <text class="menu-text">Contact Us</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <!-- 政策链接列表 -->
      <view class="menu-list">
        <view class="menu-item" @tap="navigateTo('privacy')">
          <view class="menu-icon">
            <text class="menu-icon-text">🔒</text>
          </view>
          <text class="menu-text">Privacy Policy</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @tap="navigateTo('terms')">
          <view class="menu-icon">
            <text class="menu-icon-text">📄</text>
          </view>
          <text class="menu-text">Terms of Use</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>
    
    <u-popup
      :show="showQuestionBankSheet"
      mode="bottom"
      round="24"
      :closeOnClickOverlay="true"
      @close="closeQuestionBankSheet"
    >
      <view class="question-bank-sheet">
        <view class="sheet-handle"></view>
        <view class="sheet-header">
          <text class="sheet-title">Select Question Bank</text>
          <text class="sheet-subtitle">Choose the licence you're preparing for</text>
        </view>
        <scroll-view scroll-y class="sheet-options">
          <view
            v-for="option in questionBankOptions"
            :key="option.value"
            class="sheet-option-item"
            :class="{ active: pendingQuestionBank === option.value }"
            @tap="selectQuestionBank(option.value)"
          >
            <view class="sheet-option-main">
              <view class="sheet-option-icon">
                <text>{{ option.icon }}</text>
              </view>
              <view class="sheet-option-texts">
                <text class="sheet-option-label">{{ option.label }}</text>
                <text class="sheet-option-description">{{ option.description }}</text>
              </view>
            </view>
            <text v-if="pendingQuestionBank === option.value" class="sheet-option-check">✔</text>
          </view>
        </scroll-view>
        <view class="sheet-footer">
          <view class="sheet-button primary" @tap="confirmQuestionBankSelection">Confirm Selection</view>
          <view class="sheet-button secondary" @tap="closeQuestionBankSheet">Cancel</view>
        </view>
        <view class="safe-area-spacer"></view>
      </view>
    </u-popup>

    <!-- 升级弹框 -->
    <u-modal title="Feature Locked" :show="showFeature" :showCancelButton="true" cancelText="Cancel" confirmText="Upgrade" :content='content' @confirm="confirmFeature" @cancel="cancelFeature"></u-modal>
  </view>
</template>

<script>
import {getUserInfo, queryMemberInfo} from '@/http/api/login.js'
import {getTestStatistics} from '@/http/api/testQuestions.js'
export default {
  data() {
    return {
      // 用户数据
      userData: {},
      // 订阅数据
      subscriptionData: {
        // 可选: 'free', 'silver', 'gold'
      },
      // 测试进度数据
      // ['Car', 'Motorcycle', 'ADI', 'LGV', 'PCV']
      currentQuestionBank: 'Car',
      passRate: 70,
      showFeature: false,
      content: '',
      showQuestionBankSheet: false,
      pendingQuestionBank: 'Car',
      questionBankOptions: [
        { value: 'Car', label: 'Car', description: 'DVSA car theory questions', icon: '🚗' },
        { value: 'Motorcycle', label: 'Motorcycle', description: 'Motorcycle-specific practice', icon: '🏍️' },
        { value: 'ADI', label: 'ADI', description: 'Approved Driving Instructor theory prep', icon: '🎓' },
        { value: 'LGV', label: 'LGV', description: 'Large goods vehicle training', icon: '🚚' },
        { value: 'PCV', label: 'PCV', description: 'Passenger carrying vehicle focus', icon: '🚌' }
      ]
    }
  },
  computed: {
    // 获取用户名首字母
    userInitial() {
      return this.userData.nickname ? this.userData.nickname.charAt(0).toUpperCase() : null;
    },
    // 获取订阅徽章样式
    getBadgeClass() {
      return `badge-${this.replace(this.subscriptionData.type)}`;
    }
  },
  methods: {
    // 获取功能项的样式类
    getFeatureClass(requiredLevel, featureName) {
      const levels = ['free', 'silver', 'gold'];
      const userLevel = levels.indexOf(this.subscriptionData.type);
      const requiredLevelIndex = levels.indexOf(requiredLevel);
      
      if (userLevel >= requiredLevelIndex) {
        return `unlocked ${requiredLevel}`;
      }
      return 'locked';
    },
    // 处理功能点击
    handleFeatureClick(feature) {
      const silverFeatures = ['official_questions', 'official_hazard', 'mock_tests', 'study_material'];
      const goldFeatures = ['exclusive_questions', 'exclusive_hazard', 'exclusive_study', 'priority_support'];
      
      const levels = ['free', 'silver', 'gold'];
      const userLevel = levels.indexOf(this.subscriptionData.type);
      
      let requiredLevel = 0; // free
      if (silverFeatures.includes(feature)) {
        requiredLevel = 1; // silver
      } else if (goldFeatures.includes(feature)) {
        requiredLevel = 2; // gold
      }
      
      if (userLevel >= requiredLevel) {
        console.log(`Accessing feature: ${feature}`);
        // 导航到相应功能
        uni.showToast({
          title: `Opening ${feature.replace(/_/g, ' ')}`,
          icon: 'none'
        });
      } else {
        console.log(`Feature locked. Upgrade to ${levels[requiredLevel]} to unlock.`);
        // 显示升级提示
        this.showFeature = true
        this.content = `Upgrade to ${levels[requiredLevel].toUpperCase()} to unlock this feature`
        // uni.showModal({
        //   title: 'Feature Locked',
        //   content: `Upgrade to ${levels[requiredLevel].toUpperCase()} to unlock this feature`,
        //   confirmText: 'Upgrade',
        //   cancelText: 'Cancel',
        //   success: (res) => {
        //     if (res.confirm) {
        //       uni.navigateTo({
        //         url: '/pages/my/subscription',
        //       })
        //     }
        //   }
        // });
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
    toFeature () {
      uni.navigateTo({
        url: '/pages/my/subscription',
      })
    },
    // 编辑个人资料
    editProfile() {
      console.log('Edit profile clicked');
      // 实际应用中导航到编辑页面
      uni.navigateTo({
        url: '/pages/my/editProfile'
      });
    },
    // 查看详情
    viewDetails() {
      console.log('View details clicked');
      // 实际应用中导航到详情页面
      uni.navigateTo({
        url: '/pages/mockTest/record'
      });
    },
    // 切换题库
    switchQuestionBank() {
      this.pendingQuestionBank = this.currentQuestionBank;
      this.showQuestionBankSheet = true;
    },
    // 选择题库
    selectQuestionBank(optionValue) {
      this.pendingQuestionBank = optionValue;
    },
    // 关闭题库选择弹窗
    closeQuestionBankSheet() {
      this.showQuestionBankSheet = false;
      this.pendingQuestionBank = this.currentQuestionBank;
    },
    // 确认题库选择
    confirmQuestionBankSelection() {
      this.currentQuestionBank = this.pendingQuestionBank;
      this.closeQuestionBankSheet();
      try {
        uni.setStorageSync('questionBankType', this.currentQuestionBank);
      } catch (error) {
        console.warn('Unable to persist question bank selection', error);
      }
    },
    // 加载存储的题库偏好
    loadQuestionBankPreference() {
      try {
        const storedBank = uni.getStorageSync('questionBankType');
        if (storedBank) {
          this.currentQuestionBank = storedBank;
          this.pendingQuestionBank = storedBank;
        }
      } catch (error) {
        console.warn('Unable to load stored question bank', error);
      }
    },
    // 评价应用
    rateApp() {
      console.log('Rate app clicked');
      // 实际应用中打开应用商店评价页面
      uni.showToast({
        title: 'Opening App Store',
        icon: 'none'
      });
    },
    // 分享应用
    shareApp() {
      console.log('Share app clicked');
      // 实际应用中调用系统分享功能
      uni.share({
        provider: 'weixin',
        type: 0,
        title: 'UK Driving Theory Test',
        summary: 'Best app for UK driving theory test preparation!'
      });
    },
    // 联系我们
    contactUs() {
      console.log('Contact us clicked');
      // 实际应用中打开联系页面或邮件客户端
      uni.navigateTo({
        url: '/pages/my/contact'
      });
    },
    // 导航到其他页面
    navigateTo(page) {
      console.log(`Navigate to ${page}`);
      // 实际应用中进行页面导航
      const pages = {
        'home': '/pages/index/index',
        'forum': '/pages/forum/index',
        'saved': '/pages/my/mySaved',
        'privacy': '/pages/my/privacy',
        'terms': '/pages/my/terms'
      };
      
      if (pages[page]) {
        if (page === 'home') {
          uni.switchTab({
            url: pages[page]
          });
        } else {
          uni.navigateTo({
            url: pages[page]
          });
        }
      }
    },
    // 获取用户数据
    async fetchUserData() {
      const response = await getUserInfo()
      if (response.code == 1) {
        this.userData = response.data
        // this.subscriptionData = response.data.info
      }
    },
    // 查询会员信息
    queryMemberInfo () {
      queryMemberInfo().then(res => {
        console.log(res)
        if (res.code == 1) {
          this.subscriptionData = res.data
        }
      })
    },
    // 替换
    replace (type) {
      switch (type){
        case 'NORMAL':
          return 'free'
          break;
        default:
          return type
          break;
      }
    },
    getTestStatistics () {
      getTestStatistics().then(res => {
        console.log(res)
      })
    }
  },
  onLoad() {
    this.loadQuestionBankPreference();
    // 页面加载时获取数据
    // this.fetchUserData();
    // this.queryMemberInfo()
    // this.updateStats();
    
    // 测试不同订阅等级的效果
    // this.subscriptionData.type = 'free';    // 免费用户
    // this.subscriptionData.type = 'silver';  // 银牌会员
    // this.subscriptionData.type = 'gold';    // 金牌会员
  },
  onShow () {
    this.fetchUserData();
    this.queryMemberInfo()
    this.getTestStatistics()
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  padding-top: calc(env(safe-area-inset-top) + 40rpx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 160rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 60%, #FFF4F4 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #333;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  padding: 0 5vw;
  box-sizing: border-box;
}

.profile-card {
  background: #ffffff;
  border-radius: 48rpx;
  padding: 56rpx 40rpx 48rpx;
  box-shadow: 0 24rpx 80rpx rgba(0, 0, 0, 0.08);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
}

.edit-profile-btn {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  background: rgba(248, 249, 250, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  font-size: 40rpx;
}

.profile-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.avatar-container {
  width: 220rpx;
  height: 220rpx;
  border-radius: 110rpx;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 110rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar .image {
  width: 100%;
  height: 100%;
  border-radius: 110rpx;
}

.avatar-text {
  font-size: 80rpx;
  color: #ffffff;
  font-weight: 600;
}

.username {
  font-size: 40rpx;
  font-weight: 600;
}

.test-centre {
  display: flex;
  align-items: center;
  gap: 12rpx;
  color: #666;
  font-size: 28rpx;
}

.next-attempt {
  font-size: 28rpx;
  color: #666;
}

.bio {
  font-size: 26rpx;
  color: #888;
  text-align: center;
  line-height: 1.5;
}

.stats-row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  align-items: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: 700;
}

.stat-label {
  font-size: 24rpx;
  color: #888;
}

.subscription-card,
.progress-card {
  background: #ffffff;
  border-radius: 48rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 24rpx 80rpx rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.subscription-header,
.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.subscription-title,
.progress-title {
  font-size: 36rpx;
  font-weight: 600;
}

.subscription-badge {
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.badge-text {
  font-size: 26rpx;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1rpx;
  color: #ffffff;
}

.badge-free {
  background: #F5F5F5;
}

.badge-free .badge-text {
  color: #666;
}

.badge-silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #999999 100%);
}

.badge-gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.expires-text {
  font-size: 26rpx;
  color: #666;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.feature-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: center;
}

.feature-icon-wrapper {
  width: 120rpx;
  height: 120rpx;
}

.feature-icon {
  width: 100%;
  height: 100%;
  background: #F8F9FA;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid transparent;
  position: relative;
}

.icon-text {
  font-size: 48rpx;
}

.feature-item.unlocked.silver .feature-icon {
  background: linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%);
  border-color: #C0C0C0;
}

.feature-item.unlocked.gold .feature-icon {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFF3CD 100%);
  border-color: #FFD700;
}

.feature-item.locked .feature-icon {
  background: #F5F5F5;
}

.feature-item.locked .icon-text {
  opacity: 0.5;
}

.feature-item.locked .feature-icon::after {
  content: '🔒';
  position: absolute;
  bottom: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.feature-label {
  font-size: 24rpx;
  line-height: 1.3;
  color: #666;
}

.feature-item.unlocked .feature-label {
  color: #333;
  font-weight: 500;
}

.subscription-divider {
  grid-column: 1 / -1;
  height: 2rpx;
  background: #F0F0F0;
}

.progress-card {
  gap: 24rpx;
}

.view-details-btn,
.bank-type {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 24rpx;
  border-radius: 32rpx;
  background: #F4F6FB;
}

.btn-text,
.bank-type-text {
  font-size: 26rpx;
  color: #4A6CF7;
}

.question-bank-selector,
.pass-rate {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16rpx;
}

.bank-label,
.pass-rate-label {
  font-size: 28rpx;
  color: #666;
}

.pass-rate-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.menu-item {
  background: #ffffff;
  border-radius: 40rpx;
  padding: 32rpx 40rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 16rpx 50rpx rgba(0, 0, 0, 0.08);
}

.menu-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F4F6FB;
}

.menu-icon-text {
  font-size: 40rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-arrow {
  font-size: 36rpx;
  color: #999;
}

.logout-btn {
  margin-top: 32rpx;
  width: 100%;
  min-height: 96rpx;
  border-radius: 48rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

@media (min-width: 1024px) {
  .container {
    padding: 0 20vw;
  }
}
</style>
