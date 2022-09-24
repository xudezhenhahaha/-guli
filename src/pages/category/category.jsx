// 商品分类
import React, { Component } from 'react';
import { Card,Table,Modal,Button, message} from 'antd';
import { PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';
import {reqCategorys,reqAddCategory,reqUpdateCategory} from '../../api/index'
import AddForm from './add-form';
import UpdateForm from './update-form';
import './category.scss'

class Category extends Component {
    // 创建修改分类这个子组件的ref
    updateFormRef = React.createRef();
    // 创建添加分类这个子组件的ref
    addFormRef = React.createRef();


    state = {
        loading:false, //是否加载中
        categorys : [], //一级分类列表
        subCategorys:[], //子分类列表
        parentId:'0',  //当前获取的分类列表的parentId值
        parentName:'', //当前需要显示的分类列表的父分类名称
        showStatus:0,//标识添加/修改的确认框是否显示，0都不显示，1显示添加，2显示修改
    }

    //初始化Table所有列标题以及按钮
    initColumns = ()=>{
        return this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              width:300,
              dataIndex: '',
              key: '_id',
              render: (category) => (
                <span>
                    <Button ghost onClick={() =>{this.showUpdate(category)}}>修改分类</Button>
                    {this.state.parentId==='0' ? 
                    <Button onClick={()=>{this.showSubCategorys(category)}} ghost>查看子分类</Button>
                    :
                    null
                    }
                </span>
              ),
            },
        ];
    }



    // 异步获取一级分类列表显示
    getCategorys = async () =>{
        // 在发送请求获取数据前，显示loading
        this.setState({loading:true})
        const {parentId} = this.state
        const res = await reqCategorys(parentId)
        // 在请求完成后，隐藏loading
        this.setState({loading:false})

        if(res.status === 0){
            // 去除分类列表(可能是一级，也有可能是二级)
            const categorys = res.data
            if(parentId === '0'){
                // 更新一级状态
                this.setState({categorys})
            }else{
                // 更新二级分类状态
                this.setState({subCategorys:categorys})
            }
        }else{
            message.error("获取分类列表失败")
        }
    }

    // 显示一级分类列表
    showFirstCategorys = ()=>{
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[],
        } , ()=>{
            this.getCategorys();
        })
    }

    // 显示指定一级分类对象的二级列表
    showSubCategorys = (category)=>{
        // 先更新状态
        this.setState({
            parentId:category._id,
            parentName:category.name
        } , () => { //setState第二个参数是回调函数，会在状态更新且render()后执行
            // console.log(this.state.parentId)
            this.getCategorys();
        });    
    }

    // 点击隐藏确认框
    handleCancel = () =>{
        const {resetFields} = this.updateFormRef.current || this.addFormRef.current;
        resetFields();

        this.setState({
            showStatus : 0
        })
    }

    // 显示添加分类确认框
    showAdd = ()=>{
        const {resetFields} =  this.addFormRef.current;
        resetFields();

        this.setState({
            showStatus : 1
        })
    }
    // 显示修改分类确认框
    showUpdate = (category)=>{
        const {resetFields} = this.updateFormRef.current ;
        resetFields();

        // 保存分类对象
        this.category = category
        // console.log(this.category)
        // 更新状态
        this.setState({
            showStatus : 2
        })
    }

    // 添加分类
    addCategory = async () =>{
        // console.log('addCategory')
        // console.log(this.addFormRef.current)
        const {submit,getFieldsValue,resetFields} = this.addFormRef.current
        const res = getFieldsValue()
        // console.log(res)
        const {parentId,categoryName} =res

        // 调用form表单的提交
        submit()

        // 如果内容为空则返回
        if(!categoryName)return;
        
        // resetFields重置所有表达项
        resetFields();

        const data = await reqAddCategory(categoryName,parentId)
        // console.log(data)
        if(this.state.parentId === parentId){
            // 重新显示列表
            this.getCategorys()
        }
        // 隐藏确认框
        this.setState({
            showStatus : 0
        })  
    }

    // 修改分类
    updateCatrgory = async () =>{
        // console.log('updateCatrgory')
        // console.log(this.updateFormRef.current)

        // 准备数据
        const categoryId = this.category._id
        const {submit,getFieldsValue,resetFields} = this.updateFormRef.current;
        const res = getFieldsValue()
        const categoryName =res.categoryName
        // console.log(categoryId)
        // console.log(categoryName)

        // 调用form表单的提交
        submit()

        // 如果内容为空则返回
        if(!categoryName)return;

        // resetFields重置所有表达项
        resetFields();
        
        // 发送请求，实现修改分类名称
        const data = await reqUpdateCategory(categoryId,categoryName)
        // console.log(data)
        // 重新显示列表
        this.getCategorys()
        // 隐藏确认框
        this.setState({
            showStatus : 0
        })
    }


    UNSAFE_componentWillMount(){
        this.initColumns(); 
    }

    // 发送异步请求
    componentDidMount(){
        // 获取一级分类列表
        this.getCategorys();
    }

    render() {

        // 读取状态数据
        const {categorys,subCategorys,parentId,parentName,loading,showStatus} = this.state
        const category = this.category || {}
        

        // card的左侧标题
        const title = parentId === '0' ?  "一级分类列表" : (
            <span>
                <Button onClick={this.showFirstCategorys}>一级分类标题</Button>
                <ArrowRightOutlined style={{marginRight:10}}/>
                <span>{parentName}</span>
            </span>    
        )
        // card的右侧
        const extra = (<Button type="primary" onClick={this.showAdd}><PlusOutlined />添加</Button>)

          
        return (            
            <Card
                className='category'
                title={title}
                extra={extra}
            >
                <Table 
                    // sticky={true}
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId==='0' ? categorys : subCategorys} 
                    columns={this.columns} 
                    pagination={{defaultPageSize:5,showQuickJumper:true,}}
                /> 

                <Modal 
                   title="添加分类" 
                   forceRender
                   visible={showStatus === 1 ? true : false} 
                   onOk={this.addCategory} 
                   onCancel={this.handleCancel}
                   okText='确定'
                   cancelText='取消'
                >
                    <AddForm 
                        ref={this.addFormRef}
                        categorys = {categorys}
                        parentId = {parentId}
                    >
                    </AddForm>
                </Modal>
                <Modal 
                   title="修改分类" 
                   forceRender
                   visible={showStatus === 2 ? true : false} 
                   onOk={() => {this.updateCatrgory()}} 
                   onCancel={this.handleCancel}
                   okText='确定'
                   cancelText='取消'
                >
                    <UpdateForm 
                        ref={this.updateFormRef}
                        categoryName={category.name}
                    >
                    </UpdateForm>
                </Modal>
            </Card>
            
        );
    }
}

export default Category;
