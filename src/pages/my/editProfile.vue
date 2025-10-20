<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- Header -->
    <view class="header">
      <text class="cancel-button" @tap="cancelEdit">Cancel</text>
      <text class="page-title">Edit Profile</text>
      <text class="save-button" @tap="saveProfile" :class="{disabled: !hasChanges}">Save</text>
    </view>

    <!-- Main Content -->
    <view class="container">
      <!-- Avatar Section -->
      <view class="avatar-section">
        <view class="avatar-container">
          <view class="avatar">
            <text v-if="!formData.avatar">{{ userInitial }}</text>
            <image v-else :src="formData.avatar" mode="aspectFill"></image>
          </view>
          <view class="avatar-edit-button" @tap="showAvatarModal = true">
            <view class="avatar-edit-icon">👤</view>
          </view>
        </view>
        <text class="change-avatar-text">Change Photo</text>
      </view>

      <!-- Basic Information -->
      <view class="form-card">
        <view class="section-title">Basic Information</view>
        
        <view class="input-group">
          <text class="input-label">Username</text>
          <input type="text" 
                 class="input-field" 
                 v-model="formData.nickname"
                 placeholder="Enter your username"
                 maxlength="20" />
          <text class="char-counter">{{ formData.nickname.length }}/20</text>
        </view>

        <view class="input-group">
          <text class="input-label">Email</text>
          <input type="email" 
                 class="input-field" 
                 v-model="formData.email"
                 placeholder="your@email.com"
                 disabled />
        </view>

        <view class="input-group">
          <text class="input-label">Bio</text>
          <textarea class="input-field textarea-field" 
                    v-model="formData.bio"
                    placeholder="Tell us about yourself..."
                    maxlength="100"></textarea>
          <text class="char-counter">{{ formData.bio.length }}/100</text>
        </view>
      </view>

      <!-- Test Information -->
      <view class="form-card">
        <view class="section-title">Test Information</view>
        
        <view class="input-group">
          <text class="input-label">Test Centre</text>
          <view class="select-field" @tap="showTestCentreModal = true">
            <view class="select-display">
              <text>{{ formData.testCentreName || 'Select a test centre' }}</text>
              <text class="select-arrow">›</text>
            </view>
          </view>
        </view>

        <view class="input-group">
          <text class="input-label">Test Date</text>
          <view class="date-picker">
            <picker mode="date" 
                    :value="formData.test_date" 
                    :start="minDate"
                    @change="onDateChange">
              <view class="date-input">
                <text>{{ displayTestDate }}</text>
                <text class="date-icon">📅</text>
              </view>
            </picker>
          </view>
        </view>

        <view class="input-group">
          <text class="input-label">Preparation Level</text>
          <view class="select-field" @tap="showLevelModal = true">
            <view class="select-display">
              <text>{{ formData.level }}</text>
              <text class="select-arrow">›</text>
            </view>
          </view>
        </view>

        <!-- Test Date Reminder Toggle -->
        <view class="toggle-group toggle-group-top">
          <text class="toggle-label">Test Date Reminder</text>
          <view class="toggle-switch" 
                :class="{active: formData.testDateReminder}"
                @tap="formData.testDateReminder = !formData.testDateReminder"></view>
        </view>
      </view>

      <!-- Account Actions -->
      <view class="form-card">
        <view class="section-title">Account</view>
        
        <view class="action-button sign-out-button" @tap="signOut">
          <text class="button-text">Sign Out</text>
        </view>
        
        <view class="action-button delete-account-button" @tap="deleteAccount">
          <text class="button-text delete-text">Delete Account</text>
        </view>
      </view>
    </view>

    <!-- Test Centre Selection Modal -->
    <view v-if="showTestCentreModal" class="modal-backdrop" @tap.self="showTestCentreModal = false">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">Select Test Centre</text>
          <text class="modal-close" @tap="showTestCentreModal = false">✕</text>
        </view>
        <scroll-view scroll-y class="option-scroll">
          <view class="option-list">
            <view v-for="centre in testCentres" 
                  :key="centre"
                  class="option-item"
                  :class="{selected: formData.room_id === centre.id}"
                  @tap="selectTestCentre(centre)">
              <text class="option-text">{{ centre.name }}</text>
              <view class="option-check"></view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- Preparation Level Modal -->
    <view v-if="showLevelModal" class="modal-backdrop" @tap.self="showLevelModal = false">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">Select Preparation Level</text>
          <text class="modal-close" @tap="showLevelModal = false">✕</text>
        </view>
        <view class="option-list">
          <view v-for="level in levels" 
                :key="level"
                class="option-item"
                :class="{selected: formData.level === level}"
                @tap="selectLevel(level)">
            <text class="option-text">{{ level }}</text>
            <view class="option-check"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- Avatar Options Modal -->
    <view v-if="showAvatarModal" class="modal-backdrop" @tap.self="showAvatarModal = false">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">Change Photo</text>
          <text class="modal-close" @tap="showAvatarModal = false">✕</text>
        </view>
        <view class="avatar-options">
          <view class="avatar-option" @tap="takePhoto">
            <text>📷 Take Photo</text>
          </view>
          <view class="avatar-option" @tap="chooseFromGallery">
            <text>🖼️ Choose from Gallery</text>
          </view>
          <view class="avatar-option" @tap="removePhoto" v-if="formData.avatar">
            <text>🗑️ Remove Photo</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Success Toast -->
    <view v-if="showSuccessToast" class="success-toast">
      <text class="toast-text">Profile Updated Successfully!</text>
    </view>
    
    <u-modal :show="modalShow" :title="modalTitle" :showCancelButton="true" :content='modalContent' :cancelText="cancelText" :confirmText="confirmText" @cancel="cancel" @confirm="confirm"></u-modal>
    
  </view>
</template>

<script>
import {getUserInfo, saveInfo} from '@/http/api/login.js'
import {getCenterIndex} from '@/http/api/community.js'
export default {
  data() {
    return {
      // 原始数据 - 用于检测变化
      originalData: {},
      
      // 表单数据
      formData: {
        nickname: '',
        email: null,
        bio: '',
        avatar: '',
        room_id: null,
        test_date: null,
        level: null,
        testDateReminder: true,
        testCentreName: null
      },
      
      // 模态框状态
      showTestCentreModal: false,
      showLevelModal: false,
      showAvatarModal: false,
      showSuccessToast: false,
      
      // 选项数据
      testCentres: [],
      
      levels: [
        'Beginner',
        'Elementary',
        'Intermediate',
        'Advanced',
        'Ready for Test'
      ],
      modalShow: false,
      modalTitle: '',
      modalType: '',
      modalContent: '',
      cancelText: 'Cancel',
      confirmText: 'Confirm'
    }
  },
  
  computed: {
    // 获取用户名首字母
    userInitial() {
      return this.formData.nickname ? this.formData.nickname.charAt(0).toUpperCase() : 'U';
    },
    
    // 检查是否有更改
    hasChanges() {
      return JSON.stringify(this.formData) !== JSON.stringify(this.originalData);
    },
    
    // 最小日期 - 今天
    minDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    displayTestDate() {
      const formatted = this.$utils.formatDateToDDMMYYYY(this.formData.test_date);
      return formatted || 'Select date';
    }
  },
  
  methods: {
    // 获取用户信息
    getUserInfo () {
      getUserInfo().then(res => {
        if (res.code == 1) {
          this.formData = {
            nickname: res.data.nickname,
            email: res.data.email,
            bio: res.data.bio,
            avatar: res.data.avatar,
            room_id: res.data.room_id,
            test_date: res.data.test_date,
            level: res.data.level,
            testDateReminder: true
          }
          // 判断当前考试中心
          if (this.formData.room_id) {
            this.formData.testCentreName = this.testCentres.find(centre => centre.id == this.formData.room_id).name;
          }
        }
      })
    },
    // 日期变化
    onDateChange(e) {
      this.formData.test_date = e.detail.value;
    },
    
    // 选择测试中心
    selectTestCentre(centre) {
      this.formData.room_id = centre.id;
      this.formData.testCentreName = centre.name;
      this.showTestCentreModal = false;
    },
    
    // 选择准备级别
    selectLevel(level) {
      this.formData.level = level;
      this.showLevelModal = false;
    },
    
    // 拍照
    takePhoto() {
      const that = this;
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: async (res) => {
          that.showAvatarModal = false;
          const filePath = res.tempFilePaths[0]
          const urlRes = await this.$utils.upload(filePath)
          if (urlRes.code == 1) {
            // this.uploadedImages.push(urlRes.data.fullurl)
            that.formData.avatar = urlRes.data.fullurl;
          }
        },
        fail: (err) => {
          console.error('Failed to take photo:', err);
        }
      });
    },
    
    // 从相册选择
    chooseFromGallery() {
      const that = this;
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: async (res) => {
          that.showAvatarModal = false;
          const filePath = res.tempFilePaths[0]
          const urlRes = await this.$utils.upload(filePath)
          if (urlRes.code == 1) {
            // this.uploadedImages.push(urlRes.data.fullurl)
            that.formData.avatar = urlRes.data.fullurl;
          }
        },
        fail: (err) => {
          console.error('Failed to choose from gallery:', err);
        }
      });
    },
    
    // 移除照片
    removePhoto() {
      this.formData.avatar = '';
      this.showAvatarModal = false;
    },
    
    // 保存配置
    async saveProfile() {
      if (!this.hasChanges) return;
      
      console.log('Saving profile...', this.formData);
      
      try {
        // 实际应用中调用API保存数据
        uni.showLoading({
          title: 'Saving...'
        });
        
        // 模拟API调用
        await saveInfo({
          ...this.formData
        });
        
        uni.hideLoading();
        
        // 更新原始数据
        this.originalData = JSON.parse(JSON.stringify(this.formData));
        this.showSuccessToast = true;
        
        setTimeout(() => {
          this.showSuccessToast = false;
          // 返回上一页
          this.goBack();
        }, 2000);
        
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: 'Save failed',
          icon: 'none'
        });
        console.error('Failed to save profile:', error);
      }
    },
    confirm () {
      this.modalShow = false
      if (this.modalType == 'UnsavedChanges') {
        this.goBack();
      } else if (this.modalType == 'SignOut') {
        uni.clearStorageSync();
        // 跳转到登录页
        uni.reLaunch({
          url: '/pages/login/index'
        });
      } else if (this.modalType == 'DeleteAccount') {
        this.modalShow = true
        this.modalTitle =  'Final Confirmation'
        this.modalType = 'FinalConfirmation'
        this.modalContent = 'This will permanently delete all your data. Are you absolutely sure?'
      } else if (this.modalType == 'FinalConfirmation') {
        uni.showToast({
          title: 'Account deleted',
          icon: 'success'
        });
      }
    },
    cancel () {
      this.modalShow = false
    },
    // 取消编辑
    cancelEdit() {
      if (this.hasChanges) {
        // uni.showModal({
        //   title: 'Unsaved Changes',
        //   content: 'You have unsaved changes. Are you sure you want to cancel?',
        //   success: (res) => {
        //     if (res.confirm) {
        //       this.goBack();
        //     }
        //   }
        // });
        
        this.modalShow = true
        this.modalTitle =  'Unsaved Changes'
        this.modalType = 'UnsavedChanges'
        this.modalContent = 'You have unsaved changes. Are you sure you want to cancel?'

      } else {
        this.goBack();
      }
    },
    
    // 登出
    signOut() {
      
      this.modalShow = true
      this.modalTitle =  'Sign Out'
      this.modalType = 'SignOut'
      this.modalContent = 'Are you sure you want to sign out?'
      
      // uni.showModal({
      //   title: 'Sign Out',
      //   content: 'Are you sure you want to sign out?',
      //   success: (res) => {
      //     if (res.confirm) {
      //       console.log('Signing out...');
      //       // 清除本地存储
      //       uni.clearStorageSync();
      //       // 跳转到登录页
      //       uni.reLaunch({
      //         url: '/pages/login/index'
      //       });
      //     }
      //   }
      // });
    },
    
    // 删除账号
    deleteAccount() {
      
      this.modalShow = true
      this.modalTitle =  'Delete Account'
      this.modalType = 'DeleteAccount'
      this.modalContent = 'Are you sure you want to delete your account? This action cannot be undone.'
      
      // uni.showModal({
      //   title: 'Delete Account',
      //   content: 'Are you sure you want to delete your account? This action cannot be undone.',
      //   success: (res) => {
      //     if (res.confirm) {
      //       uni.showModal({
      //         title: 'Final Confirmation',
      //         content: 'This will permanently delete all your data. Are you absolutely sure?',
      //         success: (res2) => {
      //           if (res2.confirm) {
      //             console.log('Deleting account...');
      //             // 实际应用中调用API删除账号
      //             uni.showToast({
      //               title: 'Account deleted',
      //               icon: 'success'
      //             });
      //           }
      //         }
      //       });
      //     }
      //   }
      // });
    },
    
    // 返回上一页
    goBack() {
      console.log('Going back to profile page...');
      uni.navigateBack({
        delta: 1
      });
    },
    // 查询考场
    getCenterIndex() {
      getCenterIndex().then(res => {
        if (res.code == 1) {
          this.testCentres = res.data.list
        }
        this.getUserInfo()
      })
    }
  },
  
  onLoad() {
    this.getCenterIndex()
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 全局重置样式 */
page {
  background: #F8F9FA;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #333;
}

/* 渐变背景 - 与主题保持一致 */
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

.cancel-button {
  color: #666;
  font-size: 32rpx;
  padding: 16rpx;
  font-weight: 500;
}

.page-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
}

.save-button {
  color: #4A9EFF;
  font-size: 32rpx;
  padding: 16rpx;
  font-weight: 600;
  transition: opacity 0.3s;
  
  &.disabled {
    opacity: 0.5;
  }
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

/* 头像编辑区域 */
.avatar-section {
  text-align: center;
  margin-bottom: 60rpx;
}

.avatar-container {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  margin: 0 auto 30rpx;
}

.avatar {
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 96rpx;
  color: white;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16rpx 50rpx rgba(0,0,0,0.1);
  
  image {
    width: 100%;
    height: 100%;
  }
}

.avatar-edit-button {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 72rpx;
  height: 72rpx;
  background: #4A9EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.2);
}

.avatar-edit-icon {
  font-size: 36rpx;
  color: white;
}

.change-avatar-text {
  color: #4A9EFF;
  font-size: 28rpx;
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

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #F0F0F0;
  width: 100%;
}

/* 输入组 */
.input-group {
  margin-bottom: 40rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.input-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 28rpx 32rpx;
  border: 4rpx solid #F0F0F0;
  border-radius: 24rpx;
  font-size: 32rpx;
  color: #333;
  transition: all 0.3s;
  background: #FAFAFA;
  height: 100%;
  &:focus {
    border-color: #4A9EFF;
    background: white;
  }
  
  &:disabled {
    background: #F5F5F5;
    color: #999;
  }
}

.textarea-field {
  min-height: 160rpx;
  font-family: inherit;
}

.char-counter {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 10rpx;
}

/* 选择器样式 */
.select-field {
  position: relative;
}

.select-display {
  width: 100%;
  padding: 28rpx 32rpx;
  border: 4rpx solid #F0F0F0;
  border-radius: 24rpx;
  font-size: 32rpx;
  color: #333;
  background: #FAFAFA;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.select-arrow {
  color: #999;
  font-size: 36rpx;
}

/* 日期选择器 */
.date-picker {
  position: relative;
}

.date-input {
  width: 100%;
  padding: 28rpx 32rpx;
  border: 4rpx solid #F0F0F0;
  border-radius: 24rpx;
  font-size: 32rpx;
  color: #333;
  background: #FAFAFA;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-icon {
  font-size: 32rpx;
}

/* 切换开关 */
.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1px solid #F5F5F5;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.toggle-group-top {
    margin-top: 40rpx;
    padding-top: 40rpx;
    border-top: 1px solid #F0F0F0;
    border-bottom: none;
  }
}

.toggle-label {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.toggle-switch {
  width: 104rpx;
  height: 64rpx;
  background: #E0E0E0;
  border-radius: 32rpx;
  position: relative;
  transition: background 0.3s;
  
  &.active {
    background: #4A9EFF;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 52rpx;
    height: 52rpx;
    background: white;
    border-radius: 50%;
    top: 6rpx;
    left: 6rpx;
    transition: transform 0.3s;
    box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.2);
  }
  
  &.active::after {
    transform: translateX(40rpx);
  }
}

/* 操作按钮 */
.action-button {
  width: 100%;
  padding: 32rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  transition: all 0.3s;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.button-text {
  color: white;
  
  &.delete-text {
    color: #FF6B6B;
  }
}

.sign-out-button {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  box-shadow: 0 12rpx 40rpx rgba(74, 158, 255, 0.35);
}

.delete-account-button {
  background: transparent;
  border: 4rpx solid #FF6B6B;
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
  position: relative;
}

.modal-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
}

.modal-close {
  position: absolute;
  right: 0;
  top: 0;
  color: #999;
  font-size: 40rpx;
  padding: 10rpx 20rpx;
}

/* 选项列表 */
.option-scroll {
  max-height: 70vh;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.option-item {
  padding: 30rpx;
  background: #F8F9FA;
  border-radius: 24rpx;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &.selected {
    background: #E8F3FF;
    border: 4rpx solid #4A9EFF;
    padding: 26rpx;
  }
}

.option-text {
  font-size: 32rpx;
  color: #333;
}

.option-check {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 4rpx solid #4A9EFF;
  display: none;
  align-items: center;
  justify-content: center;
  
  .option-item.selected & {
    display: flex;
    
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background: #4A9EFF;
      border-radius: 50%;
    }
  }
}

/* 头像选择模态框 */
.avatar-options {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.avatar-option {
  padding: 32rpx;
  background: white;
  border: 4rpx solid #F0F0F0;
  border-radius: 24rpx;
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  transition: all 0.3s;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 成功提示 */
.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.8);
  padding: 30rpx 60rpx;
  border-radius: 50rpx;
  z-index: 200;
  animation: fadeInOut 2s ease;
}

.toast-text {
  color: white;
  font-size: 32rpx;
}

/* 动画 */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

/* 响应式优化 */
@media screen and (max-width: 375px) {
  .container {
    padding: 30rpx;
  }
  
  .form-card {
    padding: 40rpx;
  }
  
  .avatar-container {
    width: 200rpx;
    height: 200rpx;
  }
  
  .avatar {
    width: 200rpx;
    height: 200rpx;
    font-size: 80rpx;
  }
}
</style>