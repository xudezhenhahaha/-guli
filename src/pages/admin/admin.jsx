// 主页面的路由组件
import React, { Component } from 'react';
import { Redirect, Route ,Switch } from 'react-router-dom';
import { Layout } from 'antd';
import memoryUtils from '../../utils/memoryUtils';
// import storageUtils from '../../utils/storageUtils';
import LeftNav from '../../components/left-nav/leftNav';
import HeaderNav from '../../components/header/headerNav';
import Home from '../home/home';
import Category from '../category/category';
import Product from '../product/product';
import User from '../user/user';
import Role from '../role/role';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';


const { Footer, Sider, Content } = Layout;

class Admin extends Component {
    
    render() {
        
        const user = memoryUtils.user
        // const user = storageUtils.getUser();
        if(!user || !user._id){
            // 跳转到登录，在render()中的跳转方式
            return <Redirect to='/login' />
        }

        return (
                <Layout style={{height:'100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <HeaderNav/>
                        <Content style={{margin:20,backgroundColor:'#fff',overflowY:'scroll'}}>
                            <Switch>
                                <Route path='/home' component={Home} />
                                <Route path='/category' component={Category} />
                                <Route path='/product' component={Product} />
                                <Route path='/user' component={User} />
                                <Route path='/role' component={Role} />
                                <Route path='/charts/bar' component={Bar} />
                                <Route path='/charts/line' component={Line} />
                                <Route path='/charts/pie' component={Pie} />
                                <Redirect to='/home' />
                            </Switch>
                        </Content>
                        <Footer style={{textAlign:'center',color:'#999',backgroundColor:'#f0f2f5'}}>谷粒后台管理系统</Footer>
                    </Layout>
                </Layout>
        );
    }
}

export default Admin;
