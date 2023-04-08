/*
 * @Descripttion:
 * @version:
 * @Author: 小智
 * @Date: 2022-03-16 10:33:25
 * @LastEditors: 小智
 * @LastEditTime: 2022-04-11 16:06:32
 */
import { Get, Post, PostJson } from '@/axios/index';

export default {
    // 基础 接口
    Logout(params) {
        return PostJson('/admin/logout', params); // 退出登录接口
    },
    Login(params) {
        return Post('/admin/login', params); // 登录接口
    },
    GetCode(params) {
        return Post('/admin/sendCode', params); // 获取验证码
    },
    uptoken(params) {
        return Get('/qiniu/upload/uptoken', params); // 获取token
    }

    // // 账户管理
    // getUser(params) {
    //     return Post('/admin/user/get', params); // 获取用户列表
    // },
    // addAdmin(params) {
    //     return Post('/admin/user/add', params); // 添加账号
    // },
    // editAdmin(params) {
    //     return Post('/admin/user/update', params); // 编辑账号
    // },
    // deleteAdmin(params) {
    //     return Post('/admin/user/delete', params); // 编辑账号
    // },
};
