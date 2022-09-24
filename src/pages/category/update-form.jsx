// 修改分类的form组件
import React from 'react';
import { Form, Input} from 'antd';


const Item = Form.Item

const  UpdateForm = React.forwardRef((props, ref)=> {
    // console.log(props)
    // const name = props.categoryName;
    
    const onFinish = (values) => {
        // console.log('Success:', values);
        // const {categoryName} = values;
    };
    
        return (
            <Form onFinish={onFinish} ref={ref} className='category-form'>
                <Item 
                    name="categoryName" 
                    // initialValue={name}
                    rules={[
                        {required: true, message: '分类名称不能为空',}
                    ]}
                >
                    <Input placeholder='请输入分类名称'></Input>
                </Item>
            </Form>
        );
})
export default UpdateForm;
