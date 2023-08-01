import request from "@/utils/request";

/*获取文件列表*/
export const requestFileListPage = (params) => {
    return request({
        url: "/media/list/page",
        method: "get",
        params
    });
}

/*获取文件夹列表*/
export const requestFolderList = (params) => {
    return request({
        url: `/media/folder/list`,
        method: "get",
        params
    });
}

/*获取文件夹信息*/
export const requestFolderInfo = (params) => {
    return request({
        url: `/media/folder`,
        method: "get",
        params
    });
}

/*获取文件数据*/
export const requestFileInfo = (id) => {
    return request({
        url: `/media/${id}`,
        method: "get",
    });
}

/*获取文件元数据*/
export const requestFileMeta = (params) => {
    return request({
        url: `/media/meta`,
        method: "get",
        params
    });
}

/*获取文件类别列表*/
export const requestFileType = (params) => {
    return request({
        url: `/media/type`,
        method: "get",
        params
    })
}

/*新建文件夹*/
export const createFolder = (params) => {
    return request({
        url: `/media/folder`,
        method: "post",
        params
    });
}

/*删除文件元数据*/
export const deleteFileMeta = (id) => {
    return request({
        url: `/media/meta/${id}`,
        method: "delete"
    });
}

/*保存文件信息*/
export const saveFileInfo = (id, data) => {
    return request({
        url: `/media/${id}`,
        method: "put",
        data
    });
}

/*删除文件*/
export const deleteFile = (id) => {
    return request({
        url: `/media/${id}`,
        method: "delete"
    });
}

/*批量删除文件*/
export const deleteFiles = (data) => {
    return request({
        url: `/media`,
        method: "delete",
        data,
    });
}