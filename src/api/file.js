import request from "@/utils/request";

/*获取文件列表*/
export const requestFileList = (params) => {
    return request({
        url: "/file",
        method: "get",
        params
    });
}

/*获取文件夹信息*/
export const requestFolderInfo = (params) => {
    return request({
        url: `/file/folder`,
        method: "get",
        params
    });
}

/*获取文件元数据*/
export const requestFileMeta = (params) => {
    return request({
        url: `/file/meta`,
        method: "get",
        params
    });
}

/*获取文件类别列表*/
export const requestFileType = (params) => {
    return request({
        url: `/file/type`,
        method: "get",
        params
    })
}

/*新建文件夹*/
export const createFolder = (params) => {
    return request({
        url: `/file/folder`,
        method: "post",
        params
    });
}

/*删除文件元数据*/
export const deleteFileMeta = (id) => {
    return request({
        url: `/file/meta/${id}`,
        method: "delete"
    });
}

/*保存文件信息*/
export const saveFileInfo = (id, data) => {
    return request({
        url: `/file/${id}`,
        method: "put",
        data
    });
}

/*删除文件*/
export const deleteFile = (id) => {
    return request({
        url: `/file/${id}`,
        method: "delete"
    });
}

/*批量删除文件*/
export const deleteFiles = (data) => {
    return request({
        url: `/file`,
        method: "delete",
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}