// 封装一些方法，将数据存储在localStorage中，或者从localStorage中读取，删除等
const USER_KEY = "user_key"
const storageUtils ={
    // 保存user
    saveUser(user){
        localStorage.setItem(USER_KEY , JSON.stringify(user));
    },
    // 读取user
    getUser(){
        return JSON.parse(localStorage.getItem(USER_KEY)  || '{}');
    },
    // 删除user
    removeUser(){
        localStorage.removeItem(USER_KEY);
    }
}
export default storageUtils