import request from "@/utils/request";

export const requestPositionListPage = (params) => {
    return request({
        url: "/position/list/page",
        method: "get",
        params
    })
}

export const requestPositionList = () => {
    return request({
        url: "/position/list",
        method: "get",
    })
}

export const requestPositionInfo = (id) => {
    return request({
        url: `/position/${id}`,
        method: "get",
    })
}

export const savePositionInfo = (data) => {
    return request({
        url: `/position`,
        method: "post",
        data
    })
}

export const updatePositionInfo = (data) => {
    return request({
        url: `/position`,
        method: "put",
        data
    })
}

export const deletePosition = (id) => {
    return request({
        url: `/position/${id}`,
        method: "delete",
    })
}

export const deletePositions = (data) => {
    return request({
        url: `/position`,
        method: "delete",
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}