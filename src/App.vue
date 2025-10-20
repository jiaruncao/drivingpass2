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
  font-size: 14px; /* 750px设计稿下，1rem = 100px */
}
</style>
