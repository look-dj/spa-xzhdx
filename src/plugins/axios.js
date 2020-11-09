import axios from "axios";
// const isdev = require("./config.js").isdev;
import router from "@/router/router.js";
import Vue from "vue";
const Service = axios.create({
	timeout: 20000,
	// baseURL: isdev?"/api":'',
	baseURL: "",
	method: "post",
	withCredentials: true,
});
Service.interceptors.request.use(
	(config) => {
    // console.log(config)
		if (config.method === "post") {
			config.data = JSON.stringify(config.data);
			if (config.data === "{}") delete config.data;
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
			if ("token" in response.data) {
				localStorage.setItem("token", response.data.token);
				delete response.data.token;
			}
			return response.data;
		} else {
			new Vue().bus.$hint({
				msg: response.data.msg,
				type: "error",
			});
			return response.data;
		}
	},
	(error) => {
		new Vue().bus.$hint({
			msg: "出现错误啦。。。",
			type: "error",
		});
		new Vue().bus.$emit("error", error);
		router.replace("/error");
		return Promise.reject(error);
	}
);

export default Service;
