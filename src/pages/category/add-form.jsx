// 添加分类的form组件
import React from 'react';
import { Select,Form, Input} from 'antd';
import './add-form.scss'

const { Option } = Select;
const Item = Form.Item

const  AddForm = React.forwardRef((props, ref)=> {

    // console.log(props)
    const {categorys,parentId} = props
    // console.log(categorys)
    // console.log(parent2Id)


    const onFinish = (values) => {
        // console.log('Success:', values);
        // const {parentId,categoryName} = values;
    };
    
        return (
            <Form onFinish={onFinish} ref={ref} className='category-form'>
                <Item name="parentId" initialValue={parentId}>
                    <Select
                        showSearch
                        placeholder="选择分类标题"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                        <Option value="0">一级分类</Option>
                        {
                            categorys.map( item => <Option value={item._id} key={item._id}>{item.name}</Option> )
                        }
                    </Select>                
                </Item>
                
                <Item 
                    name="categoryName" 
                    rules={[
                        {required: true, message: '分类名称不能为空',}
                    ]}
                >
                    <Input placeholder='请输入分类名称'></Input>
                </Item>
            </Form>
        );
})
export default AddForm;
