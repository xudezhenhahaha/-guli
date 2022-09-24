// 创建角色的组件
import React from 'react';
import { Form, Input} from 'antd';


const Item = Form.Item

const  AddForm = React.forwardRef((props, ref)=> {
    // console.log(props)    
    const onFinish = (values) => {
        // console.log('Success:', values);
        // const {categoryName} = values;
    };
    
        return (
            <Form onFinish={onFinish} ref={ref} className='addrole-form'>
                <Item 
                    label='角色名称'
                    name="addRoleName" 
                    rules={[
                        {required: true, message: '角色名称不能为空',}
                    ]}
                >
                    <Input placeholder='请输入角色名称'></Input>
                </Item>
            </Form>
        );
})
export default AddForm;

