import axios from "axios";
const isdev = require("./cfg.js").isdev;
import router from "@/router/router.js";
import Vue from "vue";
let token = localStorage.getItem("token");
/**
 * code为402没有查到数据
 */
const whiteList = ["/panel/login", "/panel/register"];
const Service = axios.create({
  timeout: 20000,
  baseURL: isdev ? "http://127.0.0.1:7001" : "http://119.45.57.238",
  method: "post",
  // headers: {
  //   "Authorization": `Bearer ${token}`
  // }
});
Service.interceptors.request.use(
  (config) => {
    if (config.method === "post") {
      config.data = JSON.stringify(config.data);
    }
    // console.log(config);
    // console.log(token);
    let isInWhiteList = (s) => whiteList.some((w) => w === s);
    if (!!!isInWhiteList(config.url)) {
      if (!token) {
        router.push({ path: "/login" });
        return;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    new Vue().bus.$hint({
      msg: "出现错误啦。。。",
      type: "error",
    });
    console.log(error);
    return Promise.reject(error);
  }
);
// 添加响应拦截器
Service.interceptors.response.use(
  (response) => {
    if (Number(response.data.code) > 350) {
      new Vue().bus.$hint({
        msg: response.data.msg,
        type: "error",
      });
      router.replace("/login");
    }
    if (response.data.code === 200) {
      return response.data;
    } else {
      new Vue().bus.$hint({
        msg: response.data.msg,
        type: "error",
      });
      return response;
    }
  },
  (error) => {
    new Vue().bus.$hint({
      msg: "出现错误啦。。。",
      type: "error",
    });
    console.log(error);
    return Promise.reject(error);
  }
);

export default Service;
