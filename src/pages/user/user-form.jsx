// 添加和修改用户的组件
import React from 'react';
import { Form, Input,Select} from 'antd';


const Item = Form.Item
const Option = Select.Option

const  UserForm = React.forwardRef((props, ref)=> {
    // console.log(props) 
    const {roles} = props 
    const user = props.user || {}  
    // console.log(roles) 
    // console.log(user) 

    const onFinish = (values) => {
        // console.log('Success:', values);
        // const {categoryName} = values;
    };
    
        return (
            <Form onFinish={onFinish} ref={ref} className='addrole-form' labelCol={{span:4}}>
                <Item 
                    label='用户名'
                    name="username" 
                    initialValue= {user.username }
                    rules={[
                        {required: true, message: '用户名不能为空',}
                    ]}
                >
                    <Input placeholder='请输入用户名'></Input>
                </Item>
                <Item 
                    label='密码'
                    name="password" 
                    initialValue={ user.password}
                    rules={[
                        {required: true, message: '密码不能为空',}
                    ]}
                >
                    <Input type='password' placeholder='请输入密码'></Input>
                </Item>
                <Item 
                    label='手机号'
                    name="phone"
                    initialValue={ user.phone } 
                    rules={[
                        {required: true, message: '手机号不能为空',}
                    ]}
                >
                    <Input placeholder='请输入手机号'></Input>
                </Item>
                <Item 
                    label='邮箱'
                    name="email" 
                    initialValue={ user.email }
                    rules={[
                        {required: true, message: '邮箱不能为空',}
                    ]}
                >
                    <Input placeholder='请输入邮箱'></Input>
                </Item>
                <Item 
                    label='角色'
                    name="role_id" 
                    initialValue={user._id }
                >
                    <Select placeholder='请选择角色分类'>
                        {
                            roles.map(item => <Option key={item._id} value={item._id}>{item.name}</Option> )
                        }
                    </Select>
                </Item>
            </Form>
        );
})
export default UserForm;

