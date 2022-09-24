// 商品管理的添加和更新组件
import React, { Component } from 'react';
import {Card,Form,Input,Cascader,Button,message} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './RichTextEditor'


const {Item} = Form;
const {TextArea} = Input;


class ProductAddUpdate extends Component {

    picturesWallRef = React.createRef()
    richTextRef = React.createRef()

    state = {
        optionLists:[],
    }

    onFinish = async (values) =>{
        // console.log(values)
    // 1.收集数据，并封装成product对象
        const {name,desc,price,categoryIds} = values
        let  pCategoryId,categoryId
        if(categoryIds.length === 1){
            pCategoryId = '0'
            categoryId = categoryIds[0]
        }else{
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        // console.log(this.picturesWallRef.current)
        const imgs = this.picturesWallRef.current.getImgs()
        const detail = this.richTextRef.current.getdetail()
        // console.log(values ,imgs,detail)

        const product = {
            name,desc,price,pCategoryId,categoryId,imgs,detail
        }

        if(this.isUpdate){
            product._id = this.product._id
        }

    // 2.调用接口请求函数添加或更新商品
        const res = await reqAddOrUpdateProduct(product)
        
        if(res.status === 0){
            message.success(`${this.isUpdate ? '更新' : '添加' }商品成功`);
            this.props.history.goBack();
        }else{
            message.error(`${this.isUpdate ? '更新' : '添加' }商品失败`);
        }
        
    }

    // 异步获取一级/二级分类列表
    getCategorys = async (parentId) =>{
        const res = await reqCategorys(parentId)
        if(res.status === 0){
            const categorys = res.data
            // 判断如果是一级分类
            if(parentId === '0'){
                this.initOptionLists(categorys)
            }else{
                return categorys
            }
        }
    }

    initOptionLists = async (categorys) =>{
        // 根据categorys生成optionLists数组
        const optionLists = categorys.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: false,
        }))

        // 如果是一个二级分类下的商品的更新
        const {isUpdate,product} = this
        const {pCategoryId } = product
        if(isUpdate && pCategoryId !=='0'){
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的optionLists
            const childOptionLists = subCategorys.map( item =>({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
            // 找到当前商品对应的一级optionLists对象
            const targetOption = optionLists.find(item => item.value === pCategoryId) || {}
            // 关联到对应的一级optionLists上
            targetOption.children = childOptionLists
        }

        this.setState({
            optionLists
        })
    }

    // 用于加载下一级列表
    loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true; 

        // 根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if(subCategorys && subCategorys.length > 0){
            const childOptionLists = subCategorys.map( item =>({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
            targetOption.children = childOptionLists
        }else{
            targetOption.isLeaf = true
        }

        this.setState({
            optionLists:[...this.state.optionLists]
        })
      };

    // 自定义价格验证
    validatorPrice = async(rule , value) =>{
        let res = await Number(value);
        // console.log(res)
        if(res <= 0){
            return Promise.reject(new Error('价格不能小于零'))
        }else{
            return Promise.resolve();
        }
    }


    componentDidMount(){
        this.getCategorys('0')
    }

    UNSAFE_componentWillMount(){
        // 如果是点击修改按钮跳转到此页面，取出携带的state
        const product = this.props.location.state
        // 保存是否是更新的标识
        this.isUpdate = !! product
        this.product = product || {}
    }

    render() {

        const {isUpdate,product}  = this
        const {pCategoryId , categoryId , imgs,detail} = product
        const categoryIds = []
        if(isUpdate){
            // 商品是一个一级分类下的商品
            if(pCategoryId === '0'){
                categoryIds.push(categoryId)  
            }else{// 商品是一个二级分类下的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)    
            }
        }

        const title = (<span>
                <ArrowLeftOutlined onClick={() => this.props.history.goBack()} 
                style={{color:"#1DA57A",marginRight:15,fontSize:20}}
            />
                <span>{isUpdate ? "修改商品" : "添加商品"}</span>
            </span>)

        return (
            <Card className='add-card' title={title}>
                <Form 
                    onFinish={this.onFinish}
                    labelCol={{ span: 3 }}  //左侧label的宽度
                    wrapperCol={{ span: 10 }}  //右侧的宽度
                >
                    <Item 
                        label='商品名称' 
                        name='name'
                        initialValue={product.name}
                        rules={[
                            {required: true, message: '商品名称必须输入',},
                        ]}
                    >
                        <Input placeholder='请输入商品名称'></Input>
                    </Item>
                    <Item 
                        label='商品描述'  
                        name='desc'
                        initialValue={product.desc}
                        rules={[
                            {required: true, message: '商品描述必须输入',},
                        ]}
                    >
                        <TextArea placeholder='请输入商品描述' autoSize={{minRows:2,maxRows:6}}></TextArea>
                    </Item>
                    <Item 
                        label='商品价格' 
                        name='price'
                        initialValue={product.price}
                        rules={[
                            {required: true, message: '商品价格必须输入',},
                            {validator:this.validatorPrice}
                        ]}
                    >
                        <Input type='number' addonAfter="元" placeholder='请输入商品价格'></Input>
                    </Item>
                    <Item 
                        label='商品分类'
                        name='categoryIds'
                        initialValue={categoryIds}
                        rules={[
                            {required: true, message: '必须选择商品分类',},
                        ]}
                    >
                        <Cascader 
                            placeholder="请选择商品分类"
                            options={this.state.optionLists} 
                            loadData={this.loadData} 
                        />
                    </Item>
                    <Item 
                        label='商品图片' 
                        wrapperCol={{span: 16}}
                    >
                        <PicturesWall 
                            ref={this.picturesWallRef}
                            imgs={imgs}
                            />
                    </Item>
                    <Item label='商品详情' wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.richTextRef} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default ProductAddUpdate;
