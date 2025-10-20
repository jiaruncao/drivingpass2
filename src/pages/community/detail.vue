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
        <view class="user-info-header">
          <view class="header-avatar">
            <image v-if="post.avatar" :src="post.avatar" mode="" style="width:100%;height: 100%;border-radius: 50%;"></image>
            <view v-if="!post.avatar">
              {{getInitial(post.nickname)}}
            </view>
          </view>
          <text class="header-username">{{ post.nickname }}</text>
        </view>
      </view>
      <view class="header-right">
        <view class="follow-button" :class="{following: post.is_follow}" @tap="toggleFollow(post.id)">
          {{ post.is_follow ? 'Following' : 'Follow' }}
        </view>
        <view class="more-button" @tap="showMoreOptions">
          <u-icon name="more-dot-fill"></u-icon>
        </view>
      </view>
    </view>

    <!-- 主内容容器 -->
    <scroll-view class="container" scroll-y @scrolltolower="handleScrollToBottom" :lower-threshold="100">

      <!-- 帖子主体卡片 -->
      <view class="post-card">
        <!-- 图片轮播 -->
        <swiper v-if="post.file_url && post.file_url.length > 0" class="image-carousel" :current="currentImageIndex"
          @change="onImageChange">
          <swiper-item v-for="(image, index) in post.file_url" :key="index">
            <image v-if="['webp', 'png', 'jpg', 'jpeg'].includes(getExtension(image))" :src="image" class="carousel-image" mode="aspectFill" @tap="viewFullImage(image)">
            </image>
            <video v-if="['mp4', 'avi'].includes(getExtension(image))" :src="image" style="width:100%;height: 100%;"></video>
          </swiper-item>
        </swiper>
        
        <!-- Featured徽章 -->
        <text v-if="post.elite" class="highlight-badge">
          🌟 {{ post.elite }}
        </text>

        <!-- 帖子文本 -->
        <text class="post-text">{{ post.content }}</text>

        <!-- 标签 -->
        <view class="tags-container">
          <text v-for="tag in post.tag_ids" :key="tag" class="tag">#{{ tag }}</text>
        </view>

        <!-- 帖子元信息 -->
        <view class="post-meta">
          <text>{{ post.days_ago }} days ago</text>
          <text style="margin-left: 30rpx;">Test Centre: {{ post.test_center }}</text>
        </view>
      </view>

      <!-- 互动栏卡片 -->
      <view class="actions-card">
        <view class="actions-bar">
          <view class="action-button" :class="{liked: post.is_support}" @tap="toggleLike">
            <view class="action-icon">
              <!-- <svg viewBox="0 0 24 24">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg> -->
              <u-icon v-if="!post.is_support" name="heart" size="48rpx" color="#999"></u-icon>
              <u-icon v-if="post.is_support" name="heart-fill" size="48rpx" color="#FF6B6B"></u-icon>
            </view>
            <text class="action-label">{{ post.support_count }}</text>
          </view>

          <view class="action-button" :class="{saved: post.is_collect}" @tap="toggleSave">
            <view class="action-icon">
              <!-- <svg viewBox="0 0 24 24">
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg> -->
              <u-icon v-if="!post.is_collect" name="star" size="48rpx" color="#999"></u-icon>
              <u-icon v-if="post.is_collect" name="star-fill" size="48rpx" color="#FFD700"></u-icon>
            </view>
            <text class="action-label">{{ post.collect_count }}</text>
          </view>

          <view class="action-button" @tap="openCommentInput">
            <view class="action-icon">
              <!-- <svg viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg> -->
              <u-icon name="chat" size="48rpx" color="#999"></u-icon>
            </view>
            <text class="action-label">{{ post.reply_count }}</text>
          </view>
        </view>
      </view>

      <!-- 评论区卡片 -->
      <view class="comments-card">
        <view class="comments-header">
          All Comments · {{ comments.length }}
        </view>

        <!-- 评论列表 -->
        <view v-for="comment in showComments" :key="comment.id" class="comment-item">
          <view class="comment-header">
            <view class="comment-avatar">
              <image v-if="comment.avatar" :src="comment.avatar" mode="" style="width:100%;height: 100%;border-radius: 50%;"></image>
              <view v-if="!comment.avatar">
                {{getInitial(comment.nickname)}}
              </view>
            </view>
            <view class="comment-info">
              <text class="comment-username">{{ comment.nickname }}</text>
              <text class="comment-meta">{{ comment.testCentre }}</text>
            </view>
            <view class="comment-actions">
              <view class="comment-like-button" :class="{liked: comment.is_support}" @tap="toggleCommentLike(comment)">
                <view class="comment-like-icon">
                  <!-- <svg viewBox="0 0 24 24">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg> -->
                  <u-icon v-if="!comment.is_support" name="heart" size="36rpx" color="#999"></u-icon>
                  <u-icon v-if="comment.is_support" name="heart-fill" size="36rpx" color="#FF6B6B"></u-icon>
                </view>
                <text class="comment-like-count">{{ comment.support_count }}</text>
              </view>
              <view class="comment-reply-button" @tap="replyToComment(comment)">
                <view class="comment-reply-icon">
                  <!-- <svg viewBox="0 0 24 24">
                    <path
                      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg> -->
                  <u-icon name="chat" size="36rpx" color="#999"></u-icon>
                </view>
                <text class="comment-reply-label">Reply</text>
              </view>
            </view>
          </view>
          <text class="comment-text">{{ comment.content }}</text>

          <!-- 回复列表 - 只显示第一条 -->
          <view v-if="comment.children && comment.children.length > 0" class="replies-container">
            <view class="reply-item">
              <view class="comment-header">
                <view class="comment-avatar reply-avatar">
                  <image v-if="comment.children[0].avatar" :src="comment.children[0].avatar" mode="" style="width:100%;height: 100%;border-radius: 50%;"></image>
                  <view v-if="!comment.children[0].avatar">
                    {{getInitial(comment.children[0].nickname)}}
                  </view>
                </view>
                <view class="comment-info">
                  <text class="comment-username reply-username">{{ comment.children[0].nickname }}</text>
                  <text class="comment-meta reply-meta">{{ comment.children[0].testCentre }}</text>
                </view>
              </view>
              <text class="comment-text reply-text">{{ comment.children[0].content }}</text>
            </view>

            <!-- Load more replies -->
            <view v-if="comment.children.length > 1 && !comment.showAllReplies" class="load-more-replies">
              <text class="load-more-replies-text" @tap="loadMoreReplies(comment)">
                Load more replies ({{ comment.children.length - 1 }})
              </text>
            </view>

            <!-- 显示所有回复 -->
            <view v-if="comment.showAllReplies">
              <view v-for="(reply, index) in comment.children.slice(1)" :key="reply.id" class="reply-item">
                <view class="comment-header">
                  <view class="comment-avatar reply-avatar">
                    <image v-if="reply.avatar" :src="reply.avatar" mode="" style="width:100%;height: 100%;border-radius: 50%;"></image>
                    <view v-if="!reply.avatar">
                      {{getInitial(reply.nickname)}}
                    </view>
                  </view>
                  <view class="comment-info">
                    <text class="comment-username reply-username">{{ reply.nickname }}</text>
                    <text class="comment-meta reply-meta">{{ reply.testCentre }}</text>
                  </view>
                </view>
                <text class="comment-text reply-text">{{ reply.content }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多评论 -->
        <view v-if="hasMoreComments" class="load-more-container">
          <view v-if="!isLoadingComments" class="load-more-button" @tap="loadMoreComments">
            Load more comments
          </view>
          <view v-else class="loading-spinner"></view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入框 -->
    <view class="input-bar">
      <input type="text" class="input-field" v-model="commentText" placeholder="Say something..."
        @confirm="sendComment" />
      <view class="send-button" @tap="sendComment">
        <!-- <svg viewBox="0 0 24 24">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg> -->
        ➤
      </view>
    </view>
  </view>
</template>

<script>
  import {
    queryPostDetail,
    replyPost,
    supportReply,
    collectPost,
    userFollowed,
    supportPost
  } from '@/http/api/community.js'
  export default {
    data() {
      return {
        // 帖子数据
        post: {},
        // 评论数据
        comments: [],
        // 展示的评论
        showComments: [],
        // 界面状态
        currentImageIndex: 0,
        isFollowing: false,
        commentText: '',
        replyingTo: null, // 正在回复的评论
        hasMoreComments: true,
        isLoadingComments: false
      }
    },
    methods: {
      getExtension(url) {
        // 匹配最后一个 '.' 后的内容（包括可能的查询参数）
        const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(?:$|\?|#)/);
      
        // 提取纯净的后缀（不包含查询参数）
        const extension = extensionMatch ? extensionMatch[1] : null;
      
        return extension
      
      },
      // 返回上一页
      goBack() {
        console.log('Going back to forum list');
        uni.navigateBack();
      },

      // 获取用户名首字母
      getInitial(username) {
        if (username) {
          return username.charAt(0).toUpperCase();
        } else {
          return ''
        }
      },

      // 切换关注状态
      toggleFollow(follow_user_id) {
        this.isFollowing = !this.isFollowing;
        console.log(this.isFollowing ? 'Following user' : 'Unfollowed user');
        this.updateFollowStatus(follow_user_id);
      },

      // 显示更多选项
      showMoreOptions() {
        console.log('Showing more options');
        uni.showActionSheet({
          itemList: ['Share', 'Report', 'Copy Link', 'Block User'],
          success: (res) => {
            console.log('Selected option:', res.tapIndex);
            this.handleMoreOption(res.tapIndex);
          }
        });
      },

      // 处理更多选项
      handleMoreOption(index) {
        switch (index) {
          case 0: // Share
            this.sharePost();
            break;
          case 1: // Report
            this.reportPost();
            break;
          case 2: // Copy Link
            this.copyLink();
            break;
          case 3: // Block User
            this.blockUser();
            break;
        }
      },

      // 图片轮播变化
      onImageChange(e) {
        this.currentImageIndex = e.detail.current;
      },

      // 查看完整图片
      viewFullImage(imageUrl) {
        console.log('Viewing full image:', imageUrl);
        uni.previewImage({
          current: imageUrl,
          urls: this.post.images
        });
      },

      // 切换点赞
      toggleLike() {
        
        console.log(this.post.is_support ? 'Liked post' : 'Unliked post');
        supportPost({
          post_id: this.postId
        }).then(res => {
          if (res.code == 1) {
            // this.loadPostDetail()
            this.post.is_support = !this.post.is_support;
            this.post.support_count += this.post.is_support ? 1 : -1;
          }
        })
      },

      // 切换收藏
      toggleSave() {
        console.log(this.post.is_collect ? 'Saved post' : 'Unsaved post');
        collectPost({
          post_id: this.postId
        }).then(res => {
          if (res.code == 1) {
            // this.loadPostDetail()
            this.post.is_collect = !this.post.is_collect;
            this.post.collect_count += this.post.is_collect ? 1 : -1;
          }
        })
      },

      // 打开评论输入框
      openCommentInput() {
        // UniApp中输入框自动聚焦需要特殊处理
        this.$nextTick(() => {
          // 可以使用 focus 属性控制
        });
      },

      // 切换评论点赞
      toggleCommentLike(comment) {
        // comment.is_support = !comment.is_support;
        // comment.likeCount += comment.is_support ? 1 : -1;
        console.log(comment.is_support ? 'Liked comment' : 'Unliked comment');
        supportReply({
          post_id: this.postId,
          reply_id: comment.id
        }).then(res => {
          // this.loadPostDetail()
          comment.is_support = !comment.is_support;
          comment.support_count += comment.is_support ? 1 : -1;
        })
      },

      // 加载更多回复
      loadMoreReplies(comment) {
        console.log('Loading more replies for comment:', comment.id);
        this.$set(comment, 'showAllReplies', true);
      },

      // 回复评论
      replyToComment(comment) {
        console.log('Replying to comment:', comment.id);
        this.replyingTo = comment;
        this.commentText = `@${comment.nickname} `;
      },

      // 发送评论
      sendComment() {
        if (!this.commentText.trim()) return;

        // 检查是否是回复
        if (this.replyingTo) {
          replyPost({
            post_id: this.postId,
            content: this.commentText.trim(),
            pid: this.replyingTo.id
          }).then(res => {
            if (res.code == 1) {
              this.loadPostDetail()
            }
          })
        } else {
          // 普通评论
          replyPost({
            post_id: this.postId,
            content: this.commentText.trim()
          }).then(res => {
            console.log(res)
            if (res.code == 1) {
              this.loadPostDetail()
            }
          })
        }

        this.commentText = '';
        console.log('Comment/Reply sent');
      },

      // 加载更多评论
      loadMoreComments() {
        if (this.isLoadingComments) return;

        this.isLoadingComments = true;
        console.log('Loading more comments...');

        // 模拟API调用
        setTimeout(() => {
          this.showComments = this.comments.slice(0, this.showComments.length + 5);
          this.isLoadingComments = false;

          // 模拟没有更多评论
          if (this.showComments.length >= this.comments.length) {
            this.hasMoreComments = false;
          }

        }, 1000);
      },

      // 处理滚动到底部
      handleScrollToBottom() {
        if (this.hasMoreComments && !this.isLoadingComments) {
          console.log('Auto loading more comments...');
          this.loadMoreComments();
        }
      },

      // 更新关注状态
      async updateFollowStatus(follow_user_id) {
        try {
          const res = await userFollowed({
            follow_user_id
          })
          if (res.code == 1) {
            this.loadPostDetail()
          }
        } catch (error) {
          console.error('Failed to update follow status:', error);
          this.isFollowing = !this.isFollowing; // 恢复状态
        }
      },

      // 加载帖子详情
      async loadPostDetail() {
        const postId = this.postId;
        if (!postId) return;

        try {
          const response = await queryPostDetail({
            post_id: postId
          })
          console.log(response)
          if (response.code === 1) {
            this.post = response.data.detail;
            this.comments = response.data.reply;
            // 默认展示5条
            this.showComments = this.comments.slice(0, 5);
            this.hasMoreComments = this.comments.length > 5;
            this.isLoadingComments = false;
            
            // if (this.comments.length < 5) {
            //   this.hasMoreComments = false;
            // }
          }
        } catch (error) {
          console.error('Failed to load post detail:', error);
        }
      }
    },
    onLoad(options) {
      // 获取帖子ID
      this.postId = options.id;
      this.loadPostDetail();
    }
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 全局样式 */
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
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
    gap: 24rpx;
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

  .user-info-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  .header-avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 30rpx;
  }

  .header-username {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 24rpx;
  }

  .follow-button {
    padding: 16rpx 40rpx;
    background: white;
    border: 4rpx solid #4A9EFF;
    border-radius: 50rpx;
    color: #4A9EFF;
    font-size: 28rpx;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .follow-button.following {
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    color: white;
    border-color: transparent;
  }

  .more-button {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .more-icon {
    width: 40rpx;
    height: 40rpx;
  }

  /* 容器 */
  .container {
    flex: 1;
    padding: 40rpx;
    position: relative;
    z-index: 10;
    padding-bottom: 170rpx;
    /* 为底部输入框留空间 */
  }

  /* 帖子卡片 */
  .post-card {
    background: white;
    border-radius: 40rpx;
    padding: 40rpx;
    box-shadow: 0 10rpx 36rpx rgba(0, 0, 0, 0.06);
    margin-bottom: 30rpx;
  }

  /* 图片轮播 */
  .image-carousel {
    margin: -40rpx -40rpx 40rpx -40rpx;
    height: 600rpx;
    border-radius: 40rpx 40rpx 0 0;
    overflow: hidden;
  }

  .carousel-image {
    width: 100%;
    height: 600rpx;
  }

  /* Featured徽章 */
  .highlight-badge {
    display: inline-block;
    background: linear-gradient(135deg, #FFB74D 0%, #FF9800 100%);
    color: white;
    padding: 12rpx 28rpx;
    border-radius: 16rpx;
    font-size: 26rpx;
    font-weight: 600;
    margin-bottom: 30rpx;
  }

  /* 帖子文本 */
  .post-text {
    font-size: 30rpx;
    line-height: 1.6;
    color: #333;
    margin-bottom: 30rpx;
    display: block;
  }

  /* 标签 */
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 30rpx;
  }

  .tag {
    font-size: 28rpx;
    color: #4A9EFF;
  }

  /* 帖子元信息 */
  .post-meta {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    // gap: 30rpx;
    font-size: 26rpx;
    color: #999;
    padding-top: 30rpx;
    border-top: 2rpx solid #F5F5F5;
  }

  /* 互动栏卡片 */
  .actions-card {
    background: white;
    border-radius: 40rpx;
    padding: 30rpx;
    box-shadow: 0 10rpx 36rpx rgba(0, 0, 0, 0.06);
    margin-bottom: 30rpx;
  }

  .actions-bar {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    flex: 1;
  }

  .action-icon {
    width: 48rpx;
    height: 48rpx;
  }

  .action-icon svg {
    width: 100%;
    height: 100%;
    stroke: #999;
    fill: none;
    stroke-width: 2;
    transition: all 0.3s ease;
  }

  .action-button.liked .action-icon svg {
    fill: #FF6B6B;
    stroke: #FF6B6B;
  }

  .action-button.saved .action-icon svg {
    fill: #FFD700;
    stroke: #FFD700;
  }

  .icon-image {
    width: 100%;
    height: 100%;
  }

  .action-label {
    font-size: 28rpx;
    color: #666;
    font-weight: 500;
  }

  .action-button.liked .action-label {
    color: #FF6B6B;
  }

  .action-button.saved .action-label {
    color: #FFD700;
  }

  /* 评论区卡片 */
  .comments-card {
    background: white;
    border-radius: 40rpx;
    padding: 40rpx;
    box-shadow: 0 10rpx 36rpx rgba(0, 0, 0, 0.06);
  }

  .comments-header {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 40rpx;
    padding-bottom: 30rpx;
    border-bottom: 2rpx solid #F5F5F5;
  }

  .comment-item {
    padding: 30rpx 0;
    border-bottom: 2rpx solid #F5F5F5;
  }

  .comment-item:last-child {
    border-bottom: none;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 24rpx;
  }

  .comment-avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 28rpx;
  }

  .reply-avatar {
    width: 56rpx;
    height: 56rpx;
    font-size: 24rpx;
  }

  .comment-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .comment-username {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 6rpx;
  }

  .reply-username {
    font-size: 28rpx;
  }

  .comment-meta {
    font-size: 24rpx;
    color: #999;
  }

  .reply-meta {
    font-size: 22rpx;
  }

  .comment-actions {
    display: flex;
    align-items: center;
    gap: 30rpx;
  }

  .comment-like-button,
  .comment-reply-button {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  .comment-like-icon,
  .comment-reply-icon {
    width: 36rpx;
    height: 36rpx;
  }

  .comment-like-icon svg {
    width: 100%;
    height: 100%;
    stroke: #999;
    fill: none;
    stroke-width: 2;
    transition: all 0.3s ease;
  }

  .comment-reply-icon svg {
    width: 100%;
    height: 100%;
    stroke: #999;
    fill: none;
    stroke-width: 2;
  }

  .comment-like-count {
    font-size: 28rpx;
    color: #666;
    font-weight: 500;
  }

  .comment-like-button.liked .comment-like-count {
    color: #FF6B6B;
  }

  .comment-reply-label {
    font-size: 28rpx;
    color: #666;
    font-weight: 500;
  }

  .comment-text {
    font-size: 28rpx;
    line-height: 1.5;
    color: #333;
    padding-left: 96rpx;
    display: block;
  }

  .reply-text {
    padding-left: 80rpx;
    font-size: 26rpx;
  }

  /* 回复相关样式 */
  .replies-container {
    margin-top: 30rpx;
    padding-left: 40rpx;
    border-left: 4rpx solid #F0F0F0;
  }

  .reply-item {
    padding: 20rpx 0;
    border-bottom: 2rpx solid #F8F8F8;
  }

  .reply-item:last-child {
    border-bottom: none;
  }

  .load-more-replies {
    margin-top: 20rpx;
    padding-left: 80rpx;
  }

  .load-more-replies-text {
    color: #4A9EFF;
    font-size: 26rpx;
    font-weight: 500;
  }

  /* 加载更多 */
  .load-more-container {
    text-align: center;
    padding: 40rpx 0 20rpx;
  }

  .load-more-button {
    width: 90%;
    max-width: 700rpx;
    margin: 0 auto;
    padding: 28rpx 60rpx;
    background: white;
    border: 4rpx solid #4A9EFF;
    border-radius: 50rpx;
    color: #4A9EFF;
    font-size: 30rpx;
    font-weight: 600;
    display: block;
    text-align: center;
  }

  .loading-spinner {
    display: inline-block;
    width: 40rpx;
    height: 40rpx;
    border: 6rpx solid #F0F0F0;
    border-top: 6rpx solid #4A9EFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  /* 底部输入框 */
  .input-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 30rpx 40rpx;
    display: flex;
    align-items: center;
    gap: 30rpx;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
    z-index: 20;
  }

  .input-field {
    flex: 1;
    padding: 24rpx 40rpx;
    background: #F8F9FA;
    border: none;
    border-radius: 50rpx;
    font-size: 30rpx;
    height: 80rpx;
  }

  .send-button {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 20rpx rgba(74, 158, 255, 0.3);
    color: #fff;
    font-size: 28rpx;
  }

  .send-button:active {
    transform: scale(0.95);
  }

  .send-button svg {
    width: 20px;
    height: 20px;
    stroke: white;
    fill: none;
    stroke-width: 2;
  }

  .send-icon {
    width: 40rpx;
    height: 40rpx;
  }
</style>