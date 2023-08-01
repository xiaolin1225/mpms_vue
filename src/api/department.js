import request from "@/utils/request";

export const requestDepartmentPageList = (params) => {
    return request({
        url: "/department/list/page",
        method: "get",
        params
    })
}

export const requestDepartmentTreeList = (params) => {
    return request({
        url: "/department/list/tree",
        method: "get",
        params
    })
}

export const requestDepartmentInfo = (id) => {
    return request({
        url: `/department/${id}`,
        method: "get",
    })
}

export const saveDepartmentInfo = (data) => {
    return request({
        url: `/department`,
        method: "post",
        data
    })
}

export const updateDepartmentInfo = (data) => {
    return request({
        url: `/department`,
        method: "put",
        data
    })
}

export const deleteDepartment = (id) => {
    return request({
        url: `/department/${id}`,
        method: "delete",
    })
}

export const deleteDepartments = (data) => {
    return request({
        url: `/department`,
        method: "delete",
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}