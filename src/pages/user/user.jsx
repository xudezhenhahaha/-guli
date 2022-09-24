// 用户管理
import React, { Component } from 'react';
import {Card , Button , Table , Modal ,message} from 'antd';
import UserForm from './user-form'
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api/index'
import './user.scss'


class User extends Component {

    userRef = React.createRef()

    state = {
        users:[], //所有的用户列表
        roles:[],  //所有角色的列表
        isShow:false
    }

    // 将授权时间改成年月日的格式
    formateDate=(time)=> { 
        if (!time) return '' ;
        let date = new Date(time);   //也可以不传参数，new Date()不传参数的时候返回当前时间
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() 
    }


    initColumns = () =>{
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:(create_time)=>this.formateDate(create_time)
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id) => this.roleNames[role_id]
            },
            {
                title:'操作',
                render:(user)=>(
                    <span>
                        <Button ghost onClick={()=>this.showUpdate(user)}>修改</Button>
                        <Button ghost onClick={()=>this.deleteUser(user)}>删除</Button>
                    </span>
                )
            },
        ]
    }

    // 根据roles数组，生成包含所有角色名的对象(属性名用角色的id值)
    initRoleNames = (roles) =>{
        const roleNames = roles.reduce((pre,role) => {
            pre[role._id] = role.name
            return pre
        },{})

        this.roleNames = roleNames
    }

    getUsers = async () =>{
        const res = await reqUsers()
        // console.log(res)
        if(res.status === 0){
            const {users,roles} = res.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles,
            })
        }
    }

    // 删除指定用户
    deleteUser = (user) =>{
        Modal.confirm({
            title:`确认删除${user.username}吗?`,
            okText:'确定',
            cancelText:'取消',
            onOk:async ()=>{
                const res = await reqDeleteUser(user._id)
                if(res.status === 0){
                    message.success('删除成功')
                    this.getUsers()
                }
            },
        })
    }

    // 显示修改界面
    showUpdate = (user)=>{
        this.user = user 
        this.setState({isShow:true})
    }

    // 显示添加页面
    showAdd = () =>{
        this.user = null
        this.setState({isShow:true})
    }

    // 添加|更新用户
    addOrUpdateUser = async ()=>{
        // console.log(this.userRef)
        const user = this.userRef.current.getFieldsValue()
        // console.log(user)
        this.userRef.current.resetFields();

        if(this.user ){
            user._id = this.user._id
        }
        const res = await reqAddOrUpdateUser(user)
        // console.log(res)
        if(res.status === 0){
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            this.getUsers()
            this.setState({isShow:false})
        }else{
            message.error(`${this.user ? '修改' : '添加'}用户失败`)
        }

    }

    UNSAFE_componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getUsers()
    }

    render() {
        const {users,isShow,roles} = this.state
        const user = this.user 

        const title = <Button type="primary" onClick={()=>this.showAdd()} >创建用户</Button>

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users} 
                    columns={this.columns} 
                    pagination={{defaultPageSize:5,showQuickJumper:true,}}
                />

                <Modal 
                   title={user ? '修改用户' : '创建用户'} 
                //    forceRender
                   visible={isShow} 
                   onOk={() => {this.addOrUpdateUser()}} 
                   onCancel={()=>{
                    this.setState({isShow:false})
                    this.userRef.current.resetFields();
                   }}
                   okText='确定'
                   cancelText='取消'
                >
                    <UserForm ref={this.userRef} roles={roles} user={user}></UserForm>
                </Modal>


            </Card>
        );
    }
}

export default User;
