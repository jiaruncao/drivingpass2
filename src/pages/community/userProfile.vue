<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- Header导航栏 -->
    <view class="header">
      <view class="header-left">
        <view class="back-button" @tap="goBack">←</view>
        <text class="header-title">Profile</text>
      </view>
      <view class="header-right">
        <view class="header-button" @tap="shareProfile">
          <text>🔗</text>
        </view>
      </view>
    </view>

    <!-- 主内容容器 -->
    <view class="container">
      <!-- 个人信息卡片 -->
      <view class="profile-card">
        <view class="profile-header">
          <view class="avatar-container">
            <view class="avatar">
              <image v-if="userData.avatar" :src="userData.avatar" mode=""></image>
              <view v-if="!userData.avatar">
                {{userInitial}}
              </view>
            </view>
            <view v-if="userData.verified" class="verified-badge">
              <text class="badge-icon">✓</text>
            </view>
          </view>
          <view class="profile-info">
            <text class="profile-name">{{ userData.nickname }}</text>
            <text class="profile-bio">{{ userData.bio }}</text>
            <view class="test-centre-info">
              <text class="centre-icon">🏢</text>
              <text>{{ userData.room }}</text>
            </view>
          </view>
        </view>
        
        <view class="profile-stats">
          <view class="stat-item">
            <text class="stat-value">{{ userData.posts }}</text>
            <text class="stat-label">Posts</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ userData.follows }}</text>
            <text class="stat-label">Followers</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ userData.following }}</text>
            <text class="stat-label">Following</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ userData.likes }}</text>
            <text class="stat-label">Likes</text>
          </view>
        </view>

        <view class="profile-actions">
          <view class="action-button primary" @tap="toggleFollow">
            {{ userData.is_follow ? 'Following' : 'Follow' }}
          </view>
          <view class="action-button secondary" @tap="sendMessage">Message</view>
        </view>
      </view>

      <!-- Posts标题 -->
      <view class="section-header">
        <text class="section-title">Posts</text>
      </view>

      <!-- 内容列表 -->
      <view class="content-list">
        <view v-if="posts.length > 0">
          <view v-for="post in posts" :key="post.id" class="post-card" @tap="viewPost(post.id)">
            <view class="post-header">
              <view class="post-category">
                <text class="category-icon">{{ post.categoryIcon }}</text>
                <text>{{ post.category }}</text>
              </view>
              <text class="post-time">{{ formatDate(post.createtime) }}</text>
            </view>
            <text class="post-content">{{ post.content }}</text>
            <!-- <view v-if="post.file_url && post.file_url.length > 0" class="post-media">
              <image v-for="(img, index) in post.file_url" 
                     :key="index" 
                     :src="img" 
                     class="post-image"
                     mode="aspectFill">
              </image>
            </view> -->
            <view v-if="post.file_url && post.file_url.length" class="images-grid">
              <view v-for="(image, index) in post.file_url" :key="index" style="width: 100%;">
                <image v-if="['webp', 'png', 'jpg', 'jpeg'].includes(getExtension(image))" :src="image" class="post-image"
                  mode="aspectFill" @tap="viewImage(image)">
                </image>
                <video v-if="['mp4', 'avi'].includes(getExtension(image))" :src="image" :controls="false" :show-play-btn="false"  class="post-video"></video>
              </view>
            </view>
            <!-- 互动栏 -->
            <view class="actions-bar">
              <view class="actions-left">
                <view class="action-button" :class="{liked: post.is_support}" @tap.stop="toggleLike(post)">
                  <view class="action-icon">
                    <u-icon v-if="!post.is_support" name="heart" size="40rpx" color="#999"></u-icon>
                    <u-icon v-if="post.is_support" name="heart-fill" size="40rpx" color="#FF6B6B"></u-icon>
                  </view>
                  <text class="action-count">{{ post.support_count }}</text>
                </view>
                <view class="action-button" @tap.stop="openComments(post.id)">
                  <view class="action-icon">
                    <u-icon name="chat" size="40rpx"></u-icon>
                  </view>
                  <text class="action-count">{{ post.reply_count }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          <text class="empty-icon">📝</text>
          <text class="empty-title">No posts yet</text>
          <text class="empty-desc">This user hasn't shared any posts</text>
        </view>

        <!-- 加载更多 -->
        <view v-if="hasMore && !loading" class="load-more">
          <text>Load more</text>
        </view>
        <view v-if="loading" class="load-more loading">
          <text>Loading...</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {queryUserInfo, userFollowed, supportPost} from '@/http/api/community.js'
export default {
  data() {
    return {
      // 用户数据
      userData: {
        id: 'user123',
        name: 'Sarah Johnson',
        bio: 'Passed theory test first time! Here to help others succeed 🚗',
        avatar: '',
        testCentre: 'Birmingham Test Centre',
        verified: true,
        posts: 45,
        followers: 1234,
        following: 89,
        likes: 5678
      },
      
      // 状态
      isFollowing: false,
      loading: false,
      hasMore: true,
      
      // 帖子数据
      posts: []
    }
  },
  computed: {
    // 获取用户名首字母
    userInitial() {
      return this.userData.nickname ? this.userData.nickname.charAt(0).toUpperCase() : null;
    }
  },
  methods: {
    formatDate (value) {
      return this.$utils.formatDateToDDMMYYYY(value)
    },
    getExtension(url) {
      // 匹配最后一个 '.' 后的内容（包括可能的查询参数）
      const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(?:$|\?|#)/);
    
      // 提取纯净的后缀（不包含查询参数）
      const extension = extensionMatch ? extensionMatch[1] : null;
    
      return extension
    
    },
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          // 如果没有上一页，返回首页
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    },
    
    // 分享个人资料
    shareProfile() {
      // UniApp分享功能
      uni.share({
        provider: 'weixin',
        type: 0,
        title: `${this.userData.name}'s Profile`,
        summary: 'Check out this driving test learning profile!',
        success: () => {
          uni.showToast({
            title: 'Shared successfully',
            icon: 'success'
          });
        },
        fail: () => {
          // 分享失败，复制链接
          uni.setClipboardData({
            data: `User Profile: ${this.userData.name}`,
            success: () => {
              uni.showToast({
                title: 'Link copied',
                icon: 'success'
              });
            }
          });
        }
      });
    },
    
    // 切换点赞状态
    toggleLike(post) {
      // post.isLiked = !post.isLiked;
      // post.likes += post.isLiked ? 1 : -1;
      
      // 触发振动反馈（如果支持）
      // uni.vibrateShort({
      //   success: () => console.log('Vibrate success')
      // });
      
      // 显示提示
      // if (post.isLiked) {
      //   uni.showToast({
      //     title: 'Liked',
      //     icon: 'none',
      //     duration: 1000
      //   });
      // }
      
      // 调用API更新点赞状态
      this.updateLikeStatus(post.id, post);
    },
    
    // 打开评论
    openComments(postId) {
      console.log('Opening comments for post:', postId);
      // 导航到评论页面
      uni.navigateTo({
        url: `/pages/community/detail?id=${postId}`
      });
    },
    
    // 更新点赞状态 
    async updateLikeStatus(postId, post) {
      try {
        const response = await supportPost({
          post_id: postId
        })
        if (response.code === 1) {
          console.log('Like status updated');
          post.is_support = !post.is_support;
          post.support_count += post.is_support ? 1 : -1;
        }
      } catch (error) {
        console.error('Failed to update like status:', error);
        // 失败时恢复原状态
        
      }
    },
    
    // 切换关注状态
    toggleFollow() {
      // 调用API更新关注状态
      this.updateFollowStatus();
    },
    
    // 发送消息
    sendMessage() {
      console.log('Opening message dialog');
      // 导航到消息页面
      // uni.navigateTo({
      //   url: `/pages/message/chat?userId=${this.userData.id}&userName=${this.userData.name}`
      // });
      uni.showToast({
        title: 'Developmenting...',
        icon: 'none',
        duration: 1500
      });
    },
    
    // 加载更多帖子
    loadMore() {
      if (this.loading) return;
      
      this.loading = true;
      // 模拟API调用
      // setTimeout(() => {
      //   // 模拟加载更多数据
      //   const newPosts = [
      //     {
      //       id: Date.now(),
      //       category: 'Question',
      //       categoryIcon: '❓',
      //       content: 'Anyone have tips for remembering stopping distances? I keep getting these wrong in mock tests.',
      //       time: '5 days ago',
      //       likes: 89,
      //       comments: 12,
      //       views: 456
      //     }
      //   ];
      //   this.posts = [...this.posts, ...newPosts];
      //   this.loading = false;
        
      //   // 如果没有更多数据
      //   if (this.posts.length > 10) {
      //     this.hasMore = false;
      //   }
      // }, 1500);
    },
    
    // 更新关注状态
    async updateFollowStatus(follow_user_id) {
      try {
        const response = await userFollowed({
          follow_user_id: this.userId
        });
        if (response.code === 1) {
          this.isFollowing = !this.isFollowing;
          if (this.isFollowing) {
            this.userData.followers++;
            uni.showToast({
              title: 'Followed',
              icon: 'success',
              duration: 1500
            });
          } else {
            this.userData.followers--;
            uni.showToast({
              title: 'Unfollowed',
              icon: 'none',
              duration: 1500
            });
          }
        }
      } catch (error) {
        console.error('Failed to update follow status:', error);
      }
    },
    
    // 获取用户数据
    async fetchUserData() {
      try {
        const response = await queryUserInfo({
          user_id: this.userId
        })
        if (response.code === 1) {
          this.userData = response.data.info;
          this.posts = response.data.posts;
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        uni.showToast({
          title: 'Failed to load profile',
          icon: 'none'
        });
      }
    },
    // 跳转详情
    viewPost (postId) {
      uni.navigateTo({
        url: `/pages/community/detail?id=${postId}`
      });
    }
  },
  onLoad(options) {
    // 获取用户ID参数
    this.userId = options.userId;
    
    // 页面加载时获取数据
    this.fetchUserData();
    // this.fetchPosts();
    
    console.log('Profile page loaded for user:', this.userId);
  },
  onPullDownRefresh() {
    // 下拉刷新
    console.log('Refreshing profile...');
    // this.fetchUserData();
    // this.fetchPosts();
    
    // 模拟刷新完成
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom() {
    // 触底加载更多
    // if (this.hasMore && !this.loading) {
    //   this.loadMore();
    // }
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
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #333;
  background: #f5f5f5;
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

/* Header样式 */
.header {
  padding: 30rpx 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  position: relative;
  z-index: 10;
  min-height: 120rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.back-button {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 40rpx;
}

.back-button:active {
  background: #F0F0F0;
  border-radius: 50%;
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.header-button {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 40rpx;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.header-button:active {
  transform: scale(0.95);
  background: #F8F9FA;
}

/* 主容器 */
.container {
  flex: 1;
  position: relative;
  z-index: 10;
  padding-bottom: 40rpx;
}

/* 个人信息卡片 */
.profile-card {
  background: white;
  margin: 0 40rpx 40rpx;
  border-radius: 40rpx;
  padding: 50rpx;
  box-shadow: 0 8rpx 30rpx rgba(0,0,0,0.08);
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 40rpx;
  margin-bottom: 40rpx;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  color: white;
  font-weight: 600;
  > image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
  }
}

.verified-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 48rpx;
  height: 48rpx;
  background: #4CAF50;
  border: 4rpx solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-icon {
  color: white;
  font-size: 24rpx;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 44rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.profile-bio {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 24rpx;
  display: block;
}

.test-centre-info {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 26rpx;
  color: #999;
}

.centre-icon {
  font-size: 28rpx;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding: 40rpx 0;
  border-top: 1rpx solid #F5F5F5;
  border-bottom: 1rpx solid #F5F5F5;
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.stat-item:active {
  transform: scale(0.95);
}

.stat-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 26rpx;
  color: #999;
}

.profile-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 40rpx;
}

.action-button {
  flex: 1;
  padding: 24rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button.primary {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  color: white;
  box-shadow: 0 8rpx 24rpx rgba(74, 158, 255, 0.3);
}

.action-button.secondary {
  background: white;
  color: #4A9EFF;
  border: 2rpx solid #4A9EFF;
}

.action-button:active {
  transform: scale(0.98);
}

/* Posts标题 */
.section-header {
  padding: 0 40rpx;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

/* 内容列表 */
.content-list {
  padding: 0 40rpx;
}

.post-card {
  background: white;
  border-radius: 30rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
}

.post-card:active {
  transform: scale(0.98);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.post-category {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 20rpx;
  background: #F8F9FA;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
}

.category-icon {
  font-size: 28rpx;
}

.post-time {
  margin-left: auto;
  font-size: 24rpx;
  color: #999;
}

.post-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
  margin-bottom: 24rpx;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: block;
}

.post-media {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
  overflow-x: auto;
}
.images-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  // gap: 20rpx;
  margin-bottom: 30rpx;
}
.post-video {
  width: 100%;
  height: 300rpx;
}
.post-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
  background: #F0F0F0;
  flex-shrink: 0;
}

/* 互动栏 - 与社区页面保持一致的设计 */
.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 30rpx;
  border-top: 2rpx solid #F5F5F5;
}

.actions-left {
  display: flex;
  align-items: center;
  gap: 40rpx;
}

// .action-button {
//   display: flex;
//   align-items: center;
//   gap: 12rpx;
//   transition: all 0.3s ease;
//   background: none;
//   border: none;
//   padding: 0;
// }

.action-button:active {
  transform: scale(0.95);
}

.action-icon {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg {
  width: 44rpx;
  height: 44rpx;
}

/* 点赞状态样式 */
.action-button.liked .action-icon {
  animation: likeAnimation 0.3s ease;
}

.action-button.liked .action-count {
  color: #FF6B6B;
}

.action-count {
  font-size: 30rpx;
  color: #666;
  font-weight: 500;
}

@keyframes likeAnimation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 空状态 */
.empty-state {
  padding: 120rpx 40rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 40rpx;
  opacity: 0.5;
  display: block;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.empty-desc {
  font-size: 28rpx;
  color: #999;
  display: block;
}

/* 加载更多 */
.load-more {
  padding: 40rpx;
  text-align: center;
  font-size: 28rpx;
  color: #999;
}

.load-more.loading {
  color: #4A9EFF;
}

/* 响应式设计 - 小屏幕适配 */
@media screen and (max-width: 750rpx) {
  .profile-card {
    margin: 0 30rpx 30rpx;
    padding: 40rpx;
  }
  
  .avatar {
    width: 140rpx;
    height: 140rpx;
  }
  
  .profile-name {
    font-size: 40rpx;
  }
  
  .stat-value {
    font-size: 40rpx;
  }
}
</style>