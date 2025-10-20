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
      <view class="signup-card">
        <!-- 标题区域 -->
        <view class="title-section">
          <text class="title">Create Account</text>
          <text class="subtitle">Join thousands preparing for their driving theory test</text>
        </view>
        
        <!-- 错误/成功消息 -->
        <view v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </view>
        
        <view v-if="successMessage" class="success-message">
          {{ successMessage }}
        </view>

        <!-- 注册表单 -->
        <view class="signup-form">
          <!-- 邮箱输入 -->
          <view class="input-group">
            <text class="input-label">Email Address</text>
            <input 
              type="email" 
              class="input-field" 
              v-model="signupForm.email"
              placeholder="Enter your email address"
              :disabled="isLoading"
            />
          </view>

          <!-- 密码输入 -->
          <view class="input-group">
            <text class="input-label">Password</text>
            <view class="password-container">
              <input 
                :type="showPassword ? 'text' : 'password'"
                class="input-field" 
                v-model="signupForm.password"
                placeholder="Create a strong password"
                :disabled="isLoading"
                @input="checkPasswordStrength"
              />
              <view 
                class="password-toggle"
                @tap="showPassword = !showPassword"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </view>
            </view>
            
            <!-- 密码强度指示器 -->
            <view v-if="signupForm.password" class="password-strength">
              <view class="strength-bar">
                <view class="strength-fill" :class="passwordStrength.level"></view>
              </view>
              <text class="strength-text">{{ passwordStrength.text }}</text>
            </view>
          </view>

          <!-- 确认密码输入 -->
          <view class="input-group">
            <text class="input-label">Confirm Password</text>
            <view class="password-container">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'"
                class="input-field" 
                v-model="signupForm.confirmPassword"
                placeholder="Confirm your password"
                :disabled="isLoading"
              />
              <view 
                class="password-toggle"
                @tap="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </view>
            </view>
          </view>

          <!-- 条款同意 -->
          <view class="terms-section">
            <view class="terms-checkbox" @tap="!isLoading && (signupForm.agreeTerms = !signupForm.agreeTerms)">
              <view class="checkbox" :class="{checked: signupForm.agreeTerms}"></view>
              <view class="terms-text">
                I agree to the <text class="terms-link" @tap.stop="toTerms">Terms of Service</text> 
                and <text class="terms-link" @tap.stop="toPrivacy">Privacy Policy</text>
              </view>
            </view>
          </view>

          <!-- 注册按钮 -->
          <view 
            class="signup-button"
            :class="{disabled: isLoading || !isFormValid}"
            @tap="handleSignUp"
          >
            <view v-if="isLoading" class="loading"></view>
            <text>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</text>
          </view>
        </view>

        <!-- 分割线 -->
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">or sign up with</text>
          <view class="divider-line"></view>
        </view>

        <!-- 社交注册 -->
        <!-- 社交登录 - 标准设计 -->
        <view class="social-login">
          <!-- Google 登录按钮 -->
          <view class="google-button" :class="{disabled: isLoading}" @tap="handleSocialLogin('google')">
            <view class="google-icon"></view>
            <text>Create with Google</text>
          </view>
          
          <!-- Apple 登录按钮 -->
          <view class="apple-button" :class="{disabled: isLoading}" @tap="handleSocialLogin('apple')">
            <u-icon name="apple-fill" color="#fff" size="28"></u-icon>
            <text>Create with Apple</text>
          </view>
        </view>

        <!-- 登录链接 -->
        <view class="login-section">
          <text class="login-text">Already have an account?</text>
          <text class="login-link" @tap="goToLogin">Sign In</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {register} from '@/http/api/login'
export default {
  data() {
    return {
      isLoading: false, // 注册加载状态
      showPassword: false, // 密码显示状态
      showConfirmPassword: false, // 确认密码显示状态
      errorMessage: '', // 错误消息
      successMessage: '', // 成功消息
      signupForm: {
        email: '', // 用户邮箱
        password: '', // 用户密码
        confirmPassword: '', // 确认密码
        agreeTerms: false // 同意条款
      },
      passwordStrength: {
        level: 'weak',
        text: 'Weak password'
      }
    }
  },
  computed: {
    // 表单验证状态
    isFormValid() {
      return this.signupForm.email.trim() &&
             this.signupForm.password.length >= 6 &&
             this.signupForm.password === this.signupForm.confirmPassword &&
             this.signupForm.agreeTerms;
    }
  },
  methods: {
    // 处理注册提交
    async handleSignUp() {
      if (this.isLoading || !this.isFormValid) return;
      
      this.clearMessages();
      
      // 基本验证
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;

      try {

        const userInfo = await this.signUpWithApi();
        // 缓存用户信息
        uni.setStorageSync('userInfo', userInfo);
        uni.setStorageSync('token', userInfo.token);
        // 注册成功处理
        this.successMessage = 'Account created successfully! Redirecting...';
        console.log('Sign up successful:', this.signupForm);
        
        // 延迟跳转以显示成功消息
        setTimeout(() => {
          uni.showToast({
            title: 'Account created!',
            icon: 'success'
          });
          
          // 跳转到登录页面
          uni.redirectTo({
            url: '/pages/login/registerStepQuestion'
          });
        }, 1500);
        
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // 表单验证
    validateForm() {
      if (!this.signupForm.email.trim()) {
        this.errorMessage = 'Please enter your email address';
        return false;
      }
      
      if (!this.isValidEmail(this.signupForm.email)) {
        this.errorMessage = 'Please enter a valid email address';
        return false;
      }
      
      if (!this.signupForm.password.trim()) {
        this.errorMessage = 'Please enter a password';
        return false;
      }
      
      if (this.signupForm.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters';
        return false;
      }
      
      if (this.signupForm.password !== this.signupForm.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return false;
      }
      
      if (!this.signupForm.agreeTerms) {
        this.errorMessage = 'Please agree to the Terms of Service and Privacy Policy';
        return false;
      }
      
      return true;
    },

    // 邮箱格式验证
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // 检查密码强度
    checkPasswordStrength() {
      const password = this.signupForm.password;
      let score = 0;
      
      // 长度检查
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      
      // 字符类型检查
      if (/[a-z]/.test(password)) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
      
      if (score <= 2) {
        this.passwordStrength = { level: 'weak', text: 'Weak password' };
      } else if (score <= 4) {
        this.passwordStrength = { level: 'medium', text: 'Medium strength' };
      } else {
        this.passwordStrength = { level: 'strong', text: 'Strong password' };
      }
    },

    // 清除消息
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },

    // 返回上一页
    goBack() {
      uni.navigateBack({
        fail: () => {
          console.log('No previous page, navigate to login');
          uni.redirectTo({
            url: '/pages/login/login'
          });
        }
      });
    },

    // 跳转到登录页面
    goToLogin() {
      console.log('Navigate to login page');
      uni.redirectTo({
        url: '/pages/login/index'
      });
    },

    // 显示服务条款
    showTerms() {
      console.log('Show Terms of Service');
      uni.showModal({
        title: 'Terms of Service',
        content: 'Terms of Service content will be displayed here.',
        showCancel: false
      });
    },
    toTerms () {
      uni.navigateTo({
        url: '/pages/my/terms'
      })
    },
    toPrivacy () {
      uni.navigateTo({
        url: '/pages/my/privacy'
      })
    },
    // 显示隐私政策
    showPrivacy() {
      console.log('Show Privacy Policy');
      uni.showModal({
        title: 'Privacy Policy',
        content: 'Privacy Policy content will be displayed here.',
        showCancel: false
      });
    },

    // 处理社交注册
    handleSocialSignUp(provider) {
      if (this.isLoading) return;
      
      console.log(`Social sign up with ${provider}`);
      this.clearMessages();
      
      this.successMessage = `Connecting with ${provider}...`;
      
      setTimeout(() => {
        uni.showToast({
          title: `${provider} sign up will be implemented`,
          icon: 'none'
        });
        this.clearMessages();
      }, 2000);
    },

    // 模拟API调用延迟
    simulateApiCall() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟注册验证
          if (this.signupForm.email && this.signupForm.password) {
            resolve();
          } else {
            reject(new Error('Registration failed'));
          }
        }, 2000);
      });
    },

    // 真实API调用示例
    async signUpWithApi() {
      try {
        const response = await register({
          email: this.signupForm.email,
          password: this.signupForm.password
        })
        
        if (response.code !== 1) {
          throw new Error(response.msg || 'Registration failed');
        }

        return response.data;

      } catch (error) {
        throw error;
      }
    }
  },

  onLoad() {
    // 页面加载完成后的初始化
    console.log('Sign up page loaded');
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
  padding: 10px 20px;
  display: flex;
  align-items: center;
  background: transparent;
  position: relative;
  z-index: 10;
  min-height: 50px;
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
  padding: 10px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 10;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

/* 注册卡片 */
.signup-card {
  background: white;
  border-radius: 25px;
  padding: 25px 25px;
  box-shadow: 0 12px 35px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

.signup-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4A9EFF 0%, #2196F3 100%);
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 6px;
  display: block;
}

.subtitle {
  font-size: 14px;
  color: #666;
  line-height: 1.3;
  display: block;
}

/* 表单样式 */
.signup-form {
  margin-bottom: 15px;
}

.input-group {
  margin-bottom: 14px;
}

.input-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: block;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 100%;
  padding: 14px 18px;
  border: 2px solid #F0F0F0;
  border-radius: 16px;
  font-size: 15px;
  background: #FAFAFA;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #4A9EFF;
  background: white;
  box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.08);
}

/* 密码输入框容器 */
.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.password-toggle:active {
  background: #F5F5F5;
}

/* 密码强度指示器 */
.password-strength {
  margin-top: 6px;
  margin-bottom: 3px;
}

.strength-bar {
  height: 3px;
  background: #F0F0F0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: #FF6B6B;
  width: 30%;
}

.strength-fill.medium {
  background: #FFB74D;
  width: 60%;
}

.strength-fill.strong {
  background: #4CAF50;
  width: 100%;
}

.strength-text {
  font-size: 11px;
  color: #666;
}

/* 条款同意 */
.terms-section {
  margin-bottom: 18px;
  margin-top: 3px;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #4A9EFF;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.3s ease;
  margin-top: 1px;
  flex-shrink: 0;
}

.checkbox.checked {
  background: #4A9EFF;
}

.checkbox.checked::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.terms-text {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.terms-link {
  color: #4A9EFF;
  font-weight: 600;
}

.terms-link:active {
  color: #2196F3;
}

/* 注册按钮 */
.signup-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(74, 158, 255, 0.35);
  transition: all 0.3s ease;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.signup-button:active {
  transform: scale(0.98);
}

.signup-button.disabled {
  opacity: 0.6;
  transform: none;
}

/* 分割线 */
.divider {
  display: flex;
  align-items: center;
  margin: 15px 0;
  gap: 12px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #E0E0E0;
}

.divider-text {
  font-size: 13px;
  color: #999;
  font-weight: 500;
}

/* 社交注册按钮 */
.social-signup {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.social-button {
  flex: 1;
  padding: 12px;
  border: 2px solid #F0F0F0;
  border-radius: 14px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
}

.social-button:active {
  border-color: #4A9EFF;
  background: #F8FBFF;
  transform: scale(0.98);
}

.social-icon {
  font-size: 16px;
}

/* 登录链接 */
.login-section {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.login-text {
  font-size: 14px;
  color: #666;
}

.login-link {
  color: #4A9EFF;
  font-weight: 700;
  margin-left: 4px;
  transition: all 0.3s ease;
}

.login-link:active {
  color: #2196F3;
}

/* 加载状态 */
.loading {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 6px;
}

@keyframes spin {
  to { 
    transform: rotate(360deg); 
  }
}

/* 错误消息 */
.error-message {
  background: #FFE5E5;
  color: #D32F2F;
  padding: 12px 15px;
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: 18px;
  border: 1px solid #FFCDD2;
  font-weight: 500;
}

/* 成功消息 */
.success-message {
  background: #E8F5E8;
  color: #2E7D32;
  padding: 12px 15px;
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: 18px;
  border: 1px solid #C8E6C9;
  font-weight: 500;
}

/* 移动端优化 */
@media screen and (max-width: 480px) {
  .container {
    max-width: 350px;
    padding: 10px 15px 20px;
  }
  
  .signup-card {
    padding: 22px 20px;
    border-radius: 20px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .input-field {
    padding: 13px 16px;
  }
  
  .signup-button {
    padding: 14px;
  }
  
  .social-signup {
    gap: 8px;
  }
}

/* 页面加载动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 社交登录按钮 - 标准设计 */
.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

/* Google 登录按钮 - 标准样式 */
.google-button {
  width: 100%;
  height: 50px;
  background: white;
  border: 1px solid #DADCE0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #3c4043;
  transition: all 0.2s ease;
}

.google-button:active {
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
  background: #fafafa;
}

.google-button.disabled {
  opacity: 0.38;
}

.google-icon {
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPHBhdGggZD0iTTE3LjY0IDkuMjA0NTVjMC0uNjM5NDUtLjA1NzI3LTEuMjUzNjQtLjE2MzY0LTEuODQwOTFIOXY0LjEzNjM2aDQuODQ0NTVjLS4yMDQ1NSAxLjEwNDU1LS44Mjc3MyAyLjAzMTgyLTEuNzYzNjQgMi42NTY4MnY1LjE4MTgySDEzLjhWMTBzMCAwIDAtMWMxLjMxODY4LTEuMzI5MjggMi45ODg2NC0yLjEwNjczIDMuNzEwOTEtMi4xMDY3My4zNjM2NC0uMDkzNjQuODAyMjgtLjE2MjcgMS4yOTU0NS0uMjM5MDl6bS00LjMxODk1IDYuNjU0MDl2Mi4zNTQ1NWgtLjE3MjczYzEuNzU2ODItLjM2MTc0IDMuNDY4MTgtMS4yNzY3NCA0Ljg5MDkxLTIuNjIwNDVWMTUuMjVsLS4yNDEzOS0uMzA0NTVjLS40ODI3My43NDU0NS0xLjEwOTA5IDEuMzg1NDUtMS44NzI3MyAxLjg2MzY0LS4yNjI3My4xNjM2NC0uNjE4MTgtLjE2MzY0LTEuMDMwNDUtMS4wNzI3M3oiIGZpbGw9IiM0Mjg1RjQiLz4KICAgIDxwYXRoIGQ9Ik05IDE4YzIuNDMgMCA0LjQ2NzI3LS43OTM2NCA1Ljk1NjM2LTIuMTVsLTIuOTEzNjQtMi4yNDU0NUMxMC40MjE4MiAxNC42IDkuNzM2MzYgMTQuNzY3MjcgOSAxNC43NjcyN2MtMi4zMDk4MSAwLTQuMjUwMy0uNDU0NTUtNS45NDMxOC0xLjM4NTQ1TDUuMTc2MzYgMTEuNWMtLjMwNTA5LS4yNTkwOS0uNjE1OTEtLjUzNjM2LS45MTA5MS0uODM2MzZsLTIuNzgxODIgMi4xNTQ1NkMuMTI0NzMgMTUuNDk0IDQuMTI1IDI5IDkgMTh6IiBmaWxsPSIjMzRBODUzIi8+CiAgICA8cGF0aCBkPSJNMyA5YzAtMS4zOTA5MS4yNzI3My0yLjcxODE4Ljc2MzY0LTMuOTUxODJsLTIuNzgxODItMi4xNTQ1NXYyLjE1NDU1aC0uMDQzNjRjLS42NTkwOSAxLjIyNzI3LTEuMDM2MzYgMi42NDU0NS0xLjAzNjM2IDQuMTQ3MjdzLjM3NzI3IDIuOTE5MSAxLjAzNjM2IDQuMTQ3MjdsMi44MjU0NS0yLjE5ODkxQzMuMjcyNzMgMTEuNzE4MTggMyAxMC4zOTA5MSAzIDl6IiBmaWxsPSIjRkJCQzA1Ii8+CiAgICA8cGF0aCBkPSJNOSAzLjIzMTgyYzEuMjc1IDAgMi40MjMuNDY1IDMuMzE0IDEuMzk1bDIuNDg1LTIuNDc1QzEzLjQ2NS4yNzUgMTEuNDE5IDAgOSAwIDQuMTI1IDAgLjMxODc4IDMuNjc1IDAgOGwyLjc4MTgyIDIuMTU0NTVDNC43NDk3IDguNDU0NTUgNi42OTAyIDMuMjMxODIgOSAzLjIzMTgyeiIgZmlsbD0iI0VBNDMzNSIvPgogIDwvZz4KICA8L3N2Zz4K");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Apple 登录按钮 - 标准样式 */
.apple-button {
  width: 100%;
  height: 50px;
  background: #000;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
  transition: all 0.2s ease;
}

.apple-button:active {
  transform: scale(0.98);
  background: #333;
}

.apple-button.disabled {
  opacity: 0.6;
  transform: none;
  background: #666;
}

.apple-icon {
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyMCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTUuNjM0NSA2LjA5MjczQzE2LjUxNzEgNS4xNzI3MyAxNy4wNjI2IDMuODQzNjQgMTYuOTI2MiAyLjVDMTUuNzQwOCAyLjU4MTgyIDE0LjMzNzQgMy4yNTQ1NSAxMy40MjcxIDQuMjA5MDlDMTIuNTk5MSA1LjA2MzY0IDEyLjAzNTQgNi4zOTI3MyAxMi4xOTkgNy43MjcyN0MxMy41NDg0IDcuODQ1NDUgMTQuOTQzNiA3LjEwOTA5IDE1LjYzNDUgNi4wOTI3M1oiIGZpbGw9IndoaXRlIi8+CiAgPHBhdGggZD0iTTE3LjgxMDQgOC43MTgxOEMxNi4wNzc4IDcuODA5MDkgMTUuNjQzNiA1LjU4MTgyIDE3LjEwNzIgNC4yNzcyN0MxNy41NTk2IDMuNjkwOTEgMTguNzk5NSAzLjE5MDkxIDIwLjA3NTYgMy4xOTA5MUMyMC4xNjY5IDQuMjU5MDkgMTkuNzY4NyA5LjMzNjM2IDE5LjA3NzggNi4wODQ1NUMxOC4yNzI0IDYuOTY4MTggMTcuMDE0MSA3LjQ1IDEzIDdMMTUuNjI1IDguNjM2MzZDMTYuNjAzMSA4LjMzNjM2IDE3LjIzMDQgOC44NTQ1NSAxNy44MTA0IDguNzE4MThaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>