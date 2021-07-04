function UserService () {
    this.getUserListAPI =  function () {
        return axios({
            url: `https://60db09f4801dcb0017290db1.mockapi.io/api/teachers`,
            method: "GET"
        })
    };

    this.addUserAPI = function (user) {
        return axios ({
            url :`https://60db09f4801dcb0017290db1.mockapi.io/api/teachers`,
            method: "POST",
            data: user,
        })
    };

    this.deleteUserAPI = function (id) {
        return axios ({
            url :`https://60db09f4801dcb0017290db1.mockapi.io/api/teachers/${id}`,
            method: "DELETE",
        })
    };

    this.getInforUser = function (id) {
        return axios ({
            url :`https://60db09f4801dcb0017290db1.mockapi.io/api/teachers/${id}`,
            method: "GET",
        })
    };

    this.updateUserAPI = function (user, id) {
        return axios ({
            url :`https://60db09f4801dcb0017290db1.mockapi.io/api/teachers/${id}`,
            method: "PUT",
            data: user,
        })
    };
    

}