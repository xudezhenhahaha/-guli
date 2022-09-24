// 创建角色的组件
import React ,{PureComponent} from 'react';
import { Form, Input,Tree} from 'antd';
import menuList from '../../config/menuConfig';

const Item = Form.Item
const treeData = [
    {
        title:'平台权限',
        key:'all',
        children:[...menuList]
    }
]
class AuthForm extends PureComponent{

    constructor(props){
        super(props)

        // console.log(props)
        
        const {menus} = props.role
        this.state = {
            checkedKeys:menus
        } 
    }
    
    
    onCheck = (checkedKeysValue) => {
        // console.log('onCheck', checkedKeysValue);
        this.setState({
            checkedKeys:checkedKeysValue
        })
    };

    onFinish = (values) => {
        // console.log('Success:', values);
    };

    getNewMenus = () => this.state.checkedKeys

    // 根据新传入的role来更新checkedKeys
// 当组件接受到新的属性时自动调用
    UNSAFE_componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }

    render(){
        const {checkedKeys} = this.state
        const {role} = this.props
            return (
                    <Form onFinish={this.onFinish}  className='role-form'>
                        <Item 
                            label='角色名称'
                            name="RoleName" 
                        >
                            <Input disabled placeholder={role.name}></Input>
                        </Item>

                        <Tree
                            checkable
                            defaultExpandAll
                            onCheck={this.onCheck}
                            checkedKeys={checkedKeys}
                            treeData={treeData}
                        />
                    </Form>
                );
            }
}

export default AuthForm;
