// 登录的路由组件
import React, { Component } from 'react';
// 引入样式
import './login.scss';
// 引入logo图片
import logo from './../../assets/images/logo.png'
// 引入antd的form表单组件
import { Form, Input, Button,message} from 'antd';
// 由于antd4.0版本放弃了旧版icon使用方式，可以使用@ant-design/icons;或者使用兼容包@ant-design/compatible
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {reqLogin} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { Redirect } from 'react-router-dom';

class Login extends Component {

    formRef = React.createRef();
    onFinish = async (values) => {
        // console.log(values)
        // console.log(this.formRef.current)   //form表单的各项属性方法
        // const form = this.formRef.current
        // const val = form.getFieldsValue()  //可以获得表单项中的值
        // antd4.0版本直接通过onFinish方法接受values得到表单项的值
        const {username , password} = values;
        // 请求登录
        const result = await reqLogin(username , password);
        // console.log("success", result)
        if(result.status === 0){ //登陆成功
            // 提示登录成功
            message.success("登录成功");
            // 保存user信息
            const user = result.data;
            memoryUtils.user = user; //保存到内存中
            storageUtils.saveUser(user)  //保存到localStorage中
            // 跳转到主页面(登录后不需要回退到登录页面，所以用replace()。)
            // console.log(this.props)
            this.props.history.replace('/');
        }else{ //登陆失败
            message.error(result.msg);
        }
    };

    // 自定义验证密码
    validatorPwd = async(rule, value)=>{
        let res = await value;
        if(!res){
            return Promise.reject(new Error('密码不能为空'))
        }else if(res.length < 4){
            return Promise.reject(new Error('密码不少于4位'))
        }else if(res.length > 12){
            return Promise.reject(new Error('密码不大于12位'))
        }else{
            return Promise.resolve();
        }
    }

    render() {
        // 判读用户之前是否登录，如果登录则跳转到主页面
        if(memoryUtils.user && memoryUtils.user._id){
            return <Redirect to='/' />
        }

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>谷粒后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onFinish={this.onFinish} ref={this.formRef} className="login-form">
                        <Form.Item 
                            name="username"
                            // 声明式验证:直接用antd定义好的验证规则进行验证
                            rules={[
                                {required: true, message: '用户名不能为空',},
                                {min: 4, message: '用户名不少于4位',},
                                {max: 12, message: '用户名不多于12位',},
                                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成',},
                            ]}
                        >
                            <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                        // 声明式验证
                            // rules={[
                            //     {required: true,message: '请输入密码!',},
                            //     {min: 4, message: '不少于4位',},
                            // ]}
                        // 自定义验证
                            rules={[
                                {validator: this.validatorPwd}
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>                
                </section>
            </div>
        );
    }
}

export default Login;
