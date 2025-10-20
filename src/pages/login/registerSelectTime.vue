<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
    </view>

    <view class="container">
      <view class="date-card">
        <!-- 图标区域 -->
        <view class="icon-section">
          <view class="date-icon">📅</view>
        </view>

        <!-- 标题区域 -->
        <view class="title-section">
          <text class="title">When is Your Exam?</text>
          <text class="subtitle">Set your theory test date to help us prepare your study plan</text>
        </view>

        <!-- 日期选择器 -->
        <view class="date-picker-container">
          <text class="picker-label">Select Your Exam Date</text>
          
          <!-- 移动端友好的日期输入 -->
          <view class="date-input-container">
            <picker 
              mode="date" 
              :value="examDate"
              :start="minDate"
              @change="onDateChange"
              class="date-picker"
            >
              <view class="date-input">
                <text class="date-text">{{ examDate || 'Select Date' }}</text>
                <view class="date-icon-small">📅</view>
              </view>
            </picker>
          </view>

          <!-- 选中日期显示 -->
          <view v-if="examDate" class="selected-date-display">
            <text class="selected-date-text">Your exam date is</text>
            <text class="selected-date-value">{{ formattedDate }}</text>
          </view>
        </view>

        <!-- 提醒选项 -->
        <view class="reminder-section">
          <view class="reminder-option">
            <view>
              <text class="reminder-label">Remind me before the test</text>
            </view>
            <view class="toggle-switch" :class="{active: reminders.enabled}" @tap="toggleReminder"></view>
          </view>
        </view>

        <!-- 下一步按钮 -->
        <view 
          class="start-button"
          :class="{disabled: isLoading}"
          @tap="handleNext"
        >
          <view v-if="isLoading" class="loading"></view>
          <text>{{ isLoading ? 'Loading...' : 'Next' }}</text>
        </view>
      </view>
    </view>
    
    <u-modal :show="modalShow" :title="modalTitle" :showCancelButton="true" :content='modalContent' :cancelText="cancelText" :confirmText="confirmText" @cancel="cancel" @confirm="confirm"></u-modal>
  </view>
</template>

<script>
import {setTestDate} from '@/http/api/login.js'
export default {
  data() {
    return {
      examDate: '', // 考试日期默认为空
      isLoading: false, // 加载状态
      reminders: {
        enabled: false // 提醒功能默认关闭
      },
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
    // 最小日期（今天）
    minDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    
    // 格式化显示的日期
    formattedDate() {
      if (!this.examDate) {
        return 'Please select a date';
      }
      
      const date = new Date(this.examDate);
      const options = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      };
      
      return date.toLocaleDateString('en-GB', options);
    },
    
    // 检查是否可以继续（日期选择是可选的）
    canContinue() {
      return true; // 不强制要求选择日期
    }
  },
  methods: {
    // 日期选择器变化事件
    onDateChange(e) {
      this.examDate = e.detail.value;
      console.log('Exam date selected:', this.examDate);
    },

    // 切换提醒设置
    async toggleReminder() {
      if (!this.reminders.enabled) {
        // 请求通知权限
        try {
          const result = await uni.requestNotificationPermission();
          if (result === 'granted') {
            this.reminders.enabled = true;
            console.log('Notification permission granted');
            uni.showToast({
              title: 'Reminders enabled',
              icon: 'success'
            });
          } else {
            // uni.showModal({
            //   title: 'Permission Required',
            //   content: 'Please enable notifications to receive exam reminders',
            //   showCancel: false
            // });
            this.modalShow = true
            this.modalTitle =  'Permission Required'
            this.modalType = 'PermissionRequired'
            this.showCancelButton = false
            this.confirmText = 'OK'
            this.modalContent = `Please enable notifications to receive exam reminders`
            console.log('Notification permission denied');
          }
        } catch (error) {
          // 如果API不可用，直接启用
          this.reminders.enabled = true;
          uni.showToast({
            title: 'Reminders enabled',
            icon: 'success'
          });
        }
      } else {
        this.reminders.enabled = false;
        console.log('Reminders disabled');
        uni.showToast({
          title: 'Reminders disabled',
          icon: 'none'
        });
      }
    },

    // 返回上一页
    goBack() {
      uni.navigateBack({
        fail: () => {
          console.log('No previous page, navigate to license selection');
          uni.redirectTo({
            url: '/pages/select-license-type/select-license-type'
          });
        }
      });
    },

    // 处理下一步按钮
    async handleNext() {
      if (this.isLoading) return;

      this.isLoading = true;

      try {
        // 保存用户设置
        await this.saveUserSettings();

        // 设置成功，跳转到主应用
        console.log('User settings saved, entering main app...');
        
        setTimeout(() => {
          uni.showToast({
            title: 'Welcome to DrivingPass!',
            icon: 'success'
          });
          
          // 跳转到主应用
          uni.switchTab({
            url: '/pages/index/index'
          });
          
          // 或者跳转到主页面
          // uni.redirectTo({
          //   url: '/pages/dashboard/dashboard'
          // });
        }, 1000);

      } catch (error) {
        console.error('Failed to save settings:', error);
        uni.showToast({
          title: 'Failed to save settings',
          icon: 'error'
        });
      } finally {
        this.isLoading = false;
      }
    },

    // 模拟API调用 - 保存用户设置
    async saveUserSettings() {
      if (!this.examDate) {
        uni.showToast({
          title: 'Please select a date',
          icon: 'none'
        });
        throw new Error('Please select a date');
      }
      const response = await setTestDate({
        date: this.examDate,
        is_remind: this.reminders.enabled ? 1 : 2
      });
      if (response.code !== 1) {
        throw new Error(response.msg || 'Set failed');
      }
      
      return response.data;
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     const settings = {
      //       examDate: this.examDate || null, // 允许为空
      //       reminders: this.reminders.enabled ? 1 : 2
      //     };
          
      //     console.log('Saving settings:', settings);
          
      //     // 模拟保存成功
      //     resolve(settings);
      //   }, 1000);
      // });
    },
    confirm () {
      this.modalShow = false
    },
    cancel () {
      this.modalShow = false
    },
  },

  onLoad(options) {
    // 页面加载完成后的初始化
    console.log('Exam date selection page loaded');
    
    // 从页面参数获取驾照类型（如果有）
    if (options.licenseType) {
      console.log('License type from previous page:', options.licenseType);
    }
    
    // 不设置默认日期，让用户自主选择
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

/* Header */
.header {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  background: transparent;
  position: relative;
  z-index: 10;
  min-height: 60px;
}

.back-button {
  background: none;
  border: none;
  color: #666;
  font-size: 20px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.back-button:active {
  background: rgba(0,0,0,0.05);
}

/* 主容器 */
.container {
  flex: 1;
  padding: 20px 20px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 10;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

/* 日期选择卡片 */
.date-card {
  background: white;
  border-radius: 30px;
  padding: 35px 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.12);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

.date-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
}

/* 图标区域 */
.icon-section {
  text-align: center;
  margin-bottom: 25px;
}

.date-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  box-shadow: 0 8px 24px rgba(74, 158, 255, 0.3);
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 35px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.subtitle {
  font-size: 16px;
  color: #666;
  line-height: 1.4;
  display: block;
}

/* 日期选择器容器 */
.date-picker-container {
  margin-bottom: 30px;
}

.picker-label {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 500;
  display: block;
}

/* 移动端友好的日期输入 */
.date-input-container {
  margin-bottom: 20px;
}

.date-picker {
  width: 100%;
}

.date-input {
  width: 100%;
  padding: 18px 22px;
  border: 2px solid #F0F0F0;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #4A9EFF;
  background: white;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.date-input:active {
  border-color: #4A9EFF;
  box-shadow: 0 4px 15px rgba(74, 158, 255, 0.3);
}

.date-text {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #4A9EFF;
}

.date-icon-small {
  font-size: 16px;
  color: #999;
}

/* 选中日期显示 */
.selected-date-display {
  background: linear-gradient(135deg, #F8FBFF 0%, #E3F2FD 100%);
  border: 2px solid #4A9EFF;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  margin-bottom: 25px;
}

.selected-date-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  display: block;
}

.selected-date-value {
  font-size: 24px;
  font-weight: 700;
  color: #4A9EFF;
  display: block;
}

/* 提醒选项 */
.reminder-section {
  margin-bottom: 30px;
  background: #FAFAFA;
  border-radius: 20px;
  padding: 20px;
}

.reminder-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.reminder-label {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.toggle-switch {
  width: 48px;
  height: 28px;
  background: #E0E0E0;
  border-radius: 14px;
  position: relative;
  transition: background 0.3s;
}

.toggle-switch.active {
  background: #4A9EFF;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-switch.active::after {
  transform: translateX(20px);
}

/* 开始使用按钮 */
.start-button {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(74, 158, 255, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.start-button:active {
  transform: scale(0.98);
}

.start-button.disabled {
  opacity: 0.6;
  transform: none;
}

/* 加载状态 */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { 
    transform: rotate(360deg); 
  }
}

/* 移动端优化 */
@media screen and (max-width: 480px) {
  .container {
    max-width: 350px;
    padding: 20px 15px 40px;
  }
  
  .date-card {
    padding: 30px 25px;
    border-radius: 25px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .date-icon {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }
}

/* 页面加载动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>