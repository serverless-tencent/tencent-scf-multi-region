# 腾讯云云函数多地部署组件

&nbsp;

## 简介

该组件是 云函数 多地部署组件，可以通过该组件，将函数同步部署到多个地域。

## 快速开始

通过该组件，对一个函数进行多地域创建，配置，部署和删除等操作。支持命令如下：

1. [安装](#1-安装)
2. [配置](#2-配置)
3. [部署](#3-部署)
4. [移除](#4-移除)

### 1. 安装

通过 npm 安装 serverless

```console
$ npm install -g serverless
```

### 2. 配置

本地创建 `serverless.yml` 文件，在其中进行如下配置

```console
$ touch serverless.yml
```

```yml
# serverless.yml

hello_world:
  component: '@serverless/tencent-scf-multi-region'
  inputs:
    codeUri: ./
    description: This is a template function
    region: 
      -ap-guangzhou
      - ap-shanghai
    environment:
      variables:
        ENV_FIRST: env1
        ENV_SECOND: env2
    handler: index.main_handler
    memorySize: 128
    name: hello_world
    runtime: Python3.6
    timeout: 3
    events:
      - apigw:
          name: serverless_test
          parameters:
            protocols:
              - http
            description: the serverless service
            environment: release
            endpoints:
              - path: /users
                method: POST
              - path: /usersss
                method: POST
    ap-guangzhou:
      environment:
        variables:
          ENV_FIRST: env2
    ap-shanghai:
      events:
        - apigw:
            name: serverless_test
            parameters:
              protocols:
                - http
              description: the serverless service
              environment: release
              endpoints:
                - path: /usersd
                  method: POST

```

- 该组件配置与`tencent-scf`组件配置一致，针对不同地域的额外拓展，可以增加以地域为`key`的对象，地域对象下的内容也是和`tencent-scf`组件配置一致：

```text
ap-guangzhou:
  environment:
    variables:
      ENV_FIRST: env2
ap-shanghai:
  events:
    - apigw:
        name: serverless_test
        parameters:
          protocols:
            - http
          description: the serverless service
          environment: release
          endpoints:
            - path: /usersd
              method: POST
```

### 3. 部署

如您的账号未[登陆](https://cloud.tencent.com/login)或[注册](https://cloud.tencent.com/register)腾讯云，您可以直接通过`微信`扫描命令行中的二维码进行授权登陆和注册。

通过`sls`命令进行部署，并可以添加`--debug`参数查看部署过程中的信息

```
$ sls --debug
  
    DEBUG ─ Resolving the template's static variables.
    DEBUG ─ Collecting components from the template.
    DEBUG ─ Downloading any NPM components found in the template.
    DEBUG ─ Analyzing the template's components dependencies.
    DEBUG ─ Creating the template's components graph.
    DEBUG ─ Syncing template state.
    DEBUG ─ Executing the template's components graph.
    DEBUG ─ Compressing function hello_world file to /Users/dfounderliu/Desktop/ServerlessComponents/test/scf_test/.serverless/hello_world.zip.
    DEBUG ─ Compressed function hello_world file successful
    DEBUG ─ Uploading service package to cos[sls-cloudfunction-ap-guangzhou-code]. sls-cloudfunction-default-hello_world-1583816589.zip
    DEBUG ─ Uploaded package successful /Users/dfounderliu/Desktop/ServerlessComponents/test/scf_test/.serverless/hello_world.zip
    DEBUG ─ Creating function hello_world
    DEBUG ─ Updating code... 
    DEBUG ─ Updating configure... 
    DEBUG ─ Created function hello_world successful
    DEBUG ─ Setting tags for function hello_world
    DEBUG ─ Creating trigger for function hello_world
    DEBUG ─ Starting API-Gateway deployment with name hello_world.ap-guangzhou-hello_world.serverless_test in the ap-guangzhou region
    DEBUG ─ Service with ID service-p14470dc created.
    DEBUG ─ API with id api-pg3ihnoi created.
    DEBUG ─ Deploying service with id service-p14470dc.
    DEBUG ─ Deployment successful for the api named hello_world.ap-guangzhou-hello_world.serverless_test in the ap-guangzhou region.
    DEBUG ─ API with id api-op4jqvba created.
    DEBUG ─ Deploying service with id service-p14470dc.
    DEBUG ─ Deployment successful for the api named hello_world.ap-guangzhou-hello_world.serverless_test in the ap-guangzhou region.
    DEBUG ─ Deployed function hello_world successful
    DEBUG ─ Compressing function hello_world file to /Users/dfounderliu/Desktop/ServerlessComponents/test/scf_test/.serverless/hello_world.zip.
    DEBUG ─ Compressed function hello_world file successful
    DEBUG ─ Uploaded package successful /Users/dfounderliu/Desktop/ServerlessComponents/test/scf_test/.serverless/hello_world.zip
    DEBUG ─ Creating function hello_world
    DEBUG ─ Updating code... 
    DEBUG ─ Updating configure... 
    DEBUG ─ Created function hello_world successful
    DEBUG ─ Setting tags for function hello_world
    DEBUG ─ Creating trigger for function hello_world
    DEBUG ─ Starting API-Gateway deployment with name hello_world.ap-shanghai-hello_world.serverless_test in the ap-shanghai region
    DEBUG ─ Service with ID service-7daktopz created.
    DEBUG ─ API with id api-4v40ce4u created.
    DEBUG ─ Deploying service with id service-7daktopz.
    DEBUG ─ Deployment successful for the api named hello_world.ap-shanghai-hello_world.serverless_test in the ap-shanghai region.
    DEBUG ─ API with id api-emkl7ov4 created.
    DEBUG ─ Deploying service with id service-7daktopz.
    DEBUG ─ Deployment successful for the api named hello_world.ap-shanghai-hello_world.serverless_test in the ap-shanghai region.
    DEBUG ─ Starting API-Gateway deployment with name hello_world.ap-shanghai-hello_world.serverless_test in the ap-shanghai region
    DEBUG ─ Using last time deploy service id service-7daktopz
    DEBUG ─ Updating service with serviceId service-7daktopz.
    DEBUG ─ API with id api-2zag45hq created.
    DEBUG ─ Deploying service with id service-7daktopz.
    DEBUG ─ Deployment successful for the api named hello_world.ap-shanghai-hello_world.serverless_test in the ap-shanghai region.
    DEBUG ─ Deployed function hello_world successful
  
    hello_world: 
      ap-guangzhou: 
        Name:        hello_world
        Runtime:     Python3.6
        Handler:     index.main_handler
        MemorySize:  128
        Timeout:     3
        Region:      ap-guangzhou
        Namespace:   default
        Description: This is a template function
        APIGateway: 
          - serverless_test - POST - http://service-p14470dc-1256773370.gz.apigw.tencentcs.com/release/users
          - serverless_test - POST - http://service-p14470dc-1256773370.gz.apigw.tencentcs.com/release/usersss
      ap-shanghai: 
        Name:        hello_world
        Runtime:     Python3.6
        Handler:     index.main_handler
        MemorySize:  128
        Timeout:     3
        Region:      ap-shanghai
        Namespace:   default
        Description: This is a template function
        APIGateway: 
          - serverless_test - POST - http://service-7daktopz-1256773370.sh.apigw.tencentcs.com/release/users
          - serverless_test - POST - http://service-7daktopz-1256773370.sh.apigw.tencentcs.com/release/usersss
          - serverless_test - POST - http://service-7daktopz-1256773370.sh.apigw.tencentcs.com/release/usersd
  
    35s › hello_world › done

```

### 4. 移除

通过以下命令移除

```
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Removing any previously deployed API. api-pg3ihnoi
  DEBUG ─ Removing any previously deployed API. api-op4jqvba
  DEBUG ─ Removing any previously deployed service. service-p14470dc
  DEBUG ─ Aborting removal. function name not found in state.
  DEBUG ─ Removed function hello_world successful
  DEBUG ─ Removing any previously deployed API. api-2zag45hq
  DEBUG ─ Removing any previously deployed service. service-7daktopz
  DEBUG ─ Api resource dont't exixts ID api-2zag45hq.
  DEBUG ─ Removing any previously deployed service. service-7daktopz
  DEBUG ─ Api resource dont't exixts ID api-2zag45hq.
  DEBUG ─ Removing any previously deployed service. service-7daktopz
  DEBUG ─ Removed function hello_world successful

  16s › hello_world › done

```

#### 账号配置（可选）

当前默认支持 CLI 扫描二维码登录，如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件

```console
$ touch .env # 腾讯云的配置信息
```

在 `.env` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存。

```
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

> ?
>
> - 如果没有腾讯云账号，请先 [注册新账号](https://cloud.tencent.com/register)。
> - 如果已有腾讯云账号，可以在 [API 密钥管理
>   ](https://console.cloud.tencent.com/cam/capi) 中获取 SecretId 和 SecretKey。

### 还支持哪些组件？

可以在 [Serverless Components](https://github.com/serverless/components) repo 中查询更多组件的信息。
