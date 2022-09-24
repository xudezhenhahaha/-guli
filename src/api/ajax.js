// 封装axios,用来发送ajax请求
// 函数的返回值是promise对象
import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={} , type="GET"){
        let promise
    // 优化：统一处理请求异常
    return new Promise((resolve,reject)=>{
        // 1.执行异步ajax请求
            if(type === "GET"){//发送GET请求
                promise = axios.get(url , {
                    params:data
                })
            }else{//发送POST请求
                promise = axios.post(url , data)
            }    
        // 2.如果成功，调用resolve(value)
            promise.then( response => {
                resolve(response.data)  //直接返回里面的data
            }).catch( error =>{ // 3.如果失败，不调用reject(reson),而是提示异常信息
                message.error('请求出错:' + error.message)
            })
        
    })
}