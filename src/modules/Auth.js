export default class VKAuth {
    constructor(param) {
        let {API_KEY, vkParam, responseVersion} = param;

        this.API_KEY = API_KEY;
        this.vkParam = vkParam;
        this.responceVersion = responseVersion;
    }

    auth() {
        return new Promise((resolve, reject) => {
            VK.init({
                apiId: this.API_KEY
            });
            VK.Auth.login(function (response) {
                if (response.session) {
                    resolve();
                } else {
                    reject(new Error('не удалось авторизоваться'));
                }
            }, this.vkParam);
        })
    }

    callApi(method, param) {
        param.v = this.responceVersion;

        return new Promise((resolve, reject) => {
            VK.api(method, param, data => {
                if (data.error) {
                    reject(data.error)
                } else {
                    resolve(data.response)
                }
            })
        })
    }
}