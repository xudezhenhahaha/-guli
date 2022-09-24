// 主页面右边顶部组件
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig'
import { reqWeather } from '../../api';
import './headerNav.scss'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {  Modal } from 'antd';


const { confirm } = Modal;

class HeaderNav extends Component {

    // 点击退出显示退出确认框
    showConfirm = () => {
        confirm({
          title: '确认退出登录?',
          icon: <ExclamationCircleOutlined />,
          content: '退出登录将清空用户信息',
          okText:'确定',
          cancelText:'取消',
      
          onOk:() =>{
            memoryUtils.user = {}; //清空内存中用户信息
            storageUtils.removeUser()  //移出localStorage中用户信息          
            // console.log(this.props)
            this.props.history.replace('/login');
          },
      
        });
      };

    formateDate=(time)=> { 
        if (!time) return '' ;
        let date = new Date(time);   //也可以不传参数，new Date()不传参数的时候返回当前时间
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() 
    }
    state = {
        currentTime : this.formateDate(Date.now()),  //当前时间字符串
        city : '',  //城市
        wendu : '',  //温度
        type : '',   //天气
    }

    getTimer = ()=>{
        // 每隔一秒,获取当前时间,并更新状态数据currentTime
        this.getTimerInterval = setInterval(()=>{
            const currentTime = this.formateDate(Date.now());
            this.setState({currentTime})
        },1000)
    }
    getWeather = async ()=>{
        const {city , wendu , type} = await reqWeather()
        // 更新状态
        this.setState({city , wendu , type})
        // console.log(navigator)
    }


    getTitle = ()=>{
        // 得到当前请求路径
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item => {
            if(item.key === path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    // 在第一次render()之后执行一次
    // 在此执行异步操作  发Ajax请求,启动定时器
    componentDidMount(){
        // 获取当前时间
        this.getTimer()
        // 获取当前天气信息
        this.getWeather()
        
    }
    // 组件卸载之前
    componentWillUnmount(){
        // 关闭定时器
        clearInterval(this.getTimerInterval)
    }

    render() {
        const {currentTime , city , wendu , type} = this.state;
        const username = memoryUtils.user.username
        // 得到当前需要显示的标题
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎 , {username}</span>
                    <a onClick={this.showConfirm}>退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span>{city}</span>
                        <span>{wendu}℃</span>
                        <span>{type}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(HeaderNav);
