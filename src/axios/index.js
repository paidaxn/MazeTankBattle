/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios';
import qs from 'qs';
import router from '../router/router';
// 配置baseUrl
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.interceptors.request.use(
    config => {
        // if (config.method === "post") {
        //   config.data = qs.stringify(config.data);
        // }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// http响应拦截器
axios.interceptors.response.use(
    data => {
        // code码为401，重新登录
        if (data.data.code === 401) {
            if (router.currentRoute.path !== 'login') {
                router.replace({
                    path: '/login'
                });
            }
        }
        return data;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 306:
                    // 只有在当前路由不是登录页面才跳转
                    if (router.currentRoute.path !== 'login') {
                        router.replace({
                            path: 'login'
                        });
                    }
            }
        }
        return Promise.reject(error);
    }
);

export function PostJson(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params)
            .then(
                response => {
                    resolve(response.data);
                },
                err => {
                    reject(err);
                }
            )
            .catch(error => {
                reject(error);
            });
    });
}

export function Get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, { params })
            .then(
                response => {
                    resolve(response.data);
                },
                err => {
                    reject(err);
                }
            )
            .catch(error => {
                reject(error);
            });
    });
}

export function Post(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, qs.stringify(params), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(
                response => {
                    resolve(response.data);
                },
                err => {
                    reject(err);
                }
            )
            .catch(error => {
                reject(error);
            });
    });
}

export default { Post, Get, PostJson };
