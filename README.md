<p align="center">
	<img alt="logo" src="https://raw.githubusercontent.com/xiaolin1225/mpms_vue/master/src/assets/logo.png">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">高校融媒体管理系统</h1>
<h4 align="center">基于SpringBoot开发的高校融媒体管理平台</h4>
<p align="center">
</p>

## 简介

本项目建立聚合发布平台,实现一个平台管理多平台自媒体账号。实现一个平台对下属的微博、微信等多平台自媒体账号的统一管理可通过权限管理系统，对下属账号进行权限控制，明确划分任务，实现分级审核等功能。帮助高校宣传部门更好的完成对所属融媒体账号进行管理。

* 本项目为前后端分离项目，后端项目请移步[MediaPlatformManagerSystem](https://github.com/xiaolin1225/MediaPlatformManagerSystem)

## 内置功能

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3.  岗位管理：配置系统用户所属担任职务。
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.  通知公告：系统通知公告信息发布维护。
7.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
8.  平台管理：配置融媒体平台。
9.  内容审核：对融媒体内容进行分级审核。
10. 一键发布：批量发布融媒体内容至融媒体平台。

## 主要操作命令

## 安装项目依赖

```
npm install
```

### 启动开发服务器

```
npm run serve
```

### 生成可部署文件

```
npm run build
```

### 代码检查

```
npm run lint
```
