// 角色管理
import React, { Component } from 'react';
import {Card , Button , Table , Modal ,message} from 'antd'
import AddForm from './addForm';
import AuthForm from './authForm';
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'


class Role extends Component {

    addFormRef = React.createRef();
    authFormRef = React.createRef();


    state ={
        roles:[],//所有角色的列表
        role:{},//选中的role
        showStatus:0,//标识创建角色的确认框是否显示，0都不显示，1显示设置权限，2显示创建角色

    }

    // 初始化table的列标题
    initColumns = ()=>{
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name',
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time)=>this.formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:(auth_time) => this.formateDate(auth_time)
            },
            {
                title:'授权人',
                dataIndex:'auth_name',
            },
        ]
    }

    // 获取角色列表
    getRoles = async () =>{
        const res = await reqRoles()
        // console.log(res)
        if(res.status === 0){
            const roles = res.data
            this.setState({
                roles
            })
        }
    }

    onRow = (role) =>{
        return {
            onClick: event =>{//单击选中
                // console.log(role)
                this.setState({role})
            },
            onDoubleClick: event => { //双击取消选中
                this.setState({role:{}})
            },
        }
    }

    // 显示创建角色确认框
    showAdd = ()=>{
        const {resetFields} = this.addFormRef.current ;
        resetFields();

        // 更新状态
        this.setState({
            showStatus : 2
        })
    }

    // 显示设置角色权限
    showAuth = ()=>{
        // console.log(this.authFormRef)
        // const {resetFields} =  this.authFormRef.current;
        // resetFields();
        this.setState({showStatus:1})
    }

    // 点击隐藏确认框
    handleCancel = () =>{
        const {resetFields} =  this.addFormRef.current || this.authFormRef.current;
        resetFields();

        this.setState({
            showStatus : 0
        })
    }

    // 创建角色
    addRole = async ()=>{
        const {submit,getFieldsValue,resetFields} = this.addFormRef.current

        const res = getFieldsValue()
        // console.log(res)
        const {addRoleName} =res

        // 调用form表单的提交
        submit()

        // 如果内容为空则返回
        if(!addRoleName)return;
        // resetFields重置所有表达项
        resetFields();

        // 发送请求，实现创建角色
        const data = await reqAddRole(addRoleName)
        // console.log(data)
        if(data.status === 0){
            message.success('创建角色成功')
            // 重新显示列表
            this.getRoles()
            // 隐藏确认框
            this.setState({
                showStatus : 0
            })
        }else{
            message.error('创建角色失败')
        }
    }


    // 将授权时间改成年月日的格式
    formateDate=(time)=> { 
        if (!time) return '' ;
        let date = new Date(time);   //也可以不传参数，new Date()不传参数的时候返回当前时间
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() 
    }

    // 设置角色权限
    updateRole = async ()=>{
        // console.log(this.authFormRef.current.getNewMenus())
        const menus = this.authFormRef.current.getNewMenus()
        const {_id} = this.state.role
        const auth_time = Date.now()
        const auth_name = memoryUtils.user.username
        

        const res = await reqUpdateRole({_id,menus,auth_time,auth_name})
        // console.log(res)
        if(res.status === 0){
            message.success('角色权限设置成功')
            this.getRoles()
            // 如果当前更新的是自己的角色权限，更新成功后强制退出
            if(_id === memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('权限发生改变，请重新登录')
            }else{
                this.setState({
                    roles:[...this.state.roles]
                })    
            }
        }else{
            message.error('角色权限设置失败')
        }


        this.setState({
            showStatus : 0
        })
    }



    UNSAFE_componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getRoles()
    }

    render() {
        const {roles,role,showStatus} = this.state

        const title = (
            <span>
                <Button 
                    type="primary" 
                    style={{marginRight:10}}
                    onClick={() =>{this.showAdd()}}
                >
                创建角色</Button>
                <Button 
                    type="primary" 
                    disabled={role._id ? false : true}
                    onClick={() =>{this.showAuth()}}
                >设置角色权限</Button>
            </span>
        )

        return (
            <Card
                title={title}
            >
                <Table
                    bordered
                    rowKey='_id'
                    rowSelection={{
                        type:"radio",
                        selectedRowKeys:[role._id],
                        onSelect:(role)=>{
                            this.setState({
                                role
                            })
                        }
                    }}
                    dataSource={roles} 
                    columns={this.columns} 
                    pagination={{defaultPageSize:5,showQuickJumper:true,}}
                    onRow={this.onRow}
                />


                <Modal 
                   title="创建角色" 
                   forceRender
                   visible={showStatus === 2 ? true : false} 
                   onOk={() => {this.addRole()}} 
                   onCancel={this.handleCancel}
                   okText='确定'
                   cancelText='取消'
                >
                    <AddForm 
                        ref={this.addFormRef}
                    >
                    </AddForm>
                </Modal>


                <Modal 
                   title="设置角色权限" 
                //    forceRender
                   visible={showStatus === 1 ? true : false} 
                   onOk={() => {this.updateRole()}} 
                   onCancel={this.handleCancel}
                   okText='确定'
                   cancelText='取消'
                >
                    <AuthForm 
                        ref={this.authFormRef}
                        role = {role}
                    >
                    </AuthForm>
                </Modal>

            </Card>

            

        );
    }
}

export default Role;
