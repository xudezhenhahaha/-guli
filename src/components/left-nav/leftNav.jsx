// 左侧导航栏组件
import React, { Component } from 'react';
import { Link,withRouter } from 'react-router-dom';
import './leftNav.scss';
import logo from '../../assets/images/logo.png'
// import {HomeOutlined,UserOutlined,AppstoreOutlined,UnorderedListOutlined,ToolOutlined,SafetyOutlined,AreaChartOutlined,BarChartOutlined,LineChartOutlined,PieChartOutlined} from '@ant-design/icons';
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';
import memoryUtils from '../../utils/memoryUtils'

function getItem(label, key, icon, children, type) {
    return {label, key, icon, children, type,};
};


// antd中menu组件自带的方法
// const items = [
//     getItem(<Link to="/home">首页</Link>, 'sub1', <HomeOutlined /> , ),
//     getItem('商品', 'sub2', <AppstoreOutlined />, [
//       getItem(<Link to='/category' >品类管理</Link>, 'sub3',<UnorderedListOutlined />),
//       getItem(<Link to='/product' >商品管理</Link>, 'sub4',<ToolOutlined />),
//     ]),
//     getItem(<Link to='/user' >用户管理</Link>, 'sub5', <UserOutlined />),
//     getItem(<Link to='/role' >角色管理</Link>, 'sub6', <SafetyOutlined />),
//     getItem('图形图表', 'sub7', <AreaChartOutlined />, [
//       getItem(<Link to='/charts/bar' >柱形图</Link>, 'sub8',<BarChartOutlined />),
//       getItem(<Link to='/charts/line' >折线图</Link>, 'sub9',<LineChartOutlined />),
//       getItem(<Link to='/charts/pie' >饼图</Link>, 'sub10',<PieChartOutlined />),
//     ]),
//   ];
// console.log(items)

class LeftNav extends Component {

    // 判断当前登录用户对item是否有权限
    hasAuth = (item) =>{
        const {key,isPublic} = item
        const menus = memoryUtils.user.role.menus

        if(isPublic || menus.indexOf(key) !== -1){
            return true
        }else if(item.children ){
            return  !! item.children.find(child => menus.indexOf(child.key) !== -1)
        }else{
            return false
        }
    }
    
// console.log(menuList);
    // 根据menuList的数据数组动态生成对应的标签数组
    getMenuNode = (menuList)=>{
        return menuList && menuList.map((item)=>{

            // 如果当前用户有item对应的权限，才需要显示对应的菜单项
            if(this.hasAuth(item)){
                if(!item.children){ //不存在子菜单,map方法遍历创建菜单节点
                    return getItem(<Link to={item.key} >{item.title}</Link>, item.key , <item.icon />)
                }else{  //存在子菜单
                    const children = item.children; //获取子菜单数组
    
                    // 得到当前请求的路由路径
                    const path = this.props.location.pathname
                    //在子菜单数组中查找一个与当前请求路径匹配的子菜单项
                    const cItem = children.find((cItem) => path.indexOf(cItem.key) === 0)
                    // console.log(cItem)
                    // 如果存在,说明当前item的子菜单需要展开,将菜单的 key 保存为 openKey
                    if(cItem){
                        // console.log(item.key)
                        this.openKey = item.key
                    }
                    
                // 基础写法(在封装一个函数传入子菜单数组,然后map方法遍历创建子菜单节点)
                    // const getChildrenNode = (children)=>{ //根据子菜单数组，map方法遍历创建子菜单节点
                    //     return children.map(data=>{
                    //         return getItem(<Link to={data.key} >{data.title}</Link>, data.key , <data.icon />)
                    //     })
                    // }
                    // const childrenNodes = getChildrenNode(children);  //得到子菜单节点
    
                // 使用递归 ( map()+递归, 直接在内部使用getMenuNode并传入子菜单数组) 
                    const childrenNodes = this.getMenuNode(children);  //得到子菜单节点
                    // console.log(childrenNodes)
    
                // 将得到的子菜单节点传入,由此创建带有子菜单的节点
                    return getItem(item.title, item.key , <item.icon />, childrenNodes)
                }
            }
        })
    }

    // 在第一次render之前,执行一次,为第一次render渲染准备数据
    UNSAFE_componentWillMount(){
        this.menuNodes = this.getMenuNode(menuList); //得到所有菜单节点
        // console.log(this.menuNodes);        
    }
    render() {
        // 得到当前请求的路由路径,本组件为非路由组件,所以可以引入withRouter: 高阶组件: 
        // withRouter作用:包装非路由组件,返回一个包装后的新组件, 新组件会向被包装组件传递 history/location/match 属性
        let path = this.props.location.pathname
        if(path.indexOf('/product') === 0){
            path = '/product'
        }
        
        // 取出需要打开的菜单项的key
        const openKey = this.openKey 

        return (
            <div className='left-nav'>   
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="" />
                    <h1>谷粒后台</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    items={this.menuNodes}
                />
            </div>            
        );
    }
}

export default withRouter(LeftNav);
