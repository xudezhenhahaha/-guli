// 商品管理的默认子路由组件
import React, { Component } from 'react';
import { Card,Select,Input,Table,Button,message} from 'antd';
import { PlusOutlined} from '@ant-design/icons';
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api/index';
import './home.scss'

const Option = Select.Option

class ProductHome extends Component {

    state = {
        total:0, //商品的总数量
        products:[], //商品列表
        loading:false,//是否为加载状态
        searchName:'',//搜索的关键字
        searchType:'productName',//搜索的类型
    }

    //初始化Table所有列标题以及按钮
    initColumns = ()=>{
        return this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
              width:180,
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render:(price)=> "￥" + price,
              width:50,
            },
            {
              title: '状态',
            //   dataIndex: 'status',

              render: (product) => {
                const {status,_id } = product
                // console.log(product)
                const newStatus = status=== 1 ? 2 : 1
                return(
                    <span>
                        <Button 
                            onClick={() => this.updateStatus(_id,newStatus)} 
                            type="primary"
                        >
                            {status === 1 ? '下架' : '上架'}
                        </Button>
                        <span>{status === 1 ? '在售' : '已下架'}</span>                    
                    </span>
                )
              },
              width:50,
            },
            {
              title: '操作',
              width:50,
              render: (product) => (
                <span>
                    <Button ghost 
                    // 路由跳转时，将product对象使用state传递给目标路由组件
                        onClick={() => this.props.history.push('/product/detail' , product )}
                    >详情</Button>
                    <Button
                        ghost
                        onClick={()=>this.props.history.push('/product/addUpdate', product )}
                    >修改</Button>
                </span>
              ),
            },
        ];
    }

    // 获取指定页码的商品列表数据
    getProducts = async (pageNum) =>{
        this.pageNum = pageNum //保存pageNum，让其他方法可以使用pageNum
        this.setState({loading:true})

        const {searchName,searchType} = this.state

        let result
        if(searchName){
            result = await reqSearchProducts({pageNum,pageSize:3,searchName,searchType})
        }else{
            result  = await reqProducts(pageNum,3)
        };
        if(result.status === 0){
            const {total , list} = result.data;
            this.setState({
                loading:false,
                total:total,
                products:list,
            })
        }
    }

    // 更新指定商品的状态
    updateStatus = async (productId,status) => {
        const res = await reqUpdateStatus(productId,status)
        // console.log(res)
        if(res.status === 0){
            message.success('商品状态更新成功')
            this.getProducts(this.pageNum)
        }
    }



    UNSAFE_componentWillMount(){
        this.initColumns(); 
    }

    componentDidMount(){
        this.getProducts(1);
    }


    render() {
        
        const {total,products,loading,searchType,searchName,} = this.state

        const title = (
            <span>
                <Select 
                   value={searchType} 
                   style={{width:120,marginRight:15}} 
                   onChange={value => this.setState({searchType:value})}
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input 
                    placeholder='关键字' 
                    style={{width:180,marginRight:10}} 
                    value={searchName} 
                    onChange={event => this.setState({searchName:event.target.value})}
                ></Input>
                <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (<Button 
                            type="primary"
                            onClick={()=>this.props.history.push('/product/addUpdate')}
                        ><PlusOutlined />添加
                        </Button>)

        return (
            <Card 
                className='productHome'
                title={title} 
                extra={extra}
            >
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={products} 
                    columns={this.columns} 
                    pagination={{
                        current:this.pageNum,
                        total:total, 
                        defaultPageSize:3, 
                        showQuickJumper:true,
                        onChange:(page)=>{
                            this.getProducts(page);
                        }
                    }}
                >

                </Table>
            </Card>
        );
    }
}

export default ProductHome;
