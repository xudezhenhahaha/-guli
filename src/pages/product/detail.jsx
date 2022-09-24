// 商品管理的默认子路由组件
import React, { Component } from 'react';
import {Card,List} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import { BASE_IMG_URL } from '../../utils/constants';
import {reqCategory} from '../../api/index'
import './detail.scss'


const Item = List.Item

class ProductDetail extends Component {

    state = {
        cName1:'',//一级分类名称
        cName2:'',//二级分类名称
    }

    async componentDidMount(){
        const {pCategoryId,categoryId} = this.props.location.state
        if(pCategoryId === '0'){
            const result = await reqCategory(categoryId) 
            const cName1 = result.data ? result.data.name : '暂无分类'
            this.setState({cName1})
        }else{
            // 通过多个await方式发送多个请求，后面一个请求是在前一个请求成功返回之后才发送
            // const result1 = await reqCategory(pCategoryId) 
            // const result2 = await reqCategory(categoryId) 
            // const cName1 = result1.data ? result1.data.name : '暂无分类'
            // const cName2 = result2.data ? result2.data.name : ''

            // 解决方法，一次性发送多个请求，只有都成功了，才正常处理
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const cName1 = results[0].data ? results[0].data.name : '暂无分类'
            const cName2 = results[1].data ? results[1].data.name : ''

            this.setState({cName1,cName2})
        }
    }

    render() {

        // 读取路由携带过来的state数据
        const {name,desc,price,imgs,detail} = this.props.location.state
        const {cName1,cName2} = this.state
        

        const title = <span><ArrowLeftOutlined onClick={() => this.props.history.goBack()} style={{color:"#1DA57A",marginRight:15,fontSize:20}}/><span>商品详情</span></span>

        return (
            <Card
               title={title}
               className='product-detail'
            >
                <List>
                    <Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类:</span>
                        <span>{cName1} {cName2 ? "-->"+cName2:''}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品照片:</span>
                        <span>
                            {
                                imgs.map(item =>(
                                    <img
                                        key={item}
                                        className='product-img'
                                        src={BASE_IMG_URL + item} alt="" 
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>  
            </Card>
        );
    }
}

export default ProductDetail;
