export default {
	data() {
		return {
			safeAreaTop: 0 // 统一管理安全区域顶部间距
		};
	},
	onLoad() {
		// 统一计算逻辑：44 + 设备安全区域顶部高度（px）
		const res = uni.getSystemInfoSync();
		this.safeAreaTop = 44 + res.safeArea.top;
	}
};