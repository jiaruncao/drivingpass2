<template>
  <view class="app">
    <!-- 渐变背景 -->
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <text class="page-title">Contact Us</text>
    </view>

    <!-- 主要内容 -->
    <view class="container">
      <!-- FAQ 部分 - 放在最上面 -->
      <view class="faq-section">
        <text class="section-header">Frequently Asked Questions</text>

        <!-- FAQ 分类按钮 -->
        <view class="faq-categories">
          <view 
            class="category-button" 
            :class="{active: selectedCategory === 'general'}"
            @tap="selectedCategory = 'general'">
            General
          </view>
          <view 
            class="category-button"
            :class="{active: selectedCategory === 'technical'}"
            @tap="selectedCategory = 'technical'">
            Technical
          </view>
          <view 
            class="category-button"
            :class="{active: selectedCategory === 'subscription'}"
            @tap="selectedCategory = 'subscription'">
            Subscription
          </view>
          <view 
            class="category-button"
            :class="{active: selectedCategory === 'account'}"
            @tap="selectedCategory = 'account'">
            Account
          </view>
        </view>

        <!-- FAQ 内容卡片 -->
        <view class="faq-card">
          <view v-for="(faq, index) in currentFaqs" :key="selectedCategory + '-' + index" class="faq-item">
            <view class="faq-question" @tap="toggleFaq(index)">
              <text class="faq-question-text">{{ faq.question }}</text>
              <view class="faq-icon" :class="{expanded: expandedFaq === index}">
                <text class="faq-icon-arrow">▼</text>
              </view>
            </view>
            <view class="faq-answer" :class="{expanded: expandedFaq === index}">
              <view class="faq-answer-content">{{ faq.answer }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 联系信息卡片 -->
      <view class="contact-info-card">
        <view class="info-item">
          <view class="info-icon email">
            <text class="icon-text">✉</text>
          </view>
          <view class="info-content">
            <view class="info-title">Email Support</view>
            <view class="info-detail email-link" @tap="sendEmail">info@drivingpass.co.uk</view>
          </view>
        </view>

        <view class="info-item">
          <view class="info-icon hours">
            <text class="icon-text">⏰</text>
          </view>
          <view class="info-content">
            <view class="info-title">Business Hours</view>
            <text class="info-detail">Monday - Friday: 08:00 - 16:00
Weekend & Bank Holidays: Closed</text>
          </view>
        </view>
      </view>

      <!-- 联系表单 -->
      <view class="form-card">
        <view class="form-title">Send us a Message</view>
        <form @submit="submitForm">
          <view class="form-group">
            <text class="form-label">Your Name <text class="required">*</text></text>
            <input 
              type="text" 
              class="form-input" 
              v-model="formData.name"
              placeholder="Enter your full name"
              placeholder-style="color: #999"
              @confirm="nextField('email')" />
          </view>

          <view class="form-group">
            <text class="form-label">Email Address <text class="required">*</text></text>
            <input 
              type="email" 
              class="form-input" 
              v-model="formData.email"
              placeholder="your.email@example.com"
              placeholder-style="color: #999"
              @confirm="nextField('topic')" />
          </view>

          <view class="form-group">
            <text class="form-label">Topic <text class="required">*</text></text>
            <picker mode="selector" :range="topicOptions" :range-key="'label'" @change="onTopicChange">
              <view class="form-select">
                <text :style="{color: formData.topic ? '#333' : '#999'}">
                  {{ formData.topicLabel || 'Select a topic' }}
                </text>
                <text class="select-arrow">▼</text>
              </view>
            </picker>
          </view>

          <view class="form-group">
            <text class="form-label">Message <text class="required">*</text></text>
            <textarea 
              class="form-textarea" 
              v-model="formData.message"
              placeholder="Please describe your issue or question in detail..."
              placeholder-style="color: #999"
              maxlength="500"
              auto-height />
          </view>

          <button 
            class="submit-button" 
            :disabled="isSubmitting || !isFormValid"
            @tap="submitForm">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </view>
    </view>

    <!-- 成功提示模态框 -->
    <view v-if="showSuccess" class="success-modal" @tap="showSuccess = false">
      <view class="success-content" @tap.stop>
        <view class="success-icon">
          <text class="success-check">✓</text>
        </view>
        <text class="success-title">Message Sent!</text>
        <text class="success-message">Thank you for contacting us. We'll get back to you within 24 hours during business days.</text>
        <view class="success-button" @tap="showSuccess = false">OK</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      formData: {
        name: '',
        email: '',
        topic: '',
        topicLabel: '',
        message: ''
      },
      // 主题选项
      topicOptions: [
        { value: 'technical', label: 'Technical Issue' },
        { value: 'subscription', label: 'Subscription & Billing' },
        { value: 'content', label: 'Content & Questions' },
        { value: 'account', label: 'Account Related' },
        { value: 'feedback', label: 'Feedback & Suggestions' },
        { value: 'other', label: 'Other' }
      ],
      // 提交状态
      isSubmitting: false,
      showSuccess: false,
      // FAQ选中的分类
      selectedCategory: 'general',
      // FAQ展开状态
      expandedFaq: null,
      // FAQ数据 - 按类别分组
      faqData: {
        general: [
          {
            question: 'How accurate are the practice questions?',
            answer: 'Our practice questions are based on the official DVSA question bank and are regularly updated to reflect the latest test format and requirements. We maintain over 98% accuracy with the actual theory test questions.'
          },
          {
            question: 'Can I use the app offline?',
            answer: 'Yes! Once you download the content, you can practice theory questions and review the Highway Code offline. However, hazard perception videos and syncing progress require an internet connection.'
          },
          {
            question: 'How often is the content updated?',
            answer: 'We update our content monthly to ensure it reflects the latest DVSA requirements. Major updates are released when the DVSA makes changes to the test format or question bank.'
          }
        ],
        technical: [
          {
            question: 'The app is crashing, what should I do?',
            answer: 'First, try restarting the app. If the problem persists, ensure you have the latest version installed. Clear the app cache in your device settings. If issues continue, please contact our support team with your device model and iOS/Android version.'
          },
          {
            question: 'How do I reset my password?',
            answer: 'Go to the login screen and tap "Forgot Password". Enter your registered email address and we\'ll send you a reset link. Check your spam folder if you don\'t receive it within 5 minutes.'
          },
          {
            question: 'Videos are not playing properly, help!',
            answer: 'Check your internet connection first. Videos require a stable connection. Try lowering the video quality in settings. If on mobile data, ensure you have enabled "Use Mobile Data" in the app settings.'
          }
        ],
        subscription: [
          {
            question: 'What\'s the difference between Silver and Gold membership?',
            answer: 'Silver includes all official DVSA questions, hazard perception videos, and mock tests. Gold adds exclusive question banks, additional hazard videos, priority support, and advanced study materials not available elsewhere.'
          },
          {
            question: 'How do I cancel my subscription?',
            answer: 'You can cancel anytime through your device\'s subscription settings. For iOS: Settings > Apple ID > Subscriptions. For Android: Google Play Store > Menu > Subscriptions. Your access continues until the end of the billing period.'
          },
          {
            question: 'Can I get a refund?',
            answer: 'Refunds are handled through the App Store or Google Play Store according to their policies. Generally, refunds are available within 48 hours of purchase if you haven\'t used the premium features.'
          }
        ],
        account: [
          {
            question: 'Can I use my account on multiple devices?',
            answer: 'Yes! Your account can be used on up to 3 devices simultaneously. Simply log in with the same credentials on each device, and your progress will sync automatically.'
          },
          {
            question: 'How do I delete my account?',
            answer: 'You can request account deletion by contacting our support team. Please note that this action is permanent and will delete all your progress, saved items, and subscription history.'
          },
          {
            question: 'I forgot my username, how can I recover it?',
            answer: 'Your username is usually your email address. If you used a custom username, contact our support team with your registered email address and we\'ll help you recover it.'
          }
        ]
      }
    }
  },
  computed: {
    // 获取当前分类的FAQ
    currentFaqs() {
      return this.faqData[this.selectedCategory] || [];
    },
    // 表单验证
    isFormValid() {
      return this.formData.name && 
             this.formData.email && 
             this.formData.topic && 
             this.formData.message &&
             this.validateEmail(this.formData.email);
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          // 如果没有上级页面，返回首页
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    },
    // 发送邮件
    sendEmail() {
      // 复制邮箱到剪贴板
      uni.setClipboardData({
        data: 'info@drivingpass.co.uk',
        success: () => {
          uni.showToast({
            title: 'Email copied!',
            icon: 'success',
            duration: 2000
          });
        }
      });
    },
    // 主题选择变化
    onTopicChange(e) {
      const index = e.detail.value;
      this.formData.topic = this.topicOptions[index].value;
      this.formData.topicLabel = this.topicOptions[index].label;
    },
    // 下一个输入框
    nextField(fieldName) {
      // UniApp中可以通过设置focus来控制焦点
      console.log('Move to next field:', fieldName);
    },
    // 验证邮箱
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    // 提交表单
    async submitForm() {
      if (!this.isFormValid) {
        uni.showToast({
          title: 'Please fill all required fields',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      this.isSubmitting = true;
      
      try {
        // 发送到后端API
        const response = await this.sendToAPI(this.formData);
        
        // 显示成功提示
        this.showSuccess = true;
        
        // 重置表单
        this.resetForm();
      } catch (error) {
        console.error('Failed to send message:', error);
        uni.showToast({
          title: 'Failed to send message',
          icon: 'none',
          duration: 2000
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    // 发送到API
    sendToAPI(data) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: '/api/contact/submit', // 实际的API地址
          method: 'POST',
          data: data,
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.data);
            } else {
              reject(new Error('API request failed'));
            }
          },
          fail: (err) => {
            // 模拟成功（开发时使用）
            setTimeout(() => {
              resolve({ success: true });
            }, 1500);
          }
        });
      });
    },
    // 重置表单
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        topic: '',
        topicLabel: '',
        message: ''
      };
    },
    // 切换FAQ展开状态
    toggleFaq(index) {
      this.expandedFaq = this.expandedFaq === index ? null : index;
    }
  },
  onLoad() {
    // 页面加载时的初始化
    console.log('Contact page loaded');
  }
}
</script>

<style lang="scss">
/* 全局重置样式 */
page {
  background: #F8F9FA;
}

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

.page-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
  margin-right: 80rpx;
}

/* 容器 */
.container {
  flex: 1;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  max-width: 800rpx;
  width: 100%;
  margin: 0 auto;
}

/* FAQ 部分 */
.faq-section {
  margin-bottom: 50rpx;
}

.section-header {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 50rpx;
  text-align: center;
  display: block;
}

/* FAQ 分类按钮 */
.faq-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  justify-content: center;
  margin-bottom: 50rpx;
}

.category-button {
  padding: 20rpx 48rpx;
  background: white;
  border: 4rpx solid #E0E0E0;
  border-radius: 50rpx;
  font-size: 30rpx;
  color: #666;
  transition: all 0.3s ease;
  font-weight: 500;
  min-width: 200rpx;
  text-align: center;
}

.category-button.active {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 8rpx 30rpx rgba(74, 158, 255, 0.3);
}

.category-button:active {
  transform: scale(0.95);
}

/* FAQ 卡片 */
.faq-card {
  background: white;
  border-radius: 40rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 36rpx rgba(0,0,0,0.06);
}

.faq-item {
  border-bottom: 2rpx solid #F5F5F5;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  padding: 36rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;
}

.faq-question:active {
  background: #F8F9FA;
}

.faq-question-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  flex: 1;
  padding-right: 20rpx;
  line-height: 1.4;
}

.faq-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.faq-icon.expanded {
  transform: rotate(180deg);
}

.faq-icon-arrow {
  font-size: 24rpx;
  color: #999;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-answer.expanded {
  max-height: 1000rpx;
}

.faq-answer-content {
  padding: 0 40rpx 36rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

/* 联系信息卡片 */
.contact-info-card {
  background: white;
  border-radius: 40rpx;
  padding: 50rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 16rpx 50rpx rgba(0,0,0,0.08);
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 40rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  width: 90rpx;
  height: 90rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
  flex-shrink: 0;
}

.info-icon.email {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
}

.info-icon.hours {
  background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
}

.icon-text {
  font-size: 40rpx;
  color: white;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.info-detail {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
}

.email-link {
  color: #4A9EFF;
  font-weight: 500;
}

/* 表单卡片 */
.form-card {
  background: white;
  border-radius: 40rpx;
  padding: 50rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 16rpx 50rpx rgba(0,0,0,0.08);
}

.form-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 40rpx;
  text-align: center;
}

.form-group {
  margin-bottom: 40rpx;
}

.form-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
  font-weight: 500;
}

.required {
  color: #FF6B6B;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 28rpx 32rpx;
  border: 4rpx solid #F0F0F0;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
  height: 100%;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #4A9EFF;
  background: #F8FBFF;
}

.form-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.select-arrow {
  font-size: 24rpx;
  color: #999;
  transition: transform 0.3s;
}

.form-textarea {
  min-height: 240rpx;
  line-height: 1.5;
}

.submit-button {
  width: 100%;
  padding: 32rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 12rpx 40rpx rgba(74, 158, 255, 0.35);
  transition: all 0.3s ease;
}

.submit-button:active {
  transform: scale(0.98);
}

.submit-button[disabled] {
  opacity: 0.6;
}

/* 成功提示 */
.success-modal {
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

.success-content {
  background: white;
  border-radius: 50rpx;
  padding: 60rpx;
  max-width: 640rpx;
  width: 100%;
  text-align: center;
  animation: slideUp 0.3s ease;
}

.success-icon {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40rpx;
}

.success-check {
  font-size: 60rpx;
  color: white;
  font-weight: bold;
}

.success-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.success-message {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
  line-height: 1.4;
  display: block;
}

.success-button {
  padding: 24rpx 60rpx;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: 600;
  display: inline-block;
}

@keyframes slideUp {
  from { 
    transform: translateY(40rpx); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
}

/* 响应式优化 */
@media screen and (max-width: 375px) {
  .container {
    padding: 30rpx;
  }

  .form-card,
  .contact-info-card {
    padding: 40rpx;
  }

  .page-title {
    font-size: 40rpx;
  }
}
</style>