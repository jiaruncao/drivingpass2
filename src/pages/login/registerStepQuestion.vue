<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <view class="container">
      <view class="selection-card">
        <!-- 标题区域 -->
        <view class="title-section">
          <text class="title">Choose Your License Type</text>
          <text class="subtitle">Select the type of driving license you're studying for</text>
        </view>

        <!-- 驾照类型按钮 -->
        <view class="buttons-container">
          <view 
            v-for="licenseType in licenseTypes" 
            :key="licenseType"
            class="license-button"
            :class="{selected: selectedType === licenseType}"
            @tap="selectType(licenseType)"
          >
            <text>{{ licenseType }}</text>
          </view>
        </view>

        <!-- 继续按钮 -->
        <view 
          class="continue-button"
          :class="{disabled: !selectedType || isLoading}"
          @tap="handleContinue"
        >
          <view v-if="isLoading" class="loading"></view>
          <text>{{ isLoading ? 'Loading...' : 'Continue' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {choiceLicenseType} from '@/http/api/login.js'
export default {
  data() {
    return {
      selectedType: null, // 选中的驾照类型
      isLoading: false, // 加载状态
      licenseTypes: ['Car', 'Motorcycle', 'ADI', 'LGV', 'PCV'] // 驾照类型列表
    }
  },
  methods: {
    // 选择驾照类型
    selectType(type) {
      this.selectedType = type;
      console.log('Selected license type:', type);
    },

    // 处理继续按钮
    async handleContinue() {
      if (!this.selectedType || this.isLoading) return;

      this.isLoading = true;

      try {
        // 模拟保存选择的API调用
        await this.saveLicenseType();

        // 保存成功后跳转到日期选择页面
        console.log('License type saved, navigating to date selection...');
        
        setTimeout(() => {
          uni.showToast({
            title: 'License type saved!',
            icon: 'success'
          });
          
          // 跳转到选择考试日期页面
          uni.navigateTo({
            url: '/pages/login/registerSelectTime?licenseType=' + encodeURIComponent(this.selectedType)
          });
        }, 1000);

      } catch (error) {
        console.error('Failed to save selection:', error);
        uni.showToast({
          title: 'Failed to save selection',
          icon: 'error'
        });
      } finally {
        this.isLoading = false;
      }
    },

    // 模拟API调用 - 保存驾照类型
    async saveLicenseType() {
      
      const response = await choiceLicenseType({
        type: this.selectedType
      });
      if (response.code !== 1) {
        throw new Error(response.msg || 'Choice failed');
      }
      
      return response.data;

    }
  },

  onLoad() {
    // 页面加载完成后的初始化
    console.log('License type selection page loaded');
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

/* 主容器 */
.container {
  flex: 1;
  padding: 40px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 10;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

/* 选择卡片 */
.selection-card {
  background: white;
  border-radius: 30px;
  padding: 35px 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.12);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

.selection-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
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

/* 按钮容器 */
.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

/* 驾照类型按钮 */
.license-button {
  width: 100%;
  padding: 20px;
  background: #FAFAFA;
  border: 2px solid #F0F0F0;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.license-button:active {
  transform: scale(0.98);
}

.license-button.selected {
  border-color: #4A9EFF;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(74, 158, 255, 0.3);
}

.license-button.selected text {
  color: white;
}

/* 继续按钮 */
.continue-button {
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

.continue-button:active {
  transform: scale(0.98);
}

.continue-button.disabled {
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
    padding: 30px 15px 20px;
  }
  
  .selection-card {
    padding: 30px 25px;
    border-radius: 25px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .license-button {
    padding: 18px;
    font-size: 16px;
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