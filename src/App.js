// 应用的根组件

import React,{Component} from 'react';
// 引入路由相关
import {BrowserRouter , Route , Switch} from 'react-router-dom';
// 引入登录页和主页面
import Login from './pages/login/login';
import Admin from './pages/admin/admin'

class App extends Component{
    
    render(){
        return (
            <BrowserRouter>
                <Switch>  {/*只匹配其中一个*/}
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    };
};
export default App