<script>
export default {
  onLaunch: function () {
    // this.$voice.init()
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";
@import "../public/tuniao-ui.css";

:root {
  font-size: clamp(90%, calc(100vw / 7.5), 125%);
  /* 750 设计宽度下，100vw / 7.5 ≈ 100，对应 1rem ≈ 100 设计单位 */
}
</style>
