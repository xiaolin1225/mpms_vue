const logOperationType = (status) => {
    let statusText = "其他";
    switch (status) {
        case 0:
            statusText = "其他";
            break;
        case 1:
            statusText = "新增";
            break;
        case 2:
            statusText = "修改";
            break;
        case 3:
            statusText = "删除";
            break;
        case 4:
            statusText = "授权";
            break;
        case 5:
            statusText = "导出";
            break;
        case 6:
            statusText = "导入";
            break;
        default:
            statusText = "其他";
            break;
    }
    return statusText;
}

export {
    logOperationType
}