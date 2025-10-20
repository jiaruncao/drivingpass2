<template>
	<view class="container">
		<u-navbar leftText="followed" :safeAreaInsetTop="true" :autoBack="true">
		</u-navbar>

		<view class="content tn-padding-left tn-padding-right">
			<!-- 搜索栏 -->
			<view class="search-section">
				<u-search placeholder="search user" shape="round" :show-action="false"></u-search>
			</view>

			<!-- 关注列表标题 -->
			<view class="list-header">
				<text>Following List ({{ followList.length }})</text>
			</view>

			<!-- 关注列表 -->
			<view class="follow-list">
				<view class="follow-item" v-for="(item, index) in followList" :key="index">
					<view class="user-info">
						<u-avatar size="72rpx" shape="circle"></u-avatar>
						<view class="user-details">
							<text class="user-name">{{ item.name }}</text>
							<text class="user-desc">{{ item.description }}</text>
						</view>
					</view>
					<view class="action-btn tn-flex tn-flex-col-center tn-flex-row-center"
						:class="{ 'unfollow-btn': item.followed, 'follow-btn': !item.followed }"
						@click="toggleFollow(index)">
						{{ item.followed ? 'Unfollow' : '+Follow' }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				followList: [{
					id: 3,
					avatar: 'https://via.placeholder.com/100',
					nickname: '会飞的虾',
					description: '这个人很懒，什么都没有留下~',
					status: "1",
					followed: true
				}]
			};
		},
		onLoad() {
			this.getFollowList();
		},
		methods: {
			// 切换关注状态
			async toggleFollow(index) {
				try {
					// 准备登录参数
					const params = {
						follow_user_id: this.followList[index].id,
					};

					// 调用community模块的userLogin接口
					const res = await this.$http.userFollowed(params);

					// 处理返回结果
					if (res.code === this.$http.STATUS_OK) {
						// 登录成功逻辑
						console.log('操作成功', res.data);
						uni.showToast({
							title: '操作成功',
							icon: 'success'
						});
						//this.followList[index].followed = !this.followList[index].followed;
					} else {
						// 登录失败（业务错误）
						console.log('操作失败', res.msg);
						uni.showToast({
							title: res.msg || '登录失败',
							icon: 'none'
						});
					}
				} catch (error) {
					// 捕获异常（网络错误等）
					console.error('登录请求异常', error);
					uni.showToast({
						title: '网络异常，请稍后再试',
						icon: 'none'
					});
				}

				this.followList[index].followed = !this.followList[index].followed;

			},

			async getFollowList() {
				try {
					const params = {};
					const res = await this.$http.userFollowedList(params);
					// 处理返回结果
					if (res.code === this.$http.STATUS_OK) {
						console.log('登录成功', res.data);
						this.followList = res.data.list.map(item => ({
							...item,
							// 关键：status为"1"时followed设为true，否则为false
							followed: item.status === "1",
						}));
						//this.followList[index].followed = !this.followList[index].followed;
					} else {
						// 登录失败（业务错误）
						console.log('操作失败', res.msg);
						uni.showToast({
							title: res.msg || '登录失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('登录请求异常', error);
					uni.showToast({
						title: '网络异常，请稍后再试',
						icon: 'none'
					});
				}
			}
		}
	};
</script>

<style>
	.container {
		flex: 1;
		background-color: #fff;
	}

	.content {
		margin-top: 64px;
	}

	/* 搜索栏 */
	.search-section {
		margin-bottom: 20rpx;
	}

	/* 列表标题 */
	.list-header {
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 24rpx;
		color: #333333;
		margin-bottom: 20rpx;
	}

	/* 关注列表 */
	.follow-list {
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.follow-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.follow-item:last-child {
		border-bottom: none;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.user-details {
		margin-left: 20rpx;
	}

	.user-name {
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 28rpx;
		color: #333333;
	}

	.user-desc {
		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 20rpx;
		color: #999999;
		display: block;
	}

	/* 操作按钮 */
	.action-btn {
		background: #FFFFFF;
		border-radius: 26rpx;
		border: 2rpx solid #D7D7D7;

		width: 141rpx;
		height: 51rpx;

		font-family: Microsoft YaHei UI;
		font-weight: 400;
		font-size: 22rpx;
		color: #999999;
	}

	/* 已关注状态（Unfollow） */
	.unfollow-btn {
		color: #999999;
		/* 蓝色文字 */
		border: 2rpx solid #999999;
	}

	/* 未关注状态（+Follow） */
	.follow-btn {
		color: #419FFF;
		/* 蓝色背景 */
		border: 2rpx solid #419FFF;
		/* 蓝色边框 */
	}
</style>