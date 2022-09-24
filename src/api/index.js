// 包含应用中所有接口请求函数的模块
// 每个函数的返回值都是promise
import ajax from './ajax'
import jsonp from 'jsonp';
import { message } from 'antd';

// const BASE = 'http://localhost:5000'
const BASE = ''

// 登录
// export function reqLogin({username , password}){
//     return ajax('/login', {username , password} , 'POST')
// }
export const reqLogin = (username , password)=> ajax(BASE+'/login', {username , password} , 'POST');

// 添加用户
export const reqAdduser = (user)=> ajax(BASE+'/manage/user/add' , user , 'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId)=> ajax(BASE + '/manage/category/list',{parentId})

// 添加分类
export const reqAddCategory = (categoryName,parentId)=> ajax(BASE + '/manage/category/add',{categoryName,parentId} , 'POST')

// 更新分类
export const reqUpdateCategory = (categoryId,categoryName)=> ajax(BASE + '/manage/category/update',{categoryId,categoryName} , 'POST')

// 获取分类
export const reqCategory = (categoryId) => ajax(BASE +'/manage/category/info' , {categoryId})

// 获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE + '/manage/product/list' ,{pageNum,pageSize})

// 搜索商品分页列表
// searchType:搜索的类型，productName/productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=> ajax(BASE + '/manage/product/search' , {
    pageNum,
    pageSize,
    [searchType]:searchName,
})

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId,status) => ajax(BASE + '/manage/product/updateStatus', {productId,status} ,'POST')

// 删除上传的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name} , 'POST')

// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/'+ (product._id ? 'update' : 'add') ,product , 'POST')

// 获取角色列表
export const reqRoles = () =>ajax(BASE + '/manage/role/list' )

// 创建角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add',{roleName} ,'POST' )

// 更新角色（设置角色权限）
export const reqUpdateRole = ({_id,menus,auth_time,auth_name}) => ajax(BASE + '/manage/role/update', {_id,menus,auth_time,auth_name} ,'POST' )

// 获取用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete' , {userId} , 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add') , user , 'POST')

// jsonp请求的接口请求函数(获取天气信息)
export const reqWeather = () => {
    return new Promise( (resolve, reject) => {   

        const getIpUrl = 'https://api.ipify.org/?format=jsonp' 
        jsonp(getIpUrl , {timeout:30000,} , async (err , data1)=>{  //获取ip地址
            const ip = await data1.ip
            // console.log(ip)

            const GetCityUrl = `https://api.map.baidu.com/location/ip?ak=EUbIqtvuAxXOmGFgFldG2ZOMYSqdxNG3&ip=${ip}&coor=bd09ll`
            jsonp(GetCityUrl , {timeout:35000,} , async (err , data2)=>{ //根据IP地址得到城市
                // console.log(data2)
                // console.log(data2.content.address_detail.city)
                const province = data2.content.address_detail.province 
                const city = await data2.content.address_detail.city || province.substring(0,province.length - 1)
                // console.log(city)

                const url = `http://wthrcdn.etouch.cn/weather_mini?city=${city}`
                jsonp(url , {timeout:40000,} , (err , data)=>{  //根据城市获取天气信息
                    // console.log(url ,err , data.data)
                    if(!err && data.desc === "OK"){
                        const {city,wendu} = data.data
                        const {type} = data.data.forecast[0]
                        // console.log(city,wendu,type)
                        resolve({city,wendu,type})
                    }else{
                        message.error('获取天气信息失败')
                    }
                })
            })
        })   
    })
}
// reqWeather();



