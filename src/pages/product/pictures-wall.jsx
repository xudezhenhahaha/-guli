// 图片上传的组件
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload,message } from 'antd';
import {reqDeleteImg} from '../../api'
import { BASE_IMG_URL } from '../../utils/constants';


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
});


class PicturesWall extends Component {

    constructor(props){
        super(props)

        let fileList = []

        const {imgs} = this.props
        if(imgs && imgs.length > 0){
            fileList = imgs.map( (item,index) => ({
                uid:-index,
                name:item,
                status:'done',
                url:BASE_IMG_URL + item,
            }))
        }
        
        this.state = {
            previewOpen:false,
            previewImage:'',
            fileList:fileList
        }
    }

    static propTypes = {
        imgs : PropTypes.array
    }

    state = {
        previewOpen:false,
        previewImage:'',
        fileList:[]
    }

    // 获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(item => item.name)
    }

    handleChange = async ({ file,fileList }) => {
        if(file.status === 'done'){ //图片上传完成
            const result = file.response
            if(result.status === 0){
                message.success('图片上传成功');
                const {name , url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            }else{
                message.error('图片上传失败')
            }
        }else if(file.status === 'removed'){
            const res = await reqDeleteImg(file.name)
            if(res.status === 0){
                message.success('图片删除成功');
            }else{
                message.error('图片删除失败')
            }
        }

        this.setState({fileList})
    };

    handleCancel =()=>{
        this.setState({previewOpen:false})
    }

    handlePreview = async (file) => {
        if (!file.url && !file.thumbUrl) {
          file.thumbUrl = await getBase64(file.originFileObj);
        }
        
        this.setState({
            previewImage:file.url || file.thumbUrl,
            previewOpen:true,
        })
    };

    render() {

        const {fileList,previewOpen,previewImage} = this.state
        const uploadButton = (
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                上传图片
              </div>
            </div>
        );


        return (
            <div>
                <Upload
                    action="/manage/img/upload" //上传图片的接口路径
                    accept='image/*'  //只接收图片格式
                    name='image'    //指定请求参数名
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewOpen}  footer={null} onCancel={this.handleCancel}>
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall;

