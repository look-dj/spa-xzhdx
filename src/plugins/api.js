import service from "./axios.js";
import axios from "axios";
import { checkObjectIsEmpty } from "./util";
let temp = {
	$loading: () => ({
		close: () => {},
	}),
};
//测试
export function t(data, obj = {}) {
	return fetch("/t", data, obj);
}

//登录
export function login(data = {}, obj = {}) {
	return fetch("/spa/login", data, obj);
}
//读取站点设置
export function siteGet(data = {}, obj = {}) {
	return fetch("/spa/site/read", data, obj);
}
//修改站点设置
export function siteUpdate(data, obj = {}) {
	return fetch("/spa/site/update", data, obj);
}
export function aboutGet(data = {}, obj = {}) {
	return fetch("/spa/site/read", data, obj);
}
//修改站点设置
export function aboutUpdate(data, obj = {}) {
	return fetch("/spa/site/update", data, obj);
}
//查询所有的html
export function getTps(data, obj = {}) {
	return fetch("/spa/file/getTps", data, obj);
}
export function fetchRouter(data, obj = {}) {
	// console.log(data);
	return fetch("/spa/node/getRouter", data, obj);
}
export function fetchMenu(data, obj = {}) {
	return fetch("/spa/node/getMenu", data, obj);
}
export function getUserInfo(data, obj = {}) {
	return fetch("/spa/user/getInfo", data, obj);
}
export function getAllColumnCount(data = {}, obj = {}) {
	return fetch("/spa/column/columnCount", data, obj);
}
export function readPageByNid(data, obj = {}) {
	return fetch("/spa/page/byNid", data, obj);
}

export class Api {
	constructor(url) {
		this.url = `/spa/${url}/`;
	}
	queryAll(data = {}, obj = {}) {
		return fetch(this.url + "queryAll", data, obj);
	}
	read(data, obj = {}) {
		return fetch(this.url + "read", data, obj);
	}
	add(data, obj = {}) {
		return fetch(this.url + "add", data, obj);
	}
	delete(data, obj = {}) {
		return fetch(this.url + "delete", data, obj);
	}
	update(data, obj = {}) {
		return fetch(this.url + "update", data, obj);
	}
}
//上传文件
export async function upload(data, obj = {}, deletePath = "") {
	obj = obj.$loading ? obj : temp;
	let o = obj.$loading();
	let fm = new FormData();
	fm.append("file", data);
	try {
		let result = await axios.post("/storage/upload/image", fm, {
			headers: {
				"Content-type": "multipart/form-data",
			},
		});
		o.close();
		if (deletePath.length > 0 && result.data.code === 200) {
			deleteFile(result.data.path);
		}
		if (result.status === 200) {
			return result.data;
		} else {
			return {
				code: 500,
				msg: "上传图片失败，请稍后重试",
			};
		}
	} catch (e) {
		o.close();
		console.error(e);
		return false;
	}
}
export async function upload2(data, obj = {}, deletePath = "") {
	obj = obj.$loading ? obj : temp;
	let o = obj.$loading();
	let fm = new FormData();
	fm.append("file", data);
	try {
		let result = await axios.post("/storage/upload/image", fm, {
			headers: {
				"Content-type": "multipart/form-data",
			},
		});
		o.clase();
		if (deletePath.length > 0 && result.data.code === 200) {
			deleteFile(result.data.path);
		}
		if (result.status === 200) {
			return result.data;
		} else {
			return {
				code: 500,
				msg: "上传图片失败，请稍后重试",
			};
		}
	} catch (e) {
		o.clase();
		console.error(e);
		return false;
	}
}
//删除上传的文件
export async function deleteFile(data) {
	try {
		let result = await fetch("/storage/delete/image", {name: data});
		return result;
	} catch (e) {
		console.log(e);
		return false;
	}
}

function fetch(
	url,
	data,
	obj,
	method = "post",
	headers = {
		"Content-Type": "application/json;charset=UTF-8",
	}
) {
	if (checkObjectIsEmpty(obj)) obj = temp;
	let o = obj.$loading();
	return new Promise((resolve, reject) => {
		service({
			url,
			data,
			method,
			headers,
		}).then(
			(res) => {
				resolve(res);
				o.close();
			},
			(err) => {
				reject(err);
				o.close();
			}
		);
	});
}
