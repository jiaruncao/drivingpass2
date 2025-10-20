// 引入fly
import Fly from "flyio/dist/npm/wx";
let fly = new Fly();


// 设置超时
fly.config.timeout = 30000;

// 设置请求基地址 (同一地址时)
// #ifdef H5
fly.config.baseURL = "http://driving.asszo.com/addons";
// #endif
// #ifdef APP-PLUS
fly.config.baseURL = "http://driving.asszo.com/addons";
// #endif
// 添加请求拦截器
fly.interceptors.request.use(
  (request) => {
    console.log("req", request);
    console.log('req.url ===', request.url);
    /*
     * author：Gengbaodada
     * create by date：2024/11/11
     * content：配置不同接口请求地址
     */
    // request.baseURL = process.env[request.otherQuery.baseUrl];
    /*
     * author：Gengbaodada
     * create by date：2024/11/11
     * content：登录后接口调用是否使用token
     */
    if (request.url !== 'exam/user/userLogin') { // 非登录接口
      const token = uni.getStorageSync("token");
      console.log('token ===', token);
      if (token) { // 有token才设置
        request.headers['token'] = token;
      }
    }
    // uni.showLoading({
    //   mask: true,
    //   title: "loading...",
    // });
    return request;
  },
  function(error) {
    return Promise.reject(error);
  }
);

/*
 * author：Gengbaodada
 * create by date：2024/11/11
 * content：响应拦截器
 */
fly.interceptors.response.use(
  (res) => {
    console.log(res);
    /*
     * author：Gengbaodada
     * create by date：2024/11/11
     * content：响应成功处理
     */
    // if (res.data.code != 1) {
    //   uni.showToast({
    //     title: res.data.msg,
    //     icon: "none",
    //     duration: 3000
    //   })
    //   return new Promise(() => {})
    // }
    setTimeout(() => {
      uni.hideLoading();
    }, 500);
    return res.data;
  },
  (error) => {
    console.log("error ===", error);
    if (error.status == 401) {
      uni.navigateTo({
        url: '/pages/login/index'
      })
    }
    /*
     * author：Gengbaodada
     * create by date：2024/11/11
     * content：做错误处理
     */
    // uni.showLoading({
    //   mask: true,
    //   title: "服务器错误！请联系管理员",
    // });
    setTimeout(() => {
      uni.hideLoading();
    }, 500);
    return Promise.reject(error);
  }
);

// 封装上传方法
export const uploadFile = (url, filePath, formData = {}, onProgressUpdate) => {
  return new Promise((resolve, reject) => {
    fly.upload(url, {
      filePath, // 文件路径
      name: 'file', // 后端接收的字段名
      formData, // 额外表单数据
      onProgressUpdate // 进度回调
    }).then(resolve).catch(reject)
  })
}

export default fly;
