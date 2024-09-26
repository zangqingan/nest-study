# 一、项目说明

nestjs^9.0.0 的学习，主要包括以下几个部分内容。
nestjs 概述、
nestjs 项目创建、
nestjs 相关知识学习、
MySQL 连接和操作、
resfulapi curd 接口实现、
接口校验、
swagger 接口文档编写
等内容。主要是学习后端的思维。
2023.8.23-购买掘金-神说要有光的- 《Nest 通关秘籍小册》，主要学习实战部分知识点。
Nest 基础：Nest 各种功能的使用，包括 IOC、AOP、全局模块、动态模块、自定义 provider、middleware、pipe、interceptor、guard 等功能，还有 Nest CLI 的使用，Nest 项目的调试。
扩展高级：mysql、mongodb、redis、rabbitmq、nacos 等后端中间件学一遍，也会学习 pm2、docker、docker compose 等部署方案。
目标是学习之后自己能前后端一起做一个项目上线即可。

**目录说明**
1. [nest-single](nest做server服务)
2. [nest-microservice](nest做微服务)

# 二、NestJS 概述

## 2.1 Nest 介绍及安装

Nest (NestJS) 是一个用于构建高效、可扩展的 Node.js  服务器端应用程序的开发框架。它利用 JavaScript 的渐进增强的能力，使用并完全支持  TypeScript （仍然允许开发者使用纯 JavaScript 进行开发），并结合了 OOP （面向对象编程）、FP （函数式编程）和 FRP （函数响应式编程）。
在底层，Nest 构建在强大的 HTTP 服务器框架上，例如  Express （默认），并且还可以通过配置从而使用 Fastify。它是一个功能比较全面的 Nodejs 后端框架。其实和 Express 用法类似、不过是在这些框架之上再进行了一层抽象，使用了控制反转依赖注入使用上更加方便，功能也更加强大而已、也是直接使用它向开发者暴露的API即可。本质上还是监听 HTTP 请求，然后处理并返回结果给前端。

Nest它就是提供了一个开箱即用的应用程序架构，允许开发者和团队创建高度可测试、可扩展、松耦合且易于维护的应用程序。

学习 NestJS 直接使用官方脚手架 Nest CLI 即可、脚手架就是一个命令行界面工具，可以帮助您初始化、开发和维护您的Nest应用程序。
安装脚手架:
`$ npm install -g @nestjs/cli` // 全局安装 Nest 脚手架
`$ npm update -g @nestjs/cli `// 全局升级脚手架版本

**基本工作流程**
安装完成之后跟 vue 等的脚手架类似就可以使用：nest 命令。

nest 命令可以生成项目结构和各种代码、编译代码、监听文件变动自动编译、打印项目依赖信息等

```
    常用命令：
    nest -v 查看nestjs安装的版本。
    nest -h 查看帮助信息即脚手架提供的命令。
    nest new 项目名，用于快速创建一个nest项目
    nest generate 快速生成各种模块代码
    nest build 使用 tsc 或者 webpack 构建代码
    nest start 启动开发服务，支持 watch 和调试
    nest info 打印项目信息、包括系统信息、node、npm、nest 包的依赖版本
```

脚手架创建项目：
`nest new project-name` // 创建项目
项目运行
`npm run start:dev` 其它启动命令查看包管理文件即可。此命令将使用 HTTP 服务器启动应用程序，以侦听 src/main.ts 文件中所定义的端口。

使用脚手架生成的 nest 项目时会生成一个样板应用程序结构(称为标准模式)、以鼓励开发人员将每个模块保存在其对应的专用目录中(也就是更加作用自定义模块文件名)。在我们之前学习原生node、express、koa时都是自己抽离划分的模块、而一个基本的 nest 模块也是按照 mvc 模式拆分的分成三个组成：模块 module、控制器 controller(NestJS 的路由由控制器负责)、服务 service, 同时它们都有专门的脚手架命令用来快速生成。

初始目录结构如下
```
项目名(文件名)
+-- dist[目录]                      // 编译后的目录，用于预览项目
+-- node_modules[目录]              // 项目使用的包目录，开发使用和上线使用的都在里边
+-- src[目录]                       // 源文件/代码，程序员主要编写的目录
|  +-- app.controller.spec.ts      // 对于基本控制器的单元测试样例
|  +-- app.controller.ts           // 控制器文件，可以简单理解为路由文件(一般项目里不用或者写公共的路由。)
|  +-- app.module.ts               // 模块文件，在NestJS世界里主要操作的就是模块
|  +-- app.service.ts              // 服务文件，提供的服务文件，业务逻辑编写在这里
|  +-- main.ts                 // 项目的入口文件，里边包括项目的主模块和监听端口号（全家的配置：拦截器等）
+-- test[目录]                      // 测试文件目录，对项目测试时使用的目录，比如单元测试...
|  +-- app.e2e-spec.ts             // e2e测试，端对端测试文件，测试流程和功能使用
|  +-- jest-e2e.json               // jest测试文件，jset是一款简介的JavaScript测试框架
+-- .eslintrc.js                   // ESlint的配置文件
+-- .gitignore                     // git的配置文件，用于控制哪些文件不受Git管理
+-- .prettierrc                    // prettier配置文件，用于美化/格式化代码的
+-- nest-cli.json                  // 整个项目的配置文件，这个需要根据项目进行不同的配置
+-- package-lock.json              // 防止由于包不同，导致项目无法启动的配置文件，固定包版本
+-- package.json                   // 项目依赖包管理文件和Script文件，比如如何启动项目的命令
+-- README.md                      // 对项目的描述文件，markdown语法
+-- tsconfig.build.json            // TypeScript语法构建时的配置文件
+-- tsconfig.json                  // TypeScript的配置文件，控制TypeScript编译器的一些行为

```

## 2.2 Nest CLI 常用命令

安装 @nestjs/cli包，也就是 nestjs 脚手架后，脚手架提供了很多命令。除了之前用来创建项目的命令还有可以生成一些别的模块代码的命令，比如 controller、service、module 等这些非常常用的。记不住也问题不大查就完事儿了。

`$ nest --help` 查看可用的nest命令

`$ nest new --help `  查看 new 命令相关的帮助信息

`$ nest generate -h `  查看 generate 命令相关的帮助信息

**所有的nest命令都遵循相同的格式**
 - nest commandOrAlias requiredArg [optionalArg] [options]
 - nest 命令名/命令别名 必须的参数 可选的参数 其它可选项
 - $ nest new my-nest-project --dry-run
 - $ nest n my-nest-project -d 是上面命令的等价简写形式

在这里
 - new 是 _commandOrAlias_。
 - new 命令有一个别名 n 、大多数命令和一些选项都有别名。
 - my-nest-project 是 _requiredArg_。如果在命令行上没有提供 _requiredArg_，nest 将提示您提供它。另外，
 - --dry-run 可选参数也有一个等效的简写形式 -d。
 - --skip-git 跳过 git 的初始化
 - --skip-install 跳过 npm install

比较常用的生成(创建)命令 generate 如下：
声明如下：可以通过 `nest g -h `命令查看具体语法。
//创建一个 nest 元素语法，
`$ nest generate <schematic> <name> [options]`
`$ nest g <schematic> <name> [options]`
`$ nest g 文件类型 生成的组件的名称 可选项`

**常见的文件类型有**
| 名称        | 别名         | 描述     |
| :---        |    :----:   |          ---: |
| module      | mo          | 生成一个模块声明会自动在 AppModule 里引入   |
| controller  | co          | 生成一个控制器声明      |
| service     | s           | 生成一个服务声明        |
| middleware  | mi          | 生成一个中间件声明      |
| interface   | itf         | 生成一个接口            |
| interceptor | itc         | 生成一个拦截器声明      |
| guard       | gu          | 生成一个守卫声明        |
| gateway     | ga          | 生成一个网关声明        |
| filter      | f           | 生成一个过滤器声明      |
| pipe        | pi          | 生成一个管道声明        |
| class       | cl          | 生成一个新的类          |
| resource    | res         | 快速生成一个CRUD模块    |

可选参数一般就一个、即不生成测试测试文件(默认是强制生成的)。其它常见参数如下:
1. --spec 默认值即生成测试文件
2. --no-spec 不生成测试文件
3. --flat 不生成对应目录
4. --no-flat 生成对应目录
5. --skip-import 是指定不在 AppModule 里引入、如创建控制器时不自动在入口文件里面引入。

构建命令:`$ nest build `、会在 dist 目录下生成编译后的代码。`$ nest build -h`可以常看帮助信息。它也有一些常见参数如下:
1. --watch/-w 监听文件变化，自动编译打包默认只监听js、ts文件。
2. --webpack 指定为webpack 编译、会打包。
3. --tsc 默认是使用 tsc 编译、它不会打包。
4. --config/-c 指定配置文件。

nest cli 的配置文件：nest-cli.json、上述配置都可以在这个配置文件里配置。

**示例** 
```js
1:创建模块
//创建一个 posts 帖子模块
nest g mo posts
mo--module 模块
posts-- 文件名
文件目录不指定时默认在 src 下
执行命令后根模块会自动 imports 导入新建的模块。

2:创建控制器
nest g co posts
co-- controller
此时创建了一个 posts 控制器，命名为 posts.controller.ts 以及一个该控制器的单元测试文件.执行完命令， 文件 posts.module.ts 中会自动引入 PostsController,并且在@Module 装饰器的 controllers 选项中注入。

3:创建服务类
nest g service posts

注意创建顺序： 先创建 Module, 再创建 Controller 和 Service, 这样创建出来的文件控制器和服务会在 当前创建的Module 中自动注册、当前模块也会在根模块中自动引入。反之，后创建 Module, Controller 和 Service,会被注册到最外层的根模块文件 app.module.ts 上。

还有一个快速创建 Contoller、Service、Module 以及 DTO 文件的方式:
比如创建一个用户 user 模块
 
nest g res user 
这样就快速生成了一个 curd 模块,它同样会自动在 AppModule 引入.

打包命令：nest build 用来构建项目它会在 dist 目录下生成编译后的代码。
同样的它也有一些选项参数，可以通过 $ nest build -h 查看。

nest info 命令:这个就是查看项目信息的，包括系统信息、 node、npm 和依赖版本

如上等相关的配置都可以在 nest-cli.json 配置文件中对应的配置选项上配置，就跟 vue 项目的配置文件一样。

```

## 2.3 Nest 请求生命周期

Nest 在启动后最终还是监听的 http 请求，而一个请求从监听到响应的流程就如下：

除了异常过滤器和拦截器（请求后）是由 路由->控制器->全局 之外，中间件、守卫、拦截器（请求前）、管道都是从 全局->控制器->路由 的顺序执行。

1. 收到请求

2. 全局绑定的中间件
3. 模块绑定的中间件

4. 全局守卫
5. 控制层守卫
6. 路由守卫

7. 全局拦截器（控制器之前）
8. 控制器层拦截器 （控制器之前）
9. 路由拦截器 （控制器之前）

10. 全局管道
11. 控制器管道
12. 路由管道
13. 路由参数管道

14. 控制器（方法处理器）

15. 服务（如果有）

16. 路由拦截器（请求之后）
17. 控制器拦截器 （请求之后）
18. 全局拦截器 （请求之后）

19. 异常过滤器 （路由，之后是控制器，之后是全局）

20. 服务器响应

而在这个生命周期内 Nest官方提供了一些生命周期方法。
首先，递归初始化模块，会依次调用模块内的 controller、provider 的 onModuleInit 方法，然后再调用 module 的 onModuleInit 方法。
全部初始化完之后，再依次调用模块内的 controller、provider 的 onApplicationBootstrap 方法，然后调用 module 的 onApplicationBootstrap 方法然后监听网络端口。之后 Nest 应用就正常运行了。这个过程中，onModuleInit、onApplicationBootstrap 都是我们可以实现的生命周期方法。provider、controller、module 都支持启动和销毁的生命周期函数，这些生命周期函数都支持 async 的方式。

## 2.4 Nest 实战目录

使用 Nest CLI 创建的项目会拥有一个初始的项目结构，以鼓励开发人员将每个模块保存在其专用目录中(也就是更加作用自定义模块文件名)。所以根据个人喜好来就行，这只是一种约定。

项目名(文件名)
├──dist 打包的目录
├──node_modules 模块依赖安装存放目录
├──test 测试的目录
├──src 源码目录
├───── 自定义目录
├───── common - 公共的东西如: 守卫、过滤器、中间件、拦截器等
├───── modules - 各个模块存放位置
├───── ..... 其它
├───── app.controller.spec.ts 针对控制器的单元测试
├───── app.controller.ts 一个具有单一路由的基本控制器(Controller)
├───── app.module.ts 应用程序的根模块(Module)
├───── app.service.ts 具有单一方法的基本服务(Service)
├───── main.ts nest 应用程序的入口文件，

## 2.5 NestJS 常用装饰器速查
Nest 的功能都是大多通过装饰器来使用的

**模块系统相关**
1. @Module() 声明模块
2. @Controller() 声明模块里的 controller 
3. @Injectable() 声明模块里可以注入的 provider
4. @Inject() 注入依赖(属性注入、或provider名为字符串时使用)
5. @Optional() 注入依赖时可选参数
6. @Global() 声明为全局

**面向 AOP编程相关**
1. @UseFilters() 注册过滤器
2. @UseGuards() 注册守卫
3. @UseInterceptors() 注册拦截器
4. @UsePipes() 注册管道

**HTTP请求相关**
1. @Get() get请求
2. @Post() post请求
3. @Put() put请求
4. @Patch() patch请求
5. @Delete() delete请求
6. @Query() 获取请求参数、取出 query 部分的参数，比如 /aaa?name=xx 中的 name
7. @Body() 获取请求体、取出请求 body，通过 dto class 来接收
8. @Param() 获取请求参数、取出 url 中的参数，比如 /aaa/:id 中的 id
9. @HttpCode() 修改响应的状态码
10. @Redirect() 重定向 
11. @Req()、@Request()注入 request 对象
12. @Res()、@Response()注入 response 对象，一旦注入了这个 Nest 就不会把返回值作为响应了，除非指定 passthrough 为true








# 三、NestJS 核心基础知识

## 3.1 控制器 controller

### 1. 概述
和原生node、express、koa 里我们抽离的路由类似，nest 的控制器作用一样的: 就是处理客户端传入的请求和向客户端返回响应、nest控制器其实也是路由。即接收 http 请求，调用 Service，返回响应。

只不过在 NestJS 里是使用类和装饰器，而控制器就是使用 @Controller 装饰器装饰的一个类。装饰器的作用是将类与所需的元数据关联起来，并使Nest能够创建路由映射(将请求与相应的控制器关联起来)、即表示这个类是可以被注入的、Nest就会把它放入到 IoC 容器中。

在脚手架一节我们知道要使用CLI创建控制器，只需执行`$ nest g controller/co [name] `命令即可。

和express里定义了路由要在入口文件引入才能起作用一样，在定义了控制器之后Nest仍然是不知道控制器存在的，因此不会创建此类的实例。在Nest里控制器总是属于某一个模块类，所以要把它导入到 @Module() 装饰器对应的类的 controllers 选项中,这样 Nest 就可以轻松反射（reflect）出哪些控制器（controller）必须被安装挂载(new 初始化),也就可以直接使用它,控制器本身只做路由的控制跳转这样有利于业务的抽离。

### 2. 使用
简单理解就是之前在express、koa里的路由相关的东西都使用了装饰器代替。
这些装饰器它们的作用和 express 里的 req、res 对象类似、不过是 nest 帮忙封装成了装饰器，可以直接使用罢了。
常见的如下：它们都是从'@nestjs/common' 模块导出的。主要也是三种: 类装饰器、方法装饰器、属性装饰器。
`import { Controller, Get, Post, Put, Patch, Delete, HttpCode, Headers, Redirect, Request, Response, Body, Param, Query,} from '@nestjs/common';`

1. 类装饰器 @Controller() 装饰器，用来装饰一个控制器类。
可以传入一个字符串值，作为路由路径前缀。
也可以传入一个对象，常用有三个配置属性
```js
@Controller('路由前缀')
@Controller({
   path:'路径',
   host:'HTTP主机域名',
   version:'接口版本'
})
export class CatsController {}

```

2. 方法装饰器，nest 提供了所有标准 HTTP 方法对应的请求方法装饰器，用来装饰具体的请求方法(类里定义的方法)而express、koa里直接使用路由方法。同样的这些装饰器也可以传入一个路径参数，它会拼接在 @Controller() 装饰器参数后面。例如：路径前缀 customers 与装饰器 @Get('profile') 组合会为 GET /customers/profile 请求生成路由映射。当方法和路径都匹配时就会执行装饰的方法。

注意: 这个路径参数可以是字符串、或者模式匹配的路由。

```js
// express、koa
app.get('/cat',callback)
router.post('/cat',callback)
//nestjs
export class CatsController {
   @Get()
   @Post()
   @Put()
   @Patch()
   @Delete()
   @All()
   callback(){
     //.....
   }
  //  其它常见的方法装饰器
   @HttpCode() 用来指定返回的 http 状态码
   @Header() 指定自定义的响应头
   @Headers() 装饰器获取请求头信息
   @Redirect(url,statusCode) 将响应重定向到特定的URL、接受两个参数url和statusCode，两者都是可选的。如果省略statusCode，其默认值为302（Found）。
  // 例子
   @Post()
   @HttpCode(204)
   @Header('Cache-Control', 'none')
   create() {
     return 'This action adds a new cat';
   }

   @Get('docs')
   @Redirect('http://nestjs.inode.club', 302)
   getDocs(@Query('version') version) {
     if (version && version === '5') {
       // 返回这个结构的对象会覆盖 @Redirect() 装饰器
       return { url: 'http://nestjs.inode.club/v5/' };
     }
   }
}


```

3. 属性装饰器，用来装饰方法里的形式参数。在原生node、express、koa中，一个请求都会设计一个请求对象 request 和一个响应对象 response，他们在回调函数中作为参数的顺序是固定的，但在nestjs中，参数的顺序是随意的，所以需要使用属性装饰器来装饰参数，让nestjs知道参数的顺序。

其中@Request(), @Req() 装饰器都会获取到请求 request 对象，跟 express 里的 req 对象一样
其中@Response(), @Res() 装饰器都会获取到请求 response 对象，跟 express 里的 req 对象一样

获取 get 请求参数和动态路由参数和 express 里一样都是在请求对象里。
req.query 和 req.params

获取 post 等请求的请求体和 express 里也是一样的都是在请求对象里。
req.body

不过 nest 都提供了对应的装饰器，方便操作。
req.query === @Query() 直接获取 query 查询对象
req.params === @Param()直接获取 params 查询对象、将特定的参数标记传递给装饰器，然后在方法体中直接按名称引用路由参数。
req.body === @Body()直接获取请求体 body 对象

注意：query 和 params 都是一个对象，它们都可以再传入一个键名字符串，用来获取对象中对应的值，相当于直接解构。

基本上和之前在express、koa中一样的，不过是变成了装饰器使用罢了。

```js

import { Controller, Get, Req, Param, Query, Body } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('cats')
export class CatsController {
   @Get()
   findAll(@Req() req: Request): string {
     console.log(req.params);
     console.log(req.query);
     return 'This action returns all cats';
   }

   // 使用装饰器获取请求参数和路由参数
   @Get('getQueryAndParam/:id?')
   getQuery(
    @Param('id') id: number,
    @Query() query: { value: number; name: string },
   ) {

   }


   @Post()
   create(@Req() req: Request): string {
     console.log(req.body);
     console.log(req.headers);
       return 'This action adds a new cat';
   }

   //  使用装饰器获取请求体
   @Post('postQuery/:id?')
   @Header('Cache-Control', 'none')
   postQuery(
    @Param('id') id: number,
    @Body() body: { value: number; name: string },
   ){

   }

   @Post()
   create(@Response() res: Response): string {
    // 这时可以使用特定类库的响应对象。但是一般是不用的，因为它会变得依赖于平台失去与依赖于 Nest 标准响应处理的 Nest 功能的兼容性。
     console.log(res.status(200));
     console.log(res.redirect('http://nestjs.inode.club/v5/'));
     console.log(res.json({
      message: 'Hello world',
    }));
     res.redirect('http://nestjs.inode.club/v5/')
       return 'This action adds a new cat';
   }

   //  使用装饰器重定向
   @Get('docs')
   @HttpCode(200)
   @Redirect('http://nestjs.inode.club', 302)
   getDocs(@Query('version') version) {
     if (version && version === '5') {
       // 返回这个结构的对象会覆盖 @Redirect() 装饰器
       return { url: 'http://nestjs.inode.club/v5/' };
     }
   }
}
```

### 3. 后端提供 http 接口时传输数据的方式
这里讨论一下后端提供 http 接口时传输数据，而这种数据传输的方式主要有 5 种：

1. url param 路由参数('/param/:id')、把参数写在 url 中的形式。服务端框架或者单页应用的路由都支持从 url 中取出参数
```js
// 前端路由配置 path: '/person/:id'
// http://guang.zxg/person/1111
// 在nest中通过 @Req() req: Request ==> req.params.id ==> 1111
// 或者直接通过 @Param() params 装饰器获取路由参数 params.id => 1111
// 也可以传入参数名直接获取对应的值
@Controller('api/person')
export class PersonController {
  @Get(':id')
  urlParam(@Param('id') id: string) {
    return `received: id=${id}`;
  }
}

```
2. query 查询字符串、把参数写在 url 中 ？后面的用 & 分隔的字符串传递数据,其中非英文的字符和一些特殊字符要经过编码，可以使用 encodeURIComponent 的 api 来编码。
```js
// query = {name:'王',age:20}
// http://guang.zxg/person?name=王&age=20
// 在nest中通过 @Req() req: Request ==> req.query.name ==> '王'
// 或者直接使用 @Query() 装饰器获取 query 查询对象 query ==> {name:'王',age:20}
// 也可以传入参数名直接获取对应的值
@Controller('api/person')
export class PersonController {
  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    return `received: name=${name},age=${age}`;
  }
}

```
3. form-urlencoded、form 表单提交数据、指定 content-type 是 application/x-www-form-urlencoded需要对内容做 url encode。内容和query一样也是键值对之间使用&分隔、键和值使用=连接、不过是放在请求体里。不适合传输大数量的数据。普通的表单上传使用(也就是不包括文件上传)。
```js
// 前端代码使用 post 方式请求，指定 content-type 为 application/x-www-form-urlencoded
async function formUrlEncoded() {
  const res = await axios.post('/api/person', Qs.stringify({
    name: 'zhangsan',
    age: 20
  }), {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  });
    console.log(res);  
}
formUrlEncoded();

interface CreatePersonDto {
  name: string;
  age: number;
}
// 通过 @Body() 装饰器获取请求体 body 对象
@Controller('api/person')
export class PersonController {
  @Post()
  body(@Body() createPersonDto: CreatePersonDto) {
    return `received: ${JSON.stringify(createPersonDto)}`
  }
}

```
4. form-data、指定 content-type 为 multipart/form-data、用 boundary 分隔符分割的内容。适合传输文件，而且可以传输多个文件。常见表单中的上传附件(图片、文件等)或二进制数据、也支持普通表单的。
```js
// 前端使用 FormData 对象来封装传输的内容
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
</head>
<body>
    <input id="fileInput" type="file" multiple/>
    <script>
        const fileInput = document.querySelector('#fileInput');

        async function formData() {
            const data = new FormData();
            data.set('name','张三');
            data.set('age', 20);
            data.set('file1', fileInput.files[0]);
            data.set('file2', fileInput.files[1]);

            const res = await axios.post('/api/person/file', data, {
                headers: { 'content-type': 'multipart/form-data' }
            });
            console.log(res);     
        }

        fileInput.onchange = formData;
    </script>
</body>
</html>
// Nest 中要使用 FilesInterceptor 来处理其中的 binary 字段，用 @UseInterceptors 来启用，其余字段用 @Body 来取。
import { AnyFilesInterceptor } from '@nestjs/platform-express';
export class CreatePersonDto {
    name: string;
    age: number;
}import { CreatePersonDto } from './dto/create-person.dto';

@Controller('api/person')
export class PersonController {
  @Post('file')
  @UseInterceptors(AnyFilesInterceptor({
      dest: 'uploads/'
  }))
  body2(@Body() createPersonDto: CreatePersonDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return `received: ${JSON.stringify(createPersonDto)}`
  }
}


```
1. json、指定content-type 为 application/json、不适合传输文件。和表单数据的获取一样也是通过 @Body() 装饰器获取请求体 body 对象、只不过是传输类型不一样、Nest 内部会根据 content type 做区分，使用不同的解析方式。
```js
// 前端代码使用 axios 发送 post 请求时默认传输 json格式的数据，所以不需要指定 content-type。
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
</head>
<body>
    <script>
        async function json() {
            const res = await axios.post('/api/person', {
                name: '张三',
                age: 20
            });
            console.log(res);     
        }
        json();
    </script>
</body>
</html>

@Controller('api/person')
export class PersonController {
  @Post()
  body(@Body() createPersonDto: CreatePersonDto) {
    return `received: ${JSON.stringify(createPersonDto)}`
  }
}

``` 

### 4. 控制器中常用的装饰器速查

| 装饰器名称   | 描述     |
| :---        |         ---: |
| Controller()      | 声明为控制器类   |
| Get, Post, Put, Patch, Delete, All  | 常见的http请求方法      |
| HttpCode, Headers, Redirect, Request, Response  | http请求头对象设置、响应头对象设置相关     |
| Body, Param, Query  | 获取前端数据方式     |
|.....   | 其它            |




## 3.2 提供者 provider

### 1. 概述
提供者是Nest中的一个基本概念。各种功能和业务代码具体实现的地方都可以看作是提供者 provider，比如接下来的各种拦截器、各种过滤器、各种配置模块、各种中间件、管道等全都是 Providers，即提供各种问题具体解决方法的人。控制器应该只处理HTTP请求分发路由、而将更复杂的任务(如: 数据库的查询、数据的处理等)委托给提供者。

在 NestJS 里就是被 @Injectable 装饰器装饰的JavaScript类就是 Providers也就是说提供者本质上就是一个JavaScript类而已，提供者的主要思想是它可以通过类的构造器方法即 constructor 方法或者基于属性实现注入依赖，这意味着对象之间可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给  Nest 运行时系统。本质上就是使用了 @Injectable 装饰器装饰的类就可以被 Nest IoC 容器(反转控制容器)管理。

在 NestJS 中提供者最常见是作为 service 服务，所以文件命名一般是 xxx.service.js/ts、也可以是过滤器 xxx.filter.js/ts、也可以是拦截器 xxx.interceptor.js/ts。等等反正就是一个用  @Injectable  装饰器装饰的类、而且作为服务时通常是给某个控制器注入、或者给某个模块注入。

### 2. 使用
使用 CLI 创建一个服务提供者是很简单的、只需执行`$ nest g service/s [name] --no-spec`命令即可。跟之前express、koa里抽离的服务一样、要使用就必须引入。

在定义了一个服务之后就可以通过**依赖注入**的方法在一个控制器类的内部使用它了。
具体实现方法有两种：

1. 是通过控制器类的类构造函数 constructor(){} 注入依赖项的。
2. 是通过控制器类的属性注入依赖项、在属性上使用 @Inject('token') 装饰器。

然后还要将服务添加模块类的 @Module() 装饰器的 providers 数组里进行注册(没有就是根模块)、注册后Nest就能够解析 CatsController 类的依赖关系进而实例化需要的服务类。

原理：实际就是将类的实例化委派给了 Nest 的 IoC 容器中、这个过程有三个关键步骤。
1. 提供者必须使用 @Injectable() 装饰器声明为可注入的，这样它就可以由Nest IoC容器管理。
2. 声明一个依赖于 CatsService 令牌(token)的构造函数注入或属性注入，如在 cats.controller.ts 中constructor(private readonly catsService: CatsService)。
3. 在一个模块类中将标记 CatsService令牌(token) 与 cats.service.ts文件中的 CatsService 类相关联。

如此当 Nest IoC 容器实例化 CatsController 时，它首先查找所有依赖项。 当找到 CatsService 依赖项时，它将对 CatsService令牌(token)执行查找，返回关联 CatsService 类。 然后 Nest 将创建 CatsService 实例，将其缓存并返回，或者如果已经缓存，则返回现有实例。这样也就实现了依赖注入。

```js
// cats.service.ts
import { Injectable } from '@nestjs/common';
// 必须使用 @Injectable 装饰器装饰。
@Injectable()
export class CatsService {}

// cats.controller.ts
import { Inject } from 'nestjs/common';
import { CatsService } from './cats.service';
@Controller('cats')
export class CatsController {

  @Inject(CatsService) private readonly catsService:CatsService; // 基于属性注入服务

  constructor(private readonly catsService: CatsService) {} // 基于构造函数注入服务提供者

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}

// cats.module.ts
// 在模块中注册
import { Module } from '@nestjs/common';

@Module({
  controllers: [CatsController],
  providers: [CatsService], // 添加 CatsService 注册到 providers 数组中
  // 上面的providers本质上是一种简写，等价于
  providers: [{
    provide: CatsService, // 指定 token,这里直接使用了类名，也可以是一个字符串名。只用@Inject()注入时传入的参数。
    useClass: CatsService // 指定对象的类，Nest 会自动对它做实例化后用来注入。(IOC 容器干的活)
  }]
})
export class CatsModule {}

```


## 3.3 模块 module

### 1. 概述
模块是 nest 的精髓所在，是控制反转 IoC 容器实现所在。Module 是 NestJS 中一个大的一个内容，它是整个 module 功能模块的收口，功能和特性和 Angular 保持一致。

在 Nest 中模块就是一个 @Module() 装饰器装饰的类。 @Module() 装饰器提供了元数据(就是一个配置对象)，Nest 用它来组织应用程序的结构。一般来说各个模块最终会在根模块 AppModule汇总、然后在入口文件main.ts里引入执行。

根模块: 每个应用程序至少有一个模块、是Nest用于构建应用程序图的起点、是Nest用于解析模块和提供者之间关系和依赖关系的内部数据结构。

```js
// @Module() 装饰器接受一个单一的描述模块属性的配置对象作为参数。
// 如果你需要把这个模块暴露到全局使用可以加 一个装饰器 @Global、全局模块应该仅注册一次，通常由根模块或核心模块完成。

@Global() // 声明为全局模块
@Module({
  controllers:[], // 这里注册了的控制器也会被自动实例化
  imports:[], // 可以导入其他 module 或者 provider
  exports:[], // 如果你这个模块中的 provider 要在别的模块中使用你必须要在这里声明导出 provider ，当然你也可以把这个 module 导出，其他地方 import 一下这样其他模块中的 provider 也是可以使用的。
  providers:[] // 在这里注册了的提供者会被 Nest 注入器自动实例化，并且可以至少在整个模块中共享。
})
```

### 2. 使用
使用 CLI 创建一个模块也是很简单的、只需执行`$ nest g module/mo [name] --no-spec`命令即可。然后把该模块相关的所有内容都移动到了cats 目录中成一个功能(特性)模块。这样只需要在根模块里 imports 数组里注册这个功能(特性)模块即可。

```js
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './modules/cats/cats.module';

@Module({
  imports: [CatsModule],// 引入注册
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```




## 3.4 NestJS 实现 AOP 编程的五种方式
后端框架基本都是 MVC 的架构。MVC 是 Model View Controller 的简写。MVC 架构下，一次http请求的完整流程是：请求会先经过控制器（Controller），然后 Controller  调用Model 层的 Service服务 来完成业务逻辑(如数据库读写等)，最后返回结果给前端。
也就是: 请求request -> Controller -> Service -> Repository -> 返回response给前端。

在这个流程中，Nest 还提供了 AOP （Aspect Oriented Programming）的能力，也就是面向切面编程的能力。也就是在调用 Controller 之前和之后加入一个执行通用逻辑的阶段、这样的横向扩展点就叫做切面，这种透明的加入一些切面逻辑的编程方式就叫做 AOP （面向切面编程）。

AOP 的好处是可以把一些通用逻辑分离到切面中，保持业务逻辑的纯粹性，这样切面逻辑可以复用，还可以动态的增删。
Nest 实现 AOP 编程的方式一共有五种: 
1. 中间件(Middleware)、
2. 导航守卫(Guard)、
3. 管道(Pipe)、
4. 拦截器(Interceptor)、
5. 过滤器(ExceptionFilter)。

五种 AOP 机制的顺序：
1. 进入路由前先执行 Middleware，
2. 然后会调用 Guard，判断是否有权限等，如果没有权限就抛异常。
3. 抛出的异常会被 异常过滤器 ExceptionFilter 处理。
4. 如果有权限，就会调用到 interceptor，拦截器组织了一个链条，一个个的调用然后进入控制器。
5. 在调用 controller 具体的 handler 之前，会使用 pipe 对参数做转换或验证处理。
6. 在调用 controller 的 handler 之后，还可以调用interceptor对响应结果做处理。
7. 都没问题返回响应。

过滤器就是在返回响应之前对异常做一次处理即可。
   
完整流程是：request -> middleware  -> guard -> 请求interceptor -> pipe -> Controller(handler) -> 响应interceptor -> ExceptionFilter -> response


### 1 中间件 Middleware

#### 1. 概述
中间件是 NestJS 中实现 AOP 编程的五种方式之一。和express和koa一样、Nest中也有中间件功能类似，Nest中间件默认情况下与express中间件等效。它是一个在路由处理程序之前调用的函数、也就是在请求进入controller控制器之前或者响应返回给客户端之前执行一些操作的函数。中间件函数可以访问请求和响应对象，以及应用程序的请求-响应周期中的 next() 中间件函数。通常，next中间件函数由一个名为next的变量表示。

中间件函数可以执行以下任务：
1. 执行任何在中间件函数里定义的代码。
2. 对请求和响应对象进行更改。
3. 结束请求-响应周期。
4. 调用堆栈中的下一个中间件函数。如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。

Nest中分为了全局中间件和路由中间件。
1. 全局中间件：全局中间件是指应用中的所有路由都会生效的中间件。
2. 路由中间件：路由中间件是指只适用于特定路由的中间件。

#### 2. 使用
在Nest中可以在函数中或在具有 @Injectable() 装饰器的类中实现自定义 Nest中间件、即中间件有两种定义方法:
1. 一种是和express中间件一样就是一个函数没有任何特殊要求-函数式中间件。当中间件不需要任何依赖时使用。
2. 另一种是带有 @Injectable()装饰器的类中实现自定义的Nest中间件。这个类应该实现 NestMiddleware 接口-类中间件。

在 Nest 中使用脚手架命令创建一个中间件使用命令 `$ nest g mi/middleware  middlewareName --no-spec `、如创建一个 logger 中间件 `$ nest g mi/middleware  common/logger --no-spec`

使用这个命令生成的中间件类自动实现 @nestjs/common 包中的 NestMiddleware接口。同时可以使用 express 中的类型指定req、res next钩子的类型。这种中间件可以依赖注入其它的服务。

```js
// 类中间件-logger 中间件,不知道用的 express 还是 fastify，所以 request、response 是 any，可以手动标注。
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void)  {
    // 这里就可以范围到请求和响应对象
    next();// 释放句柄
  }
}

// 函数式中间件-也叫全局中间件需要使用 app.use 使用。
import { Request, Response, NextFunction } from 'express';
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
};
// 在 main.ts 里通过 app.use 使用
import { logger } from './logger';
import { Request, Response, NextFunction } from 'express';
app.use(logger);
app.use(function(req: Request, res: Response, next: NextFunction) {
    console.log('before', req.url);
    next();
    console.log('after');
})

```

因为在 Nest 中使用类方法实现的中间件也是使用 @Injectable() 装饰器装饰的类(提供者)所以它完全支持依赖注入，所以可以注册到全局模块使用，也可以在指定模块中注入使用，都是通过类构造方法 constructor 实现注入依赖项。

使用方法：在@Module()装饰器中是没有设置中间件的选项的。实际上我们使用的是模块类的 configure() 方法来设置它们。这是因为包含中间件的模块必须实现 NestModule 接口、实现了这个接口会自动执行模块类的 configure 方法。

MiddlewareConsumer 是一个辅助类，它提供了几种内置方法来管理中间件。
1. apply() 方法用来应用中间件,多个时逗号分隔即可。
2. forRoutes() 方法可以接受一个字符串、多个字符串、一个 RouteInfo 对象、一个控制器类，甚至是多个控制器类。
3. .exclude 方法用来排除、接受单个字符串、多个字符串或 RouteInfo 对象，用于标识要排除的路由

```js
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';
import { UserModule } from './modules/user/user.module';
// 中间件
import { TestMiddleware } from './common/middlewares/test.middleware';

// 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
@Module({
  imports: [
    PostsModule,
    TagsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// 导出根模块类，它已经经过 @Module 装饰器 装饰了。
export class AppModule implements NestModule {
  // 实现中间件注册
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TestMiddleware) // 应用中间件,多个时逗号分隔即可。
      .exclude( // 排除对象
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',
      )
      .forRoutes('*') // 指定应用的路由或者控制器
      .forRoutes(CatsController) // 或者指定控制器
      .forRoutes({ path: 'cats', method: RequestMethod.GET })// 或者RouteInfo 对象

  }
}

// 全局注册中间件就是使用 app 的 use 方法注册、对每个已注册的路由生效。
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
};
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);

```

#### 3. 日志收集和记录中间件实践

使用 Nestjs 中的两个技术点 中间件 + 拦截器 ，以及 Nodejs 中流行的 log 处理器 log4js 来实现。最后的实现出来的效果是：错误日志和请求日志都会被写入到本地日志文件和控制台中。后续还会写一个定时任务的把日志清理以及转存。


### 2 导航守卫 Guard

#### 1. 概述
导航也是 NestJS 中实现 AOP 编程的五种方式之一，导航守卫就一个职责：它们根据运行时出现的某些条件（例如权限，角色，ACL(访问控制列表)等）来确定给定的请求是否由路由处理程序处理。即在调用某个 Controller 之前返回 true 或 false 决定放不放行(也就是进不进入这个路由)。

而这通常被称为授权，也就是看它有无授权进而查看它是否能访问某些路由。本质上 Nest 守卫也是一个带有 @Injectable()装饰器装饰的类，同时守卫要实现 CanActivate 接口、实现 canActivate 方法，这个方法函数应该返回一个布尔值true/false，指示当前请求是否被允许。如果返回 true，请求将被处理，如果返回 false, Nest 将拒绝请求。

守卫会在所有中间件之后执行，但在任何拦截器或管道之前执行、由守卫引发的任何异常都将由异常层(全局异常过滤器和应用于当前上下文的任何异常过滤器)处理。作用类似express、koa里的鉴权中间件。

和中间件的区别是守卫可以访问 ExecutionContext 实例、其实也是一个使用 @Injectable() 注解修饰的类，并且可以注入依赖。

#### 2. 使用
使用 CLI 脚手架创建一个守卫使用命令如下命令即可 `$ nest g gu/guard  AuthGuard --no-spec --flat`、这里我们创建一个验证守卫。

在nest 中 Guard 用法也三种,分为全局路由守卫、控制器路由守卫、具体方法路由守卫
1. @UseGuards() 装饰器注册应用到方法路由守卫、控制器守卫。
2. app 对象的 useGlobalGuards 方法注册全局守卫、使用这种方法注册的守卫不能插入依赖项, 因为它们不属于任何模块。
3. 注册多个时使用逗号分隔。

每个守卫必须实现一个 canActivate() 函数。该方法接受一个参数，即 ExecutionContext 实例一般用context表示。ExecutionContext 继承自 ArgumentsHost。通过它我们可以获取对 Request 请求对象的引用、一般情况下我们是通过获取当前路由的元数据以及判断 token 是否过期来决定是否放行。

```js
// $ nest g gu/guard  AuthGuard --no-spec 生成的初始守卫内容
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('context', context);
    return true;
  }
}

// 使用：注册守卫
// main.ts注册全局导航守卫
app.useGlobalGuards(new TestGuard());

// 如果希望给全局守卫注入其它依赖使用如下方法，因为守卫也是使用@Injectable()装饰器的类所以是可注入的，也就是作为提供者。只不过此时提供者的名字是固定的 APP_GUARD。
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}


// 这样就是整个控制器生效
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { TestGuard } from './test.guard';
@UseGuards(RolesGuard) // 将守卫附加到此控制器声明的每个处理程序。
@UseGuards(new RolesGuard())
export class CatsController {
   // 这样就只在/aa路由中生效了
   @UseGuards(TestGuard) // 守卫只应用于单个方法
   @Get('aa')
   aa(): string {
    return 'aa';
   }
}

// 实际应用
// 这里我们可以通过 @SetMetadata 装饰器自定义元数据来向路由处理程序附加自定义元数据的能力。但直接在路由中使用@SetMetadata()不是一个良好的实践。相反，创建您自己的装饰器。为了访问路由的角色（自定义元数据），我们将使用Reflector辅助类，它由框架提供并从@nestjs/core包中公开。
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
// 这样就有了自定义的 @Roles() 装饰器

@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}

// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  // 注入依赖,这时不能使用app.use()注册为全局中间件
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 结果类似 [ 'user' ]
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log('body', request.body);
    const user = request.body.roles;
    return roles.some((item) => item === user);
  }
}

// 权限不足，也就是不通过时报错-自动返回以下响应。其背后的原理是，当守卫返回false时，框架会引发ForbiddenException。如果您希望返回不同的错误响应，您应该抛出自己特定的异常
{
    "message": "Forbidden resource",
    "error": "Forbidden",
    "statusCode": 403
}



```

### 3 拦截器 Interceptor

#### 1. 概述

拦截器也是 NestJS 中实现 AOP 编程的五种方式之一，功能上它和中间件是很类似的也是在目标 Controller 方法前后加入一些逻辑。区别在于 interceptor 可以拿到调用的 controller 和 handler、作用就是可以给它们加上数据元信息然后可以拿到，而中间件获取不到。在 NestJS 中可以处理请求处理过程中的请求和响应,所以 interceptor 更适合处理与具体业务相关的逻辑、例如身份验证、日志记录、数据转换等。

**作用**
1. 在函数执行之前/之后绑定额外的逻辑
2. 转换从函数返回的结果
3. 转换从函数抛出的异常
4. 扩展基本函数行为
5. 根据所选条件完全重写函数 (例如, 缓存目的)

它本质也是一个使用 @Injectable 装饰器装饰的类，这个类要实现 NestInterceptor 接口的 intercept 方法。
该方法接收两个参数：
1. 第一个是 ExecutionContext 实例 context(与守卫完全相同的对象)。ExecutionContext 继承自 ArgumentsHost。在拦截器中 context.getClass()可以获取当前路由的类,context.getHandler()可以获取到路由将要执行的方法名称。
2. 第二个参数是一个 CallHandler 。CallHandler 接口实现了 handle()方法。使用该方法在拦截器中的某个位置调用路由处理程序方法。在intercept()方法的实现中没有调用handle()方法，路由处理程序方法将根本不会被执行。

也就是说在最终路由处理程序执行之前和之后都可以实现自定义逻辑、之前就叫请求拦截器、之后就叫响应拦截器。
1. 在intercept()方法中编写在调用handle()之前执行的代码
2. handle()方法返回一个Observable，我们可以使用强大的RxJS操作符进一步操控响应、并将最终结果返回给调用方

**响应映射**

我们已经知道handle()返回一个Observable。这个流、包含来自路由处理程序返回的值，因此我们可以使用RxJS的map()操作符轻松地对其进行变换。

#### 2. 使用
使用 CLI 脚手架命令可以快速生成一个拦截器: `nest g itc test --no-spec --flat`、如创建一个记录用户交互的拦截器 `$ nest g itc common/itc --no-spec`

与守卫一样，拦截器也可以是控制器作用域、方法作用域、全局作用域。拦截器的绑定：为了设置拦截器，需要使用从@nestjs/common 包中导入的@UseInterceptors()装饰器。
1. @UseInterceptors() 装饰器绑定控制器作用域、方法作用域
2. app 对象的 useGlobalInterceptors() 方法全局绑定。使用这种方法注册的拦截器不能插入依赖项, 因为它们不属于任何模块。

```js
// itc.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ItcInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}

import {UseInterceptors} from '@nestjs/common';
// 1.控制器作用域：也就是只针对某个指定的控制器进行拦截，这样所有进入这个控制器的路由都会先进入这个拦截器中。
@UseInterceptors(LoggingInterceptor)
export class CatsController {}

// 2.方法作用域：就是只针对某个指定的方法进行拦截。
export class CatsController {
  @ApiOperation({ summary: '获取所有用户' })
  @Get()
  @UseInterceptors(TestInterceptor) // 方法作用域拦截器
  findAll() {
    return this.userService.findAll();
  }
}

// 3.全局作用域：就是针对全局的它是在main.ts中使用 useGlobalInterceptors 方法全局注册。
app.useGlobalInterceptors(new TransformInterceptor()); 
// 如果希望给全局守卫注入其它依赖使用如下方法，因为守卫也是使用@Injectable()装饰器的类所以是可注入的，也就是作为提供者。只不过此时提供者的名字是固定的 APP_INTERCEPTOR。
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './logger.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

```

#### 3. 序列化
序列化是在对象在网络响应中返回之前发生的过程。在这个阶段，我们可以定义规则来转换和清理要返回给客户端的数据。例如，敏感数据如密码应始终从响应中排除。或者，某些属性可能需要进行额外的转换，比如只发送实体的部分属性。

比如：定义一个数据返回拦截器-对请求成功(状态码为 2xx)的数据在返回给前台前进行一个统一的格式化处理。

RxJS 是一个组织异步逻辑的库，它有很多 operator(操作方法)，可以极大的简化异步逻辑的编写。数据源叫做 observable

```js
/**
 * 数据返回拦截器-对请求成功(状态码为 2xx)的数据在返回给前台前进行一个统一的格式化处理
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';


@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 200,
          msg: '请求成功',
        };
      }),
    );
  }
}



```

### 4 管道 Pipe

#### 1. 概述

它也是 NestJS 中实现 AOP 编程的五种方式之一，它是对函数参数通用逻辑抽出的切面。Pipe 一般用来做参数转换的。简单理解就如同水管一样。从一边流进去从另一边流出来，然后你可以在这中间也就是管道中对流动的东西进行一些处理。管道有两个典型的用例:对参数做一些检验和转换。
1. 转换: 将用户输入数据转换为所需的形式后再输出(例如，从字符串到整数)。
2. 验证: 对用户输入数据进行评估，如果有效，则不加修改地将其传递;否则，当数据不正确时抛出异常。
在这两种情况下，管道参数(arguments) 会由控制器的路由处理程序进行操作。Nest 会在调用这个方法之前插入一个管道，管道会先拦截方法的调用参数,进行转换或是验证处理，然后用转换好或是验证好的参数调用原方法。

在 NestJS 中,管道本质也是一个带有@Injectable()装饰器的类(提供者)，PipeTransform<T, R> 是每个管道必须要实现的泛型接口。泛型 T 表明输入的 value 的类型，R 表明 transfrom() 方法的返回类型。

管道分类:Nest自带很多开箱即用的内置管道、也可以构建自定义管道。所以管道主要有两种
1. 内置管道由Nest提供开箱即用
2. 自定义管道由用户自己定义

在使用上管道有如下方式:
1. 参数范围(parameter-scoped)的、直接使用。
2. 方法范围(method-scoped)的、使用 @UsePipes 装饰器装饰
3. 控制器范围的(controller-scoped)、使用 @UsePipes 装饰器装饰
4. 全局范围(global-scoped)的、app 实例的 useGlobalPipes 方法注册全局

#### 2. 内置管道
Nest 自带 9 个开箱即用的管道类、它们都是从 @nestjs/common 包导出、它们都实现了 PipeTransform 接口。
其中一个验证管道 ValidationPipe、七个转换管道即 Parse*管道、一个默认值管道DefaultValuePipe。

1. ValidationPipe: 用于验证请求数据，通常用于验证请求体数据、查询参数、路由参数等。它使用了类似于 class-validator 库的装饰器来进行验证。如果验证失败，它会抛出 ValidationException 异常。

2. ParseIntPipe: 用于将输入数据解析为整数。它可以将字符串形式的整数转换为 JavaScript 整数。如果无法解析为整数，它会抛出 BadRequestException 异常。

3. ParseFloatPipe: 用于将输入数据解析为浮点数。

4. ParseBoolPipe: 用于将输入数据解析为布尔值。它可以将字符串形式的"true"和"false"转换为对应的布尔值。如果无法解析为布尔值，它会抛出 BadRequestException 异常。

5. ParseArrayPipe: 用于将输入数据解析为数组。它可以将字符串形式的 UUID 转换为 UUID 对象。如果无法解析为数组，它会抛出 BadRequestException 异常。

6. ParseUUIDPipe: 用于将输入数据解析为 UUID（Universally Unique Identifier）。它可以将字符串形式的 UUID 转换为 UUID 对象。如果无法解析为 UUID，它会抛出 BadRequestException 异常。

7. ParseEnumPipe: 枚举类型

8. ParseFilePipe: 文件类型

9. DefaultValuePipe: 用于为缺少的参数提供默认值。如果某个参数未传递，它会使用提供的默认值替代。new DefaultValuePipe(false/1)、常和转换类管道一起使用提供默认值。

所有转换管道即 Parse*管道可以直接在方法参数上绑定、这些管道都在验证路由参数、查询字符串参数和请求体值的上下文中工作。

#### 3. 使用
管道可以是
1. 参数范围(parameter-scoped)的、
2. 方法范围(method-scoped)的、
3. 控制器范围的(controller-scoped)、
4. 全局范围(global-scoped)的。

```js
// 参数作用域：
@Get(':id')
async findOne(@Param('id',new DefaultValuePipe(0) ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
  this.catsService.create(createCatDto);
}
// 方法作用域：
@Post()
@UsePipes(new JoiValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
// 控制器作用域：
@Controller('cats')
@UsePipes(new ValidationPipe())
export class CatsController {}

// 全局：依然是在入口文件中使用 useGlobalPipes 装饰器。这种全局无法给管道注入依赖
app.useGlobalPipes(new ValidationPipe());

// 可以在app模块中声明以此注入依赖
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule {}

```

#### 4. 自定义管道
使用 CLI 脚手架创建一个管道使用命令即可 `$ nest g pi/pipe  <name>`、例如创建一个校验管道 `$ nest g pi/pipe  common/pipes/validation`。

自定义 Pipe 要实现 PipeTransform 接口，实现 transform 方法，里面可以对传入的参数值 value 做参数验证，比如格式、类型是否正确，不正确就抛出异常。也可以做转换，返回转换后的值。 transfrom() 方法有两个参数：
1. value 当前处理的方法参数(在被路由处理程序方法接收之前)
2. metadata 当前处理的方法参数的元数据。

元数据对象具有以下属性:

```js
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}


export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  // 参数是一个 body @Body(), query @Query(), param @Param(), 还是自定义参数,主要是验证类型。
  metatype?: Type<unknown>;
  // 参数的元类型
  data?: string;
  // 传递给装饰器的字符串
}

```   
**对象结构验证**：一般会使用基于对象结构的验证来对数据进行校验、这里常使用 Joi 库、它允许使用可读的 API schema.validate() 方法以直接的方式验证参数是否符合提供的 schema，让我们构建一个基于 Joi schema 的验证管道。

安装依赖: `$ npm install --save joi` 、 `npm install --save-dev @types/joi`

```js
import {
  ArgumentMetadata,
  Injectable,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class ValidationPipePipe implements PipeTransform {
  // 注入 Joi 的对象结构验证
  constructor(private schema: ObjectSchema) {}
  // 验证管道要么返回该值，要么抛出一个错误。
  transform(value: any, metadata: ArgumentMetadata) {
    // 如果字段名不一致抛出一个错误
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}

// 在控制器里注册管道
import * as Joi from 'joi';
const createCatSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  breed: Joi.string().required(),
})

export interface CreateCatDto {
  name: string;
  age: number;
  breed: string;
}


@Post()
@UsePipes(new ValidationPipePipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
// 结构或类型有不一致时报错
{
    "message": "Validation failed",
    "error": "Bad Request",
    "statusCode": 400
}


```

还有一种比较常用的验证管道类型是:**类验证器**、Nest 与 class-validator 配合得很好。这个优秀的库允许您使用基于装饰器的验证。安装完成后，我们就可以向 Dto 类中添加一些装饰器来校验、不用额外定义schema对象。所以一般我们是使用这种验证。

安装依赖: `$ npm i --save class-validator class-transformer`

```js
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipePipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // plainToInstance 方法将普通的 JavaScript 参数对象转换为可验证的 dto class 的实例对象。
    const object = plainToInstance(metatype, value);
    // 调用 class-validator 包的 validate api 对它做验证。如果验证不通过，就抛一个异常。
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed:${errors}`);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

// 在控制器里注册管道
import { IsString, IsInt } from 'class-validator';
export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}

// 方法范围
@Post()
@UsePipes(new ValidationPipePipe())
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
// 参数范围
@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
  this.catsService.create(createCatDto);
}
// 结构不一致时报错
{
    "message": "Validation failed",
    "error": "Bad Request",
    "statusCode": 400
}
```



## 3.5 过滤器 ExceptionFilter

### 1. 概述

过滤器也是 NestJS 中实现 AOP 编程的五种方式之一，Nest 中过滤器一般是指: 异常处理过滤器,他们开箱即用返回一些指定的 JSON 信息。在 NestJS 中有一个内置异常处理层、当一个异常没有被应用程序代码处理时(显性声明处理)，它就会被这个异常处理层捕获，然后自动发送一个适当的用户友好响应。

默认情况下，这个操作是由内置的全局异常过滤器执行的，它处理类型为HttpException（以及其子类）的异常。当一个异常是未识别的（既不是HttpException，也不是继承自HttpException的类），内置的异常过滤器会生成以下默认的JSON响应:
```js
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

Nest 提供了一个内置的 HttpException 类，可以从@nestjs/common包中引入。可以在任意地方使用它手动抛出一个标准异常。

HttpException 类接收两个必填参数用来决定返回的信息、默认情况下，返回的 JSON 响应体也包含两个属性。
new HttpException('message描述信息', http状态码statusCode);
1. message:基于状态的 HTTP 错误的简短描述。
2. statusCode:默认为 status 参数中提供的 HTTP 状态码

```JavaScript
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  throw new HttpException('xxxx', HttpStatus.BAD_REQUEST)

}
// 当客户端访问时就会返回如下内容：
{
  "statusCode": 403,
  "message": "Forbidden"
}

```

内置HTTP异常: Nest提供了一组标准异常，这些异常都是从基本的HttpException继承而来的。它们在@nestjs/common包中公开，代表了许多常见的HTTP异常。使用也是一样的手动抛出即可



### 2 使用
尽管基础（内置）异常过滤器可以自动处理许多情况，但您可能希望对异常层具有完全控制。
这时就创建一个异常过滤器，负责捕获 HttpException 类的实例，并为其实现自定义响应逻辑。使用 CLI 脚手架命令快速生成一个过滤器 `$ nest g f/filter  http-exception --no-spec`、 `$ nest g f/filter  common/http-exception --no-spec`。

每一个过滤器都应该实现 ExceptionFilter 接口、实现接口要求提供具有指定签名的 catch(exception: T, host: ArgumentsHost) 方法。其中，T 表示异常的类型。

@Catch(HttpException) 装饰器会将必要的元数据绑定到异常过滤器上，告诉 Nest，这个特定的过滤器正在寻找类型为 HttpException 的异常，而不是其他类型的异常。如果要捕获每个未处理的异常（无论异常类型如何）参数列表留空。

定义了异常过滤器之后、就是使用。在 Nest 里过滤器和中间件、守卫、拦截器类似，也是有全局作用域过滤器、控制器作用域、方法作用域三种。有两种方法注册绑定过滤器、
1. 使用 @UseFilters 装饰器注册方法作用域这样只应用于单个路由处理程序、也可以应用于控制器级别。与 @Catch() 装饰器类似，它可以接受一个过滤器实例，或者一个逗号分隔的过滤器实例列表。也可以传递类（而不是实例），将实例化的责任交给框架，并启用依赖注入。尽可能使用类来应用过滤器，而不是实例。这样做可以减少内存使用，因为 Nest 可以在整个模块中轻松重用相同类的实例。 
2. 使用 app 实例的 useGlobalFilters 方法注册绑定的就是全局级别。

```javaScript
 /**
 * 创建一个统一的异常处理器-在错误发生时做一个统一的过滤处理后再返回给前端
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // exception 当前正在处理的异常对象
    // host 一个 ArgumentsHost 对象、它是一个强大的实用工具对象
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse<Response>(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
    // 设置错误信息,没有时根据状态码值返回
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    const errorResponse = {
      data: {},
      timestamp: new Date().toISOString(),
      message: message,
      code: status,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}

// 绑定过滤器
// 方法作用域：使用UseFilters装饰器装饰即可
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}

// 控制器作用域：
@UseFilters(new HttpExceptionFilter())
export class CatsController {}

// 全局作用域过滤器：在入口文件中使用useGlobalFilters装饰器设置全局
app.useGlobalFilters(new HttpExceptionFilter());

```


## 3.9 自定义装饰器

### 1. 概述
Nest是基于一种称为装饰器的语言特性构建的。一个ES2016装饰器是一个返回函数的表达式，它可以接受目标、名称和属性描述符作为参数。您可以通过在要装饰的内容的顶部加上@字符来应用它。装饰器可以定义(装饰)在类、方法或属性上。 

### 2. 使用
除了 Nest 提供的装饰器之外、用户还可以根据需要自定义装饰器。
`nest g decorator aaa --flat`
```JavaScript
// 在Node.js世界中，通常的做法是将属性附加到request对象上。然后，在每个路由处理程序中手动提取它们
// 例如 const user = req.user;
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// 自定义参数装饰器
export const User = createParamDecorator(
  // 这个 data 就是传入装饰器的参数，@User(data)
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// 之前使用@SetMetadata定义元数据
@Get()
@SetMetadata('roles', ['admin'])
@useGuards(AuthGuard)
async findOne(@User() user: UserEntity) {
  console.log(user);
}
// 在 guard 里使用 reflector 来取 metadata
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log(this.reflector.get('roles', context.getHandler()));

    return true;
  }
}

// 自定义其它装饰器
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
// 使用自定义装饰器
@Get()
@Roles('admin')//这个自定义装饰器就是对上面的装饰器进行了封装
async findOne(@User() user: UserEntity) {
  console.log(user);
}

```


# 四、NestJS 进阶知识

## 4.1 提供者相关

### 1. 依赖注入原理
通过对提供者的学习、我们知道在Nest中构造函数基础的依赖注入(DI)作用是将提供者实例（通常是服务提供者）注入到需要使用的类中。

而提供者是怎么实例化的、这个是通过控制反转(IOC)技术实现的。原理是将依赖项的实例化委托给IoC容器(在 Nest 里就是NestJS运行时系统)、而不是手动 new 实例化。

在 Nest 中将提供者注入到我们的控制器类中是通过类的构造函数实现的、然后将提供者注册到Nest的IoC容器中(也就是模块中)。这个过程有三个关键步骤

1. 使用 @Injectable() 装饰器声明的类说明它是可注入、可以由Nest IoC容器管理。
2. 使用构造函数注入声明对提供者令牌的依赖、constructor(private catsService: CatsService)相当于声明了一个  CatsService 令牌标识,键值对同名。或者使用属性的方式声明依赖时一样(通过 @Inject()装饰器声明)。前者是构造器注入，后者是属性注入，两种都可以。
3. 在模块类中将 CatsService 令牌与真正的 CatsService 类关联起来(即注册)、类似于es对象的键值对名一致所以缩写了。
   
如此、当Nest IoC容器实例化 CatsController 时，它首先会查找任何依赖项。当它找到CatsService依赖项时，它会在CatsService令牌上进行查找，该令牌会根据上面的注册步骤返回CatsService类。然后Nest将创建一个CatsService的实例，将其缓存并返回，或者如果已经缓存了一个实例，则返回现有的实例。nest 在背后自动做了对象创建和依赖注入的工作。

通过注册的完整写法、我们就可以理解注册过程。在这里，我们明确地将CatsService令牌与CatsService类关联起来。本质就是IoC 机制是在 class 上标识哪些是可以被注入的，它的依赖是什么，然后从入口开始扫描这些对象和依赖，自动创建和组装对象。

```JavaScript

import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  // 注入依赖项
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}

// 将提供者注册到Nest的IoC容器中
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  // 注册，这种写法实际是下面的缩写、令牌被用来请求同名类的实例
  // 这种也叫标准提供者
  providers: [CatsService],

  // 完整写法
  providers: [
   {
      // 令牌名
      provide: CatsService,
      // 实际的类名
      useClass: CatsService,
   }
  ]; 
})
export class AppModule {}

```

### 2. 自定义提供者
当标准提供者无法满足我们的开发需要时我们就需要自己定义、Nest提供了几种定义自定义提供者的方法。总归就是传递给 providers 选项数组的一个对象、不过要注意使用非类名令牌名定义提供者时需要使用 @Inject() 装饰器引入。

```js
{
  provide: '令牌名', //除了是类名、还可以使用字符串、JavaScript的symbols或TypeScript的枚举作为标识符值的符号类型。 
  // 提供者的类型
  useClass: '类提供者'
  useValue: '值提供者'
  useFactory: '工厂提供者'
  useExisting: '别名提供者'

}
```
1. 标准提供者(类提供者的简写形式)
providers属性接受一个提供者数组、且是通过一个类名列表提供了这些提供者。本质是类名直接作为token令牌(称为类提供者)而已、如果是一个类名、那么Nest会自动实例化它。如果是一个字符串或者符号作为依赖注入的令牌token(统称为非类提供者)，这时候就需要使用@Inject()装饰器这个装饰器只接受一个参数——令牌。
```js
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
// 本质上是类提供者的简写
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
];
```
2. 类提供者(useClass)、 也就是我们默认使用的标准形式、直接使用类名称作为令牌，这时nest会自动实例化它。令牌对应的类还可以根据环境变量动态确认。
```js
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { OtherUserService } from './user/otherUser.service';

// 提供者注册对象也是可以抽离的
// 根据环境选择不同的配置
const configServiceProvider = {
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === 'development'
      ? DevelopmentConfigService
      : ProductionConfigService,
};


@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    configServiceProvider,
    {
      provide: UserService,
      useClass: process.env.NODE_ENV === 'development'?UserService:OtherUserService,
    },
  ],
})
export class AppModule {}
```
3. 值提供者 (useValue)、注入常量值、将外部库放入 Nest 容器或使用模拟对象替换实际实现非常有用。此时不同于基于构造函数的依赖注入、需要使用@Inject()装饰器注入自定义的提供者、这个装饰器接受一个参数 - 标识符。
```js
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';

// 值注入
const user = {
  name: '张三',
  age: 18,
};
@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    {
      provide: 'person',
      useValue: user,
    },
  ],
})
export class AppModule {}


import {
  Controller,
  Get,
  Inject,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  // 使用属性注入方式获取值提供者提供的值
  @Inject('person')
  private readonly person: { name: string; age: number };

  // 使用构造方法注入
  constructor(@Inject('person') person: { name: string; age: number }) {}

  @Get('person')
  getPerson() {
    return this.person;
  }
}

```

4. 工厂提供者(useFactory)、它是一个工厂函数这意味着可以动态创建提供者、实际的提供者将由从工厂函数返回的值提供。在useFactory语法中使用async/await。工厂函数返回一个Promise，而且工厂函数可以等待异步任务结果返回之后再注入。Nest会在实例化任何依赖（注入）这样的提供者的类之前等待Promise的解析。它还可以支持通过参数注入别的 provider。根据选项不同创建不同的数据库连接对象是比较常用的。这种叫异步提供者。

```js
// 提供者通常提供服务，但它们不仅限于此用途。提供者可以提供任何值。
const configFactory = {
  provide: 'CONFIG',
  useFactory(){
    // 根据当前环境提供配置对象的数组
    return process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
  },
};

@Module({
  providers: [configFactory],
})
export class AppModule {}
// 注入其它provide
const configFactory = {
  provide: 'person3',
  useFactory(person: { name: string }, appService: AppService) {
    return {
      name: person.name,
      desc: appService.getHello()
    }
  },
  // 通过 inject 参数注入其它提供者
  // 通过 inject 声明了两个 token，一个是字符串 token 的 person，一个是 class token 的AppService。
  // 也就是注入这两个 provider
  inject: ['person', AppService]
}
@Module({
  providers: [configFactory,AppService,{provide: 'person', useValue: {name: 'zhangsan'}}],
})
export class AppModule {}

```

5. 别名提供者(useExisting)、允许为现有的提供者创建别名、这样可以创建两种访问同一提供者的方式。
```JavaScript

@Injectable()
class LoggerService {
  /* implementation details */
}

const loggerAliasProvider = {
  // 重命名
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
};

@Module({
  providers: [LoggerService, loggerAliasProvider],
})
export class AppModule {}

```

**导出提供者** 与任何提供者一样，自定义提供者的作用域限定在其声明的模块中。要使它对其他模块可见，必须将其导出。要导出自定义提供者，可以使用它的令牌或完整的提供者对象。这样就可以在其它模块中注入导入的提供者。很多都需要时可以定义为全局模块、使用 @Global() 装饰器。不过尽量少用，不然注入的很多 provider 都不知道来源，会降低代码的可维护性。

```JavaScript
// 只在当前模块作用域
export const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
  // 导出其它模块可以引入
  exports: ['CONNECTION'], // 令牌
  exports: [connectionFactory],// 完整对象
})
export class AppModule {}

// 其它模块需要使用时导入即可
import { connectionFactory } from '../connectionFactory';
@Module({
  // 导入其它模块
  imports:[connectionFactory]
})
export class BModule {}



```


## 4.2 模块相关

### 1. 静态模块
模块是 Nest 实现依赖注入的关键所在、它定义了一组组件，如提供者和控制器，它们作为整个应用程序的模块部分相互配合。它们为这些组件提供了执行上下文或范围。例如，在模块中定义的提供者可以在不导出它们的情况下对模块的其他成员可见。当提供者需要在模块外部可见时，首先从其宿主模块 exports 导出，然后 imports 导入到其消费模块中。但是我们使用的基本是常规或静态模块绑定。看如下例子
```JavaScript
// UsersModule提供和导出一个 UsersService 。UsersModule是UsersService的宿主模块。
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// AuthModule 它导入了 UsersModule，从而使 UsersModule 导出的提供者UsersService 在 AuthModule 内部可用
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],// 导入UsersModule、不导入直接使用UsersService是不行的。
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

// 在 AuthModule 中的 AuthService 中注入 UsersService以便使用它
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  /*
    Implementation that makes use of this.usersService
  */
}

```

### 2. 动态模块
通过静态模块绑定，消费模块没有机会影响宿主模块的提供者配置。只能用不能修改。
而如果有一个通用的模块，需要在不同的用例中以不同的方式运行(类似于“插件”)、其中一个通用工具需要在被消费者使用之前进行一些配置。这时就使用动态模块功能、动态模块会提供一个API方法以便消费模块在导入时自定义该模块的属性和行为，而不是使用我们到目前为止所见到的静态绑定。其实就是能够将参数传递到要导入的模块中，以便我们可以更改其行为。示例

```JavaScript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';

@Module({
  // 动态模块导入
  imports: [ConfigModule.register({ folder: './config' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

从这个例子可以看出
1. register() 是一个静态方法、因为是在 ConfigModule 类上调用它，而不是在类的实例上调用。
2. register() 方法由自己定义，因此我们可以接受任何我们喜欢的输入参数。
3. register() 方法必须返回类似于模块的东西，因为其返回值出现在熟悉的 imports 列表中。

实际上这个方法可以有任意的名称，但按照惯例，我们应该将它称为 forRoot()、forFeature()  或 register()。
   - register() 创建模块时，您希望为调用模块配置特定的动态模块，仅供调用模块使用。例如，对于 Nest 的 @nestjs/axios 模块：HttpModule.register({ baseUrl: 'someUrl' } )。如果在另一个模块中使用 HttpModule.register({ baseUrl: 'somewhere else' })，它将具有不同的配置。您可以为尽可能多的模块执行此操作。用一次模块传一次配置。
   - forRoot() 创建模块时，您希望配置一个动态模块一次，并在多个地方重用该配置（虽然可能是在抽象的情况下）。这就是为什么您有一个 GraphQLModule.forRoot()、一个 TypeOrmModule.forRoot() 等。只注册一次，用多次，而且一般在 AppModule 里 import 引入。
   - forFeature()创建模块时，您希望使用动态模块的 forRoot 配置，但需要修改一些特定于调用模块需求的配置（例如，该模块应该访问哪个存储库，或者记录器应该使用哪个上下文）。用了 forRoot 之后，用 forFeature 传入局部配置，一般在具体模块里 imports

实际上，register() 方法返回的就是一个 DynamicModule。动态模块只是在运行时创建的模块，具有与静态模块完全相同的属性，以及一个额外的名为 module 的属性。对于动态模块，模块选项对象的所有属性都是可选的，除了 module。所以 ConfigModule 声明必须是如下结构。可以看出调用 ConfigModule.register(...) 返回一个具有属性的 DynamicModule 对象，这些属性本质上与我们迄今为止通过 @Module() 装饰器声明的模块一致提供的元数据也相同。

本质是调用类的静态方法、然后这个静态方法必须返回具有完全相同接口的对象，外加一个称为module的附加属性。 module属性用作模块的名称，并且应与模块的类名相同、因为它的返回值出现在熟悉的导入imports 列表中。

```JavaScript

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}

```

### 3. 模块配置
显而易见的解决方案是在静态的 register() 方法中向 ConfigModule 传递一个选项对象
本质上这个配置对象是给 模块 里的服务用的、所以关键是在运行时，我们首先需要将options对象绑定到 Nest IoC 容器，然后让 Nest 将其注入到我们的 ConfigService 中。提供者不仅可以是服务，还可以是任何值，因此我们完全可以使用依赖注入来处理一个简单的options对象。将传入的 options对象作为值提供者useValue，然后通过 @Inject('token') 来注入这个对象进而获取到传入的数据对象options。

而动态模块返回的本质上与我们迄今为止通过 @Module() 装饰器提供的元数据相同。

```JavaScript

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        // 声明为值提供者注入到服务里。
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
// 使用

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Inject } from '@nestjs/common';
import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

   // 使用非类令牌定义提供者时，需要使用 @Inject() 装饰器
  constructor(@Inject('CONFIG_OPTIONS') private options: Record<string, any>) {
    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}


```

## 4.3 执行上下文(Execution Context)
Nest提供了几个实用的类，帮助您轻松编写跨多个应用程序上下文（例如基于Nest HTTP服务器的、微服务和WebSockets应用程序上下文）运行的应用程序。不同类型的应用程序上下文它能拿到的参数是不同的，比如 http 服务可以拿到 request、response 对象，而 ws 服务就没有，如何让 Guard、Interceptor、Exception Filter 跨多种上下文复用是Nest需要考虑的。

在Nest中提供了ArgumentHost 和 ExecutionContext 两个类解决、是从 '@nestjs/common' 包中导出。

### 1. ArgumentsHost 类
ArgumentsHost类提供了一些方法，用于检索传递给处理程序的参数。它允许选择适当的上下文（例如HTTP、RPC（微服务）或WebSockets）来从中检索参数、可以使用ArgumentsHost的 getType()方法来实现。(这个类可以叫当前应用上下文)也就是用于切换 http、ws、rpc 等上下文类型的，可以根据上下文类型取到对应的 argument。
```JavaScript
if (host.getType() === 'http') {
  // do something that is only important in the context of regular HTTP requests (REST)
} else if (host.getType() === 'rpc') {
  // do something that is only important in the context of Microservice requests
} else if (host.getType() === 'graphql') {
  // do something that is only important in the context of GraphQL requests
}
// 应用的应用上下文是可以切换的

/**
 * Switch context to RPC.
 */
host.switchToRpc(): RpcArgumentsHost;
/**
 * Switch context to HTTP.
 */
host.switchToHttp(): HttpArgumentsHost;
/**
 * Switch context to WebSockets.
 */
host.switchToWs(): WsArgumentsHost;

```

在希望访问它的地方，Nest框架会提供 ArgumentsHost 的实例，通常命名为一个 host 参数进行引用。我们现阶段主要是对于HTTP服务器应用程序、此时host对象封装了Express的[request，response，next]数组，其中request是请求对象，response是响应对象，next是控制应用程序的请求-响应周期的函数。可以通过以下方法获取

```JavaScript
const ctx = host.switchToHttp();// 切换到HTTP请求上下文
const request = ctx.getRequest<Request>();//获取请求上下文中的 request 对象
const response = ctx.getResponse<Response>();//获取请求上下文中的 response 对象

```

### 2. ExecutionContext 类
ExecutionContext 扩展了 ArgumentsHost(也就是继承自ArgumentsHost、是它的子类)，提供有关当前执行过程的更多详细信息。
与 ArgumentsHost 一样，Nest 在你可能需要的地方提供了 ExecutionContext 的实例，通常作为一个 context 参数进行引用。例如 guard 的 canActivate() 方法和 interceptor 的 intercept() 方法。(也可以叫执行上下文)。

能够访问当前类和处理程序方法的引用提供了很大的灵活性。最重要的是，它使我们有机会从守卫或拦截器内部访问通过 @SetMetadata() 装饰器设置的元数据。

```JavaScript
// 方法返回即将被调用的处理程序的引用。
context.getHandler() 
// 方法返回此特定处理程序所属的 Controller 类型。
context.getClass() 

// 例如，在 HTTP 上下文中，如果当前处理的请求是绑定到 CatsController 上的 create() 方法的 POST 请求，getHandler() 将返回对 create() 方法的引用，而 getClass() 将返回 CatsController 类型（而不是实例）。


const methodKey = context.getHandler().name; // "create"
const className = context.getClass().name; // "CatsController"

```

## 4.4  元数据和反射
Metadata 元数据存在类或者对象上，如果给类或者类的静态属性添加元数据，那就保存在类上，如果给实例属性添加元数据，那就保存在对象上，用类似 [[metadata]] 的 key 来存的。

Reflect.defineMetadata 和 Reflect.getMetadata 分别用于设置和获取某个类的元数据，如果最后传入了属性名，还可以单独为某个属性设置元数据。

Nest 原理通过装饰器给 class 或者对象添加 metadata，并且开启 ts 的 emitDecoratorMetadata 来自动添加类型相关的 metadata，然后运行的时候通过这些元数据来实现依赖的扫描，对象的创建等等功能。而 metadata 的 api 还在草案阶段，需要使用 reflect-metadata 这个 polyfill 包才行。所以 Nest 的装饰器都是依赖 reflect-metadata 实现的，而且还提供了一个 @SetMetadata 的装饰器让我们可以给 class、method 添加一些 metadata。
```js
// 原始api
Reflect.defineMetadata(metadataKey, metadataValue, target);
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
let result = Reflect.getMetadata(metadataKey, target);
let result = Reflect.getMetadata(metadataKey, target, propertyKey);

// 上面的api可以支持装饰器的方式使用
@Reflect.metadata(metadataKey, metadataValue)
class C {

  @Reflect.metadata(metadataKey, metadataValue)
  method() {
  }
}

// Reflect.metadata 装饰器当然也可以再封装一层
function Type(type) {
    return Reflect.metadata("design:type", type);
}
function ParamTypes(...types) {
    return Reflect.metadata("design:paramtypes", types);
}
function ReturnType(type) {
    return Reflect.metadata("design:returntype", type);
}

@ParamTypes(String, Number)
class Example {
  constructor(text, i) {
  }

  @Type(String)
  get name() { return "text"; }

  @Type(Function)
  @ParamTypes(Number, Number)
  @ReturnType(Number)
  add(x, y) {
    return x + y;
  }
}
// 获取这个类和对象的元数据
let obj = new Example("a", 1);

let paramTypes = Reflect.getMetadata("design:paramtypes", obj, "add"); 
// [Number, Number]

```


# 五、其它技术知识

## 5.1 配置

### 1. 概述
应用程序通常在不同的环境中运行。根据环境的不同，应使用不同的配置设置。在 Node.js 中都是通过 process.env 全局变量来获取外部定义的环境变量。

在 Node.js 应用程序中，通常使用 .env 文件来表示每个环境的键值对(原生里我们是写在js文件中)，其中每个键代表特定的值。然后，只需替换正确的 .env 文件即可在不同的环境中运行应用程序。我们使用了dotenv 这个包来读取指定目录下的 .env配置文件。

在NestJS中它内置了一个模块 ConfigModule 来实现，这个公开了一个 ConfigService，该服务加载适当的 .env 文件。这个模块需要安装 Nest 提供的 @nestjs/config 包、这个包在内部还是使用了 dotenv。

安装: `$ npm i --save @nestjs/config`

### 2. 使用
安装完成后，就可以导入 ConfigModule。通常情况下，我们会将其导入到根 AppModule 中，并使用 .forRoot() 静态方法来控制其行为。

它从默认位置（项目根目录）加载和解析一个 .env 文件，将 .env 文件中的键值对与分配给 process.env 的环境变量进行合并，并将结果存储在一个私有结构中，您可以通过 ConfigService 访问该结构。

forRoot() 方法会注册 ConfigService 提供者，该提供者提供了一个 get() 方法，用于读取这些已解析/合并的配置变量。它可以接收一个配置对象指定配置文件的位置。

自定义配置文件: 导出一个工厂函数，该函数返回一个配置对象。这个配置对象可以是任意嵌套的纯 JavaScript 对象。

```JavaScript

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  imports: [
    ConfigModule.forRoot({
      // 传入配置文件自定义环境文件路径
      envFilePath: '.development.env',
      // 禁用环境变量加载即不加载 .env 文件
      ignoreEnvFile: true,
      // 在其他模块中使用 ConfigModule 时声明为全局模块
      isGlobal: true,
      // 缓存环境变量、访问 process.env 可能会比较慢
      // 为true可以提高 get方法 在处理时的性能
      cache: true,
      // 自定义配置文件是一个数组，允许加载多个配置文件
      // 它会和 .env 文件和外部定义的变量合并
      load: [configuration],
    });
  ],
})
export class AppModule {}

// 自定义配置文件
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
});

// 在某个特性模块中使用要先导入、除非声明为全局模块。
// feature.module.ts 
@Module({
  imports: [ConfigModule],
  // ...
})

// 一样的通过类构造函数注入依赖
constructor(private configService: ConfigService) {}
// 注入之后使用 configService.get() 方法通过传递变量名来获取简单的环境变量。
// 还接受一个可选的第二个参数，用于定义默认值。当键不存在时，将返回该默认值
this.configService.get() 
const title = this.configService.get('APP_TITE');


```

## 5.2 数据库相关
Nest 是数据库无关的，允许您轻松集成任何 SQL 或 NoSQL 数据库。依然是MySQL、mongodb、redis三个数据库为主。不同在于为了与 SQL 和 NoSQL 数据库集成，Nest 提供了 @nestjs/typeorm 包。它使用的是 ORM 技术（Object-Relational Mapping）,即把关系数据库的表结构映射到对象上来操作数据库、它和我们使用的 mongoose 包类似的。

### 1. MySQL
在 nodejs里可以 用 mysql2 和 typeorm 两种方式来操作 MysSQL 数据库。前者还是要写SQL语句、不推荐使用，后者是ORM技术( Object Relational Mapping)，对象关系映射。也就是说把关系型数据库的表映射成面向对象的一个类 class，表的字段映射成对象的属性映射，表与表的关联映射成属性的关联、最终会自动生成SQL语句。所以这里我们选择 typeORM 这个库来操作关系型数据库mysql、好处就是对表的增删改查就变成了对对象的操作。

安装：`$ npm install --save @nestjs/typeorm typeorm mysql2`

安装必须的包之后就可以在 Nest 中进行配置进而通过代码实现对数据库的增删改查了。

#### 使用步骤
将 typeorm 集成进 Nest中是比较简单的,步骤如下:

1. 完成安装后将 TypeOrmModule 导入到根 AppModule 中、在 nest 项目中注册使用动态模块的方式注册 typeORM。注册完成后 TypeORM 的 DataSource 和 EntityManager 对象将可在整个项目中进行注入（无需导入任何模块）。
```JavaScript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 连接MySQL数据库
import { TypeOrmModule } from '@nestjs/typeorm';

// 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
@Module({
  imports: [
    // 使用 TypeORM 配置数据库
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'wanggeng123456',
      database: 'nest-vue-bms',
      retryDelay: 4000,// 连接重试之间的延迟（毫秒） (默认值: 3000)
      // entities: [User], // 一个一个手动将实体添加到数据源选项的 entities 数组注册
      autoLoadEntities: true, // 自动注册实体，设置为 true 的时候,NestJS 会自动加载数据库实体文件xx.entity.ts文件来创建数据表(如果没有的话)
      synchronize: false, // 是否自动同步实体文件(即是否建表),生产环境建议关闭否则可能会丢失生产数据 - 不同步
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

```

orm 有两种方式实现对具体的数据库表的操作:
 - 一种是使用 EntityManager 实体管理器
 - 另一种是使用 Repository 存储库模式

两者都可以实现对数据库表的 curd 操作，但是 Repository 操作仅限于具体实体也就是指定的单个表名。所以一般我们使用后者。

2. 创建实体 Entity,Entity 就是由 @Entity 装饰器装饰的一个类，TypeORM 会为此类模型创建数据库表。
其中 @Entity 装饰器 传入的参数就是实际创建的数据库表名。还有字段名的定义、约束、校验等都是在这里定义的。一般都是单独放在 entities 目录下,同时文件名一般为 xxx.entity.ts/xxx.entity.js。

```JavaScript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('posts')
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @Column({ length: 50 })
  title: string;

  @Column({ length: 20 })
  author: string;

  @Column('text')
  content: string;

  @Column({ default: '' })
  thumb_url: string;

  @Column('tinyint')
  type: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}

```

3. 在 module 中注入要使用那些存储库,使用 TypeOrmModule.forFeature() 方法来定义在当前范围内注册哪些仓库。有了这个设置，我们可以使用 @InjectRepository() 装饰器将 UsersRepository 注入到 UsersService 中
```JavaScript
// posts.module.ts
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
// 引入实体类并注册实体类
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.entity';
@Module({
  // 注册实体类
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

```

4. 在 service 文件中使用仓库,模块文件中导入实体类之后就可以在服务类中注册使用了,使用 @InjectRepository(实体类名)的形式注册,之后通过这个变量就可以实现对对应数据库表的 curd。
```JavaScript
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository,InjectEntityManager  } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './entities/posts.entity';

// 查询参数接口
interface QueryItf {
  value: number;
  name: string;
}
// 帖子信息接口
export interface PostsRo {
  list: PostsEntity[];
  count: number;
}

@Injectable()
export class PostsService {
  // 注入实体管理器,这样每个 api 都要带上对应的 Entity,所以一般是不用这个方法的
  @InjectEntityManager()
  private manager: EntityManager;

  // 注入实体类仓库操作数据库-属性注入
  @InjectRepository(PostsEntity) 
  private postsRepository: Repository<PostsEntity>,

  constructor(
    // 注入实体类仓库操作数据库-构造函数注入
    @InjectRepository(PostsEntity) 
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  /**
   * 创建文章
   * @param post
   * @returns
   */
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    // return this.manager.save(User, createUserDto);
    return await this.postsRepository.save(post);
  }

  /**
   * 查询所有博客
   * @param query
   * @returns 所有博客列表
   */
  async findAll(query): Promise<PostsRo> {
    const qb = await this.postsRepository.createQueryBuilder('post');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  /**
   * 更加id查找指定博客
   * @param id
   * @returns {指定博客对象}
   */
  async findById(id: number): Promise<PostsEntity> {
    return await this.postsRepository.findOne({
      where: { id },
    });
  }

  /**
   * 更新指定博客
   * @param id
   * @param post
   * @returns
   */
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne({
      where: { id },
    });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  /**
   * 刪除指定博客
   * @param id
   * @returns
   */
  async remove(id) {
    const existPost = await this.postsRepository.findOne({
      where: { id },
    });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.remove(existPost);
  }
}

```

#### 字段校验
不管是前端传递的表单数据、还是声明实体时的实体字段一般都是需要校验的。比如必填、非空、数字等类型。而实体是类形式的、那么在 nest 中也可以使用之前学习过的 class-validator class-transformer 两个包来实现即可。非常的方便简单.

#### CRUD操作
对应 typeorm 的更多操作在单独的一个[仓库](https://github.com/zangqingan/typeorm-study)里学习,不过要注意的是表关系在实际开发中是逻辑声明的,也就是开发者约定关联关系而不是真的声明. 查的时候照样连表查询即可.


### 2. MongoDB
Nest 支持两种与 MongoDB 数据库集成的方法。
1. 依然使用内置的 TypeORM 模块，该模块具有适用于 MongoDB 的连接器，
2. 使用 Mongoose，这是最流行的 MongoDB 对象建模工具。

很明显我们使用第二中方法、这也是我们之前学习的。

安装所需的依赖项: `$ npm i @nestjs/mongoose mongoose`

#### 使用步骤

1. 安装过程完成后，将MongooseModule导入到根AppModule中。forRoot()方法接受与Mongoose包中的mongoose.connect()相同的配置对象、所以很方便。
```JavaScript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
})
export class AppModule {}

```
2. 模型注入、使用Mongoose，所有内容都源自于Schema。每个schema都映射到一个MongoDB集合，并定义了该集合中文档的结构。schemas用于定义Models。Models负责从底层MongoDB数据库创建和读取文档。这是我们知道的。

@Schema() 装饰器将一个类标记为模式定义。它将我们的 Cat 类映射到一个同名的 MongoDB 集合，但在末尾添加了一个附加的“s”，因此最终的 MongoDB 集合名称将是 cats。

@Prop() 装饰器在文档中定义属性、还接受一个选项对象参数如指示属性是否是必需的，指定默认值，或将其标记为不可变、与另一个模型的关联

{ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }

```JavaScript

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}
// 根据类创建 schema
export const CatSchema = SchemaFactory.createForClass(Cat);

```

3. 在模块中注入、MongooseModule 也是使用 forFeature() 方法来配置模块，其中包括定义应在当前范围内注册哪些模型。
```JavaScript

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat, CatSchema } from './schemas/cat.schema';

@Module({
  // 注入、函数对象的name属性返回函数名、可以是一个字符串
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

```

4. 在服务内使用 @InjectModel() 装饰器将 Cat 模型注入到 CatsService 中、这时就回到了mongoose包里的用法了使用model操作集合。
```JavaScript

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './schemas/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    // 创建方法一、
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
     // 创建方法二、
    return this.catModel.create(createCatDto);
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}

连接#

```

#### 多个数据库连接
一个项目需要连接多个数据库数据库时、只需要指定连接名即可。注意同名会被覆盖
```JavaScript

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/test', {
      connectionName: 'cats',
    }),
    MongooseModule.forRoot('mongodb://localhost/users', {
      connectionName: 'users',
    }),
  ],
})
export class AppModule {}

// 注册时告诉 MongooseModule.forFeature() 函数应该使用哪个连接。
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }], 'cats'),
  ],
})
export class CatsModule {}



```



### 3. Redis
redis 的设计是 key、value 的键值对的形式,常用来做缓存。就是可以查出数据来之后放到 redis 中缓存，下次如果 redis 有数据就直接用，没有的话就查数据库然后更新 redis 缓存。

在 Nest 里最流行的就是 redis 和 ioredis 这两个包。
安装`npm install redis`、`npm install ioredis`

```js
// 在 AppModule 添加一个自定义的 provider
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createClient } from 'redis';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        return client;
      }
    }
  ],
})
export class AppModule {}

// 然后注入到 service 里用就好了,这时候可以使用它的所有方法，get、set等
// 就是通过 useFactory 的方式动态创建 provider，token 为 REDIS_CLIENT。
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class AppService {

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async getHello() {
    const value = await this.redisClient.keys('*');
    await this.redisClient.set('newName', 'zhangsan');
    const value2 = await this.redisClient.get('newName');
    console.log(value);
    console.log(value2);
    console.log(value);

    return 'Hello World!';
  }
}



```
官方虽然提供了 cache-manager 但是一般不用、因为不支持各种 Redis 的命令，绝大多数情况下是不够用的，需要自己再封装。

## 5.3 版本控制

## 5.4 任务调度
任务调度(定时任务)可以在固定的日期/时间、重复的时间间隔之后，或者在指定的时间间隔之后执行任意代码（方法/函数）。在Linux世界中，通常使用像CRON这样的包来处理操作系统级别的定时任务。对于Node.js应用程序，有几个包可以模拟类似CRON的功能。Nest提供了@nestjs/schedule包，它集成了流行的Node.js cron包。

### 1. 使用
要开始使用它，首先我们需要安装所需的依赖。

安装: `$ npm install --save @nestjs/schedule`

1. 要启用任务调度，将ScheduleModule导入到根AppModule中，并按如下所示运行forRoot()静态方法。这个方法调用会初始化调度器并注册应用程序中存在的任何声明式的cron jobs(定时任务)、timeouts(超时任务)和intervals(间隔任务)。注册发生在onApplicationBootstrap生命周期钩子发生时，确保所有模块已加载并声明了任何计划的任务。
```JavaScript
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}

```

2. 声明一个定时任务、使用 @Cron()装饰器在包含要执行代码的方法定义之前就可以声明一个cron任务。
Cron任务可以调度一个任意的函数（方法调用）以自动运行。
  - 一次，在指定的日期/时间。
  - 定期运行；定期任务可以在指定的间隔内的指定时间点运行（例如，每小时一次，每周一次，每5分钟一次）。
```JavaScript
import { Inectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

// 声明一个cron任务、这个任务每当当前秒数为45时，handleCron()方法都会被调用。换句话说，该方法将每分钟运行一次，在第45秒标记时运行。
  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}

// cron模式字符串中的每个位置的解释方式
* * * * * *
| | | | | |
| | | | | day of week
| | | | months
| | | day of month
| | hours
| minutes
seconds (optional)

```
@Cron()装饰器支持所有标准的cron模式、常见如下:

| 名称        |  含义        | 
| ----------- | ----------- |
| * * * * * *      | 每秒钟执行一次          | 
| 45 * * * * *  | 每分钟的第45秒执行一次          | 
| 0 10 * * * *     | 每小时的第10分钟执行一次           | 
| 0 */30 9-17 * * *  | 在上午9点到下午5点之间，每30分钟执行一次          | 
| 0 30 11 * * 1-5   | 周一到周五上午11点30分执行一次         | 
| 提供一个JavaScript的Date对象 | 在指定的日期执行一次。         | 

3. 定义一个间隔任务、指定时间间隔内运行重复运行。使用@Interval()装饰器、将时间间隔值作为毫秒数传递给装饰器。本质是使用了JavaScript的setInterval()函数。你也可以使用cron任务来安排重复的任务。 
```JavaScript

@Interval(10000)
handleInterval() {
  this.logger.debug('Called every 10 seconds');
}

```

4. 超时任务、在指定的超时时间内运行（一次），将方法定义前缀为@Timeout()装饰器。内部使用了JavaScript的setTimeout()函数。
```JavaScript

@Timeout(5000)
handleTimeout() {
  this.logger.debug('Called once after 5 seconds');
}

```

5. 要使用只需要把定时任务引入到模块中即可。



## 5.5 队列

### 1. 概述
队列是一种强大的设计模式、可以解决如下问题:
1. 平滑处理处理高峰。例如，如果用户可以在任意时间启动资源密集型任务，您可以将这些任务添加到队列中，而不是同步执行它们。然后，您可以让工作进程以受控的方式从队列中提取任务。随着应用程序的扩展，您可以轻松地添加新的队列消费者来扩展后端任务处理能力。
2. 分解可能会阻塞Node.js事件循环的单片任务。例如，如果用户请求需要进行CPU密集型的工作，如音频转码，您可以将此任务委托给其他进程，从而使用户界面进程保持响应。
3. 在各种服务之间提供可靠的通信通道。例如，您可以在一个进程或服务中排队任务（作业），并在另一个进程中消耗它们。您可以通过监听状态事件来获得有关作业生命周期中的完成、错误或其他状态更改的通知，以及来自任何进程或服务的通知。当队列生产者或消费者失败时，它们的状态会被保留，当节点重新启动时，任务处理可以自动重新启动。

Nest提供了@nestjs/bull包作为对Bull的抽象/包装，Bull是一个受欢迎、得到良好支持且性能优越的基于Node.js的队列系统实现。该包使得在Nest应用程序中以Nest友好的方式集成Bull队列变得非常容易。Bull使用Redis来持久化作业数据，因此您需要在系统中安装Redis。由于它是基于Redis的，您的队列架构可以完全分布式且平台无关。

### 2. 使用
开始使用@nestjs/bull之前，首先需要安装必要的依赖项。

安装: `$ npm install --save @nestjs/bull bull`

安装完成后，我们可以将BullModule导入到根AppModule中。forRoot()方法用于注册一个bull包配置对象，该对象将用于注册在应用程序中的所有队列（除非另有说明）。配置对象包括以下属性(所有选项都是可选的)：
1. limiter: RateLimiter - 用于控制队列作业处理速率的选项。可选。
2. redis: RedisOpts - 用于配置Redis连接的选项。可选。
3. prefix: string - 所有队列键的前缀。可选。
4. defaultJobOptions: JobOpts - 用于控制新作业的默认设置的选项。可选。
5. settings: AdvancedSettings - 高级队列配置设置。通常不需要更改这些设置。
```JavaScript
// app.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
})
export class AppModule {}

```

## 5.6 日志
之前我们是自己收集信息然后写入本地文件中。
Nest内置了一个基于文本的日志记录器，在应用程序引导和其他情况下（例如显示捕获的异常，即系统日志）中使用。此功能通过@nestjs/common包中的Logger类提供。对于更高级的日志功能，您可以使用任何Node.js日志包（如Winston）来实现完全自定义的生产级日志记录系统。

### 1. 内置日志对象
Nest中内置了一个 Logger 对象，该对象可用于记录应用程序日志。
```js
import { Logger } from '@nestjs/common';
// 注册属性
  private logger = new Logger();

// 路由handler中使用
    this.logger.debug('aaa', AppService.name);
    this.logger.error('bbb', AppService.name);
    this.logger.log('ccc', AppService.name);
    this.logger.verbose('ddd', AppService.name);
    this.logger.warn('eee', AppService.name);
// 这里的 verbose、debug、log、warn、error 就是日志级别，第一个参数是日志的内容。第二个 AppService.name 是 context，也就是当前所在的上下文，这个日志是受 Nest 控制的，可以在创建应用的时候指定是否开启、也可以自己决定输出什么级别的日志。
NestFactory.create(AppModule,{
  logger:false,
  logger:['error','warn']
})

```

### 2. 使用 winston 
它是 Node 最流行的日志框架、安装 `npm i winston`、在Nest种集成 winston 本质就是自定义logger 。
然后需要安装 dayjs 格式化日期 `npm install dayjs`
安装 chalk 来打印颜色 `npm install --save chalk@4`

它有7种日志级别：
1. error - 0
2. warn - 1
3. info - 2
4. http - 3
5. verbose - 4
6. debug - 5
7. silly - 6

```js

import { ConsoleLogger, LoggerService, LogLevel } from '@nestjs/common';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import { createLogger, format, Logger, transports } from 'winston';

export class MyLogger implements LoggerService {

    private logger: Logger;

    constructor() {
        super();
    
        this.logger = createLogger({
            level: 'debug',
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.printf(({context, level, message, time}) => {
                            const appStr = chalk.green(`[NEST]`);
                            const contextStr = chalk.yellow(`[${context}]`);
        
                            return `${appStr} ${time} ${level} ${contextStr} ${message} `;
                        })
                    ),
                }),
                new transports.File({
                   format: format.combine(
                       format.timestamp(),
                       format.json()
                   ),
                   filename: '111.log',
                   dirname: 'log'
               })
            ]
        });
    }

    log(message: string, context: string) {
        const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        this.logger.log('info', message, { context, time });
    }

    error(message: string, context: string) {
        const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        this.logger.log('info', message, { context, time });
    }

    warn(message: string, context: string) {
        const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        this.logger.log('info', message, { context, time });
    }
}



```


## 5.7 事件
Event Emitter包（@nestjs/event-emitter）提供了一个简单的观察者实现，允许您订阅和监听应用程序中发生的各种事件。事件作为应用程序各个方面解耦的很好方式，因为单个事件可以有多个不相互依赖的监听器。

### 1. 使用

安装所需的包: `$ npm i --save @nestjs/event-emitter`

安装完成后，将EventEmitterModule导入到根AppModule中，并像下面显示的那样运行forRoot()静态方法：forRoot()调用会初始化事件发射器并注册应用程序中存在的任何声明性事件监听器。注册发生在onApplicationBootstrap生命周期钩子发生时，确保所有模块都已加载并声明了任何预定的作业。
```JavaScript

import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot()
  ],
})
export class AppModule {}

```

**emit触发事件:**要调度（即触发）一个事件，首先使用标准构造函数注入来注入EventEmitter2,然后在一个类中使用它即可。
```JavaScript
import {EventEmitter2} from '@nestjs/event-emitter'
constructor(private eventEmitter: EventEmitter2) {}

this.eventEmitter.emit(
  'order.created',
  new OrderCreatedEvent({
    orderId: 1,
    payload: {},
  }),
);

```

**监听事件:**要声明一个事件监听器，使用@OnEvent()装饰器在包含要执行的代码的方法定义之前进行修饰即可。作为一个提供者传入模块即可。
```JavaScript
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FindCatsAllListener {
  @OnEvent('find-mongo')
  handleOrderCreatedEvent(payload: any) {
    // emit 抛出的载荷
    console.log('payload', payload);
  }

  @OnEvent('order.created')
  handleOrderCreatedEvent(payload: OrderCreatedEvent) {
     // handle and process "OrderCreatedEvent" event
  }
}

// 模块类中依赖注入
 providers: [CatsService, valueProvider, factoryProvider, FindCatsAllListener],
```


## 5.8 压缩
压缩可以大大减小响应体的大小，从而提高Web应用的速度。这个主要说的是打包构建时。和在express中一样使用 compression 中间件包来启用 Gzip 压缩、安装完成后，将压缩中间件应用为全局中间件。

安装:`$ npm i --save compression`
```JavaScript
// 根模块
import * as compression from 'compression';
// somewhere in your initialization file
app.use(compression());

```


## 5.9 文件上传
要处理文件上传，Nest提供了一个基于express-multer中间件包的内置模块。Multer处理以 multipart/form-data 格式发布的数据，该格式主要用于通过HTTP POST请求上传文件。所有nest处理文件上传也不难。

安装Multer的类型定义包: `$ npm i -D @types/multer`

安装了此包后，我们现在可以使用Express.Multer.File类型

`import { Express } from 'express'`

### 1. 单个文件上传

要上传单个文件，只需将FileInterceptor()拦截器绑定到路由处理程序，并使用@UploadedFile()装饰器从请求中提取file。

FileInterceptor 接收两个参数
1. fieldName、HTML标签的name属性值
2. options配置对象
```JavaScript
// 文件上传
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
// 控制器
  // 文件上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFie(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    
  }

{
  fieldname: 'file',
  originalname: 'lg.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer数据,
  size:253578
}
// 可以根据文件元数据，比如文件大小或文件 MIME 类型等对上传内容进行文件格式、大小判断。

```

### 2. 文件校验
可以给 @UploadedFile 装饰器传入管道、为此Nest 提供了一个内置的 Pipe 来处理常见的使用情况，并促进/标准化添加新的用例。这个 Pipe 叫做 ParseFilePipe。也可以使用ParseFilePipeBuilder 类来组合和构建你的验证器、可以避免手动实例化每个验证器，而是直接传递它们的选项。

Nest提供了两个内置的FileValidator与ParseFilePipe管道结合使用实现文件上传的校验。
1. MaxFileSizeValidator 检查给定文件的大小是否小于提供的值（以字节为单位）
2. FileTypeValidator 检查给定文件的MIME类型是否与给定的值匹配。

当然用户也可以自己定义文件校验类、只需要继承 FileValidator 抽象类接口就行
```JavaScript
import { UploadedFile, MaxFileSizeValidator,FileTypeValidator, FileValidator, ParseFilePipe, ParseFilePipeBuilder,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
// 控制器
  // 文件上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  // @UsePipes(FileSizeValidationPipe)// 自定义文件校验管道
  uploadFie(@UploadedFile(
    // 使用内置的ParseFilePipe管道
    new ParseFilePipe({
      // 在任何验证器失败的情况下要抛出的 HTTP 状态码。默认为 400（BAD REQUEST）。
      errorHttpStatusCode:405,
      // 一个工厂函数，接收错误消息并返回一个错误。
      exceptionFactory
      // 必传：指定一个文件验证器数组，这些验证器将由 ParseFilePipe 执行
      validators: [
        // ... Set of file validator instances here
        new MaxFileSizeValidator({ maxSize: 1000 }),
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ]
    })

    // 使用特殊的 ParseFilePipeBuilder 类来组合和构建你的验证器。
    // 它内置了下面链式调用的方法
    new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'jpeg',
    })
    .addMaxSizeValidator({
      maxSize: 1000
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
  ) file: Express.Multer.File) {
    console.log(file);
    
  }

// 自定义文件校验器
export CustomFileValidator extends FileValidator {
  // 实现抽象方法即可
  isValid(file?: any): boolean | Promise<boolean>{
    return 'dddd'
  }

  buildErrorMessage(file: any): string;{
    throw new Error('dddd')
  }
}

```

### 3. 多个文件上传
1. 要上传一个文件数组（通过一个单一的字段名标识），可以使用 FilesInterceptor() 装饰器（注意装饰器名称中的Files是复数形式）。这个装饰器接受三个参数：
   - fieldName: 文件名。
   - maxCount: 可选数字，用于定义要接受的最大文件数量。
   - options: 可选的 MulterOptions 对象
```JavaScript
import {  UploadedFiles } from '@nestjs/common';
import {  FilesInterceptor } from '@nestjs/platform-express';
@Post('upload')
@UseInterceptors(FilesInterceptor('files'))
uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
  console.log(files);
}

// files 是单文件时的信息对象数组
[
  {
    fieldname: 'files',
    originalname: 'lg.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer,
    size: 253578
  },
  {
    fieldname: 'files',
    originalname: '1.avif',
    encoding: '7bit',
    mimetype: 'image/avif',
    buffer: Buffer,
    size: 30329
  }
]


```
    
2. 要上传多个文件（每个文件具有不同的字段名称键），请使用 FileFieldsInterceptor() 装饰器。此装饰器接受两个参数：
   - uploadedFields 一个包含多个对象的数组，每个对象都指定了一个必需的 name 属性，该属性的值为一个字符串，指定了一个字段名称
   - options: 可选的 MulterOptions 对象
```JavaScript
import {  UploadedFiles } from '@nestjs/common';
import {  FileFieldsInterceptor } from '@nestjs/platform-express';
@Post('upload')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'avatar', maxCount: 1 },
  { name: 'background', maxCount: 1 },
]))
uploadFile(@UploadedFiles() files: { avatar?: Express.Multer.File[], background?: Express.Multer.File[] }) {
  console.log(files);
}
// files是一个对象、结构如下
{
  avatar:[
    {
      fieldname: 'avatar',
      originalname: 'lg.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer,
      size: 253578
    }

  ],
  background: [
    {
      fieldname: 'background',
      originalname: '1.avif',
      encoding: '7bit',
      mimetype: 'image/avif',
      buffer: Buffer,
      size: 30329
    }
  ]
}

```

3. 任意文件名、要上传具有任意字段名称键的所有字段，请使用 AnyFilesInterceptor() 装饰器。此装饰器可以接受一个可选的 options 对象。
```JavaScript
import {  UploadedFiles } from '@nestjs/common';
import {  AnyFilesInterceptor } from '@nestjs/platform-express';
@Post('upload')
@UseInterceptors(AnyFilesInterceptor())
uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
  console.log(files);
}
// files 是一个数组结构如下
[
  {
    fieldname: 'aa',
    originalname: 'lg.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer,
    size: 253578
  },
  {
    fieldname: 'bafdf',
    originalname: '1.avif',
    encoding: '7bit',
    mimetype: 'image/avif',
    buffer: Buffer,
    size: 30329
  }
]


```

### 4. 没有文件
只接受 multipart/form-data 数据类型但不允许上传任何文件，请使用 NoFilesInterceptor装饰器。它会将数据设置为请求体的属性。如果请求中发送了任何文件，将会抛出 BadRequestException。
```JavaScript
import {  Body } from '@nestjs/common';
import {  NoFilesInterceptor } from '@nestjs/platform-express';
@Post('upload')
@UseInterceptors(NoFilesInterceptor())
handleMultiPartData(@Body() body) {
  console.log(body)
}

```

### 5. 上传地址
和multer这个包一样也可以指定上传路径、或者设置统一默认选项在导入 MulterModule 时调用静态的 register() 方法，传入支持的选项。
```JavaScript
MulterModule.register({
  dest: './upload',
});

@Post('upload')
  @UseInterceptors(
    // 针对单独接口
    FileInterceptor('file', {
      dest: './upload',
    }),
  )
  uploadFie(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const { buffer, ...rest } = file;
    console.log(rest);
    return rest;
  }

```

### 6. 流式传输文件内容
在Nest中同样可以对要传输的文件(图像、文档和任何其他文件类型。)进行流式传输减少服务端带宽的压力、是通过 可流式传输的文件类 StreamableFile来实现的。
它是一个保存要返回的流的类。要创建一个新的StreamableFile，您可以将Buffer或Stream传递给StreamableFile构造函数。
```JavaScript
import { Controller, Get, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileController {
  @Get()
  getFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }
}


```

### 7. 大文件切片上传

### 8. OSS 上传
OSS （Object Storage Service）对象存储服务来上传下载文件、以阿里云 OSS 为例。
安装需要依赖：`npm install ali-oss`


## 5.10 网络请求
nodejs是可以作为中后端、和前端一样发起网络请求的。Nest同样也可以使用任何通用的 Node.js HTTP 客户端库。这里我们使用 Axios、因为Nest 封装了 Axios 并通过内置的 HttpModule 提供访问。HttpModule 导出了 HttpService 类，它提供了基于 Axios 的方法来执行 HTTP 请求。该库还将得到的 HTTP 响应转换为 Observables。Observable可以使用rxjs的firstValueFrom或lastValueFrom来以promise的形式获取请求的数据。

安装: `$ npm i --save @nestjs/axios axios`

### 1. 使用
安装完成后，要使用 HttpService，首先需要导入 HttpModule。
接下来，使用普通的构造函数注入来注入 HttpService。
```JavaScript
// 模块类
import { HttpModule, HttpService } from '@nestjs/axios'
import { map } from 'rxjs';
@Module({
  imports: [HttpModule],
  providers: [CatsService],
})
export class CatsModule {}

// 提供者
@Injectable()
export class CatsService {
  constructor(private readonly httpService: HttpService) {}

  findAll(): Observable<AxiosResponse<Cat[]>> {
    return this.httpService
      .get('http://localhost:3000/cats')
      .pipe(map((response) => response.data));;
  }
}


```

### 2. 配置
Axios可以通过多种选项进行配置，以自定义HttpService的行为。
要配置底层的Axios实例，请在导入HttpModule时将一个可选的选项对象传递给其register()方法。这个选项对象将直接传递给底层的Axios构造函数。
```JavaScript

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,// 超时
      maxRedirects: 5,// 最大重定向数
    }),
  ],
  providers: [CatsService],
})
export class CatsModule {}


```


## 5.11 静态资源服务器
在express里是使用 express.static() 内置方法、而koa是使用koa-static中间件。Nest 默认在底层使用 Express 库。因此，适用于 Express 的每种技术也同样适用于 Nest。比如静态资源服务器、模板引擎等。
只需要安装需要的依赖包、然后再入口文件配置即可
```JavaScript
// main.ts
import { NestFactory } from '@nestjs/core';
// 要引入express平台的
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  // 配置静态资源服务器 
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // 模板存放位置
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 模板引擎
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();


```

## 5.12 认证

### 1. 概述
在开始学习原生node时、我们知道http 是无状态的协议，也就是说上一次请求和下一次请求之间没有任何关联。
而基本所有网站或者应用都有登录认证功能，登录之后再次请求依然是登录状态(也就是认证了)。
那么如何实现登录状态的保持呢？业界基本使用两种解决方案
1. 服务端保存 session + cookie 的方案。
第一次登录时后端返回凭证信息，前端存储在cookie中，之后每次http请求都会自动携带上cookie中保存的凭证信息，算是给请求打上了唯一标识。后端根据前端传过来的标识去查找与之对应的数据 session即可。

缺点：有CSRF(跨站请求伪造)风险，因为 cookie 会在请求时自动带上，那你在一个网站登录了，再访问别的网站，万一里面有个按钮会请求之前那个网站的，那 cookie 依然能带上。而这时候就不用再登录了。为了解决这个问题，我们一般会验证 referer，就是请求是哪个网站发起的，如果发起请求的网站不对，那就阻止掉。但这样依然不能完全解决问题，万一你用的浏览器也是有问题的，能伪造 referer 呢？

所以一般会用随机值来解决，每次随机生成一个值返回，后面再发起的请求需要包含这个值才行，否则就认为是非法的。这个随机值叫做 token，可以放在参数中，也可以放在 请求头 header 中，因为钓鱼网站拿不到这个随机值，就算带了 cookie 也没发通过服务端的验证。

还有一个问题当并发量比较高时会使用分布式部署，这时不同服务器之间的 session就会不同。
这个问题的解决有两种方案：
  - 一种是 session 复制，也就是通过一种机制在各台机器自动复制 session，并且每次修改都同步下。这个有对应的框架来做，比如 java 的 spring-session。各台服务器都做了 session 复制了，那你访问任何一台都能找到对应的 session。
  - 还有一种方案是把 session 保存在 redis，这样每台服务器都去那里查，只要一台服务器登录了，其他的服务器也就能查到 session，这样就不需要复制了。
分布式会话的场景，redis + session 的方案更常用一点。

2. 客户端保存 jwt token 的方案。
session + cookie 的方案是把状态数据保存在服务端，再把 id 保存在 cookie 里来实现的。既然这样的方案有那么多的问题，那我反其道而行之，不把状态保存在服务端了，直接全部放在请求里，也不放在 cookie 里了，而是放在HTTP请求头对象的 header 里，这样是不是就能解决那一堆问题了呢？

token 的方案常用 json 格式来保存，叫做 json web token，简称 JWT。它是保存在 request header 里的一段字符串（比如用 header 名可以叫 authorization）。
它由三部分组成：header头部、payload载荷、verify signature 验证签名
 - header 部分保存当前的加密算法，
 - payload 部分是具体存储的数据，
 - verify signature 部分是把 header 和 payload 还有 salt 做一次加密之后生成的。

这三部分会分别做Base 64加密后再返回、然后一般放到请求头header 的 authorization:Bearer xxx.xxx.xxx 字段上。
请求的时候把这个 header 带上，服务端就可以解析出对应的 header、payload、verify signature 这三部分，然后根据 header 里的算法也对 header、payload 加上 salt 做一次加密，如果得出的结果和 verify signature 一样，就接受这个 token。也就是认证成功。
而把状态数据都保存在 payload 部分，这样就实现了有状态的 http。


所以整个认证流程是: 
1. 前端用户登录提交用户名和密码 --> 
2. 后端接收并认证 --> 
3. 后端认证通过生成 jwt token并返回给前端 --> 
4. 前端本地(localStorage、sessionStorage)保存返回的jwt token  -->  
5. 前端之后每次请求都在请求头中携带jwt token  -->  
6. 后端拦截请求并验证 --> 
7. 验证通过执行业务逻辑并返回数据 --> 
8. 前端展示数据 --> 
9. 如果是验证不通过返回错误信息 --> 
10. 前端提示错误信息并返回登录页面。至此整个登录认证流程结束。

这个方案就没有第一种的问题，但是这个方案也有安全性问题，因为它是把数据直接 Base64 之后就放在了 header 里，那别人就可以轻易从中拿到状态数据，比如用户名等敏感信息，也能根据这个 JWT 去伪造请求。所以 JWT 要搭配 https 协议来用，让别人拿不到 header。

性能问题：JWT 把状态数据都保存在了 header 里，每次请求都会带上，比起只保存个 id 的 cookie 来说，请求的内容变多了，性能也会差一些。所以 JWT 里一般也不要保存太多数据。

没法让 JWT 失效：session 因为是存在服务端的，那我们就可以随时让它失效，而 JWT 不是，因为是保存在客户端，那我们是没法手动让他失效的。比如踢人、退出登录、改完密码下线这种功能就没法实现。


### 2. cookie + session 方案

#### 1. cookies
HTTP cookie是由用户的浏览器存储的小型数据片段。Cookie的设计目的是成为网站记住有状态信息的可靠机制。当用户再次访问网站时，Cookie会自动随请求一起发送。

安装依赖: `$ npm i cookie-parser`、`$ npm i -D @types/cookie-parser`。

安装完成后，将cookie-parser中间件应用为全局中间件即可。该中间件将解析请求的Cookie头，并将Cookie数据暴露为req.cookies属性，如果提供了密钥，则还将暴露为req.signedCookies属性。这些属性是cookie名称到cookie值的键值对。这样就可以从路由处理程序中读取Cookie。
```JavaScript
// main.ts
import * as cookieParser from 'cookie-parser';
// somewhere in your initialization file
app.use(cookieParser());

// 使用
import { Req,Res } from '@nestjs/common'
import { Request,Response } from 'express'
// 获取cookie
@Get()
findAll(@Req() request: Request) {
  console.log(request.cookies); // or "request.cookies['cookieKey']"
  // or console.log(request.signedCookies);
}
// 设置cookie返回
@Get()
findAll(@Res({ passthrough: true }) response: Response) {
  response.cookie('key', 'value')
}

```

#### 2. session
HTTP会话提供了一种在多个请求之间存储用户信息的方式，这对于MVC应用程序特别有用。
在 Nest 里实现 session 还是用的 express 的中间件 express-session。
安装 express-session 和它的 ts 类型定义
`$ npm i express-session` `$ npm i -D @types/express-session`

安装完成后，将 express-session 中间件应用为全局中间件在入口模块里启用它。
```JavaScript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'guang',// 指定加密的密钥 secret
    resave: false,// 每次访问时是否都会更新 session，不管有没有修改 session 的内容，而 false 是只有 session 内容变了才会去更新 session。
    name: 'ww' // 生成客户端cookie 的名字 默认 connect.sid
    saveUninitialized: false // 不管是否设置 session，都会初始化一个空的 session 对象。
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 在生产环境启用 HTTPS
      maxAge: 3600000, // 有效期一小时（可自定义）
     },
    rolling: true, // 每次请求都更新 session 过期时间
  }));
  await app.listen(3000);
}
bootstrap();

// 在 controller 里就可以注入 session 对象
import { Req,Res } from '@nestjs/common'
import { Request,Response } from 'express'
// 设置了上述配置后，您现在可以在路由处理程序内设置和读取会话值
@Get()
findAll(@Req() request: Request) {
  request.session.visits = request.session.visits ? request.session.visits + 1 : 1;
}

// 也可以直接使用 @Session() 装饰器从请求中提取会话对象
import { Session} from '@nestjs/common'
@Get()
findAll(@Session() session: Record<string, any>) {
  session.visits = session.visits ? session.visits + 1 : 1;
}

```

### 3. jwt token 方案
在 Nest 里实现 jwt 需要引入 @nestjs/jwt 这个包它可以生成和验证 JWT 令牌
安装：`$ npm install --save @nestjs/jwt`

然后在 AppModule 里引入 JwtModule,那就是全局注册，也可以在指定 module 文件中注册。
JwtModule 是一个动态模块，通过 register 传入 option。
或者是 registerAsync，然后通过 useFactory 异步拿到 option 传入。

```JavaScript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    JwtModule.register({
      global: true, // 注册为全局模块其他任何地方不用再导入 JwtModule
      secret: 'qingan', // 指定 secret
      signOptions: {
        expiresIn: '7d'
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// 也可以单独定义一个模块只在某些模块里用
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 登录校验
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
// 注入策略
import { LocalStrategy } from 'src/common/guards/local.strategy';
import { JwtStrategy } from 'src/common/guards/jwt.strategy';

// 定义 jwt 模块方便注入
const jwtModuleA = JwtModule.register({
  secret: 'test123456', // 指定加密 jwt 的密钥
  signOptions: { expiresIn: '4h' }, // 设置过期时间 expiresIn 设置为4小时
});
@Module({
  // 注册实体类
  imports: [TypeOrmModule.forFeature([User]), PassportModule, jwtModuleA],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
  exports: [jwtModuleA],
})
export class UserModule {}



```

注册成功后就可以在 controller 里注入 JwtModule 里的 JwtService 了。

```JavaScript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
    constructor(
    // jwt服务
    private readonly jwtService: JwtService,
  ) {}
  // 或者定义私有属性 
  private readonly jwtService: JwtService
}
// 然后添加一个 handler返回即可：使用 jwtService.sign 来生成一个 jwt token，放到 response header 里。
// 注意：注入 response 对象之后，默认不会把返回值作为 body 了，需要设置 passthrough 为 true 才可以。
@Get('ttt')
ttt(@Res({ passthrough: true}) response: Response) {
    const newToken = this.jwtService.sign({
      count: 1
    });

    response.setHeader('token', newToken);
    return 'hello';
}
 // 具体实现认证方法
  async signIn(data: SignInDto) {
    const { firstName, lastName } = data;
    console.log(firstName, lastName);
    // 根据前端传参查找数据库是否存在用户
    const user = await this.usersService.findOne(firstName, lastName);
    // 判断用户密码是否一致
    if (user?.lastName !== lastName) {
      throw new UnauthorizedException();
    }
    // 上面的判断可以封装成一个守卫
    // 一样 生成jwt并返回给前端
    const payload = { sub: user.firstName, username: user.lastName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

// 然后是定义一个守卫来统一处理
// public.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// 一个自定义的 @Public() 装饰器，我们可以将其用于装饰任何方法。用来声明哪些路由是公开的
@Public()
@Get()
findAll() {
  return [];
}


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
// 也可以使用nest提供的守卫 
import { AuthGuard } from '@nestjs/passport';
// passport-jwt策略token验证-使用本地的策略文件，要自定义 local.strategy.ts
  @ApiOperation({ summary: '用户登陆' })
  @UseGuards(AuthGuard('local')) // 增加登录导航校验守卫
  @Post('login')
  login(@Body() user: LoginDto, @Req() req) {
    return this.userService.login(req);
  }
import { IStrategyOptions, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';
// 解密
import * as bcrypt from 'bcryptjs';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new BadRequestException('用户名不正确！');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    console.log('user', user);
    return user; // 会自动挂载在req.user对象下
  }
}
// 策略也是一个提供者可以注入的。
```

## 5.13 授权
前面说的认证只是知道你是自己人也就是登录了、但是你的等级(权限)不知道。也就是说，身份验证通过之后还需要再做一步权限的校验，也就是授权。
授权与认证是正交且独立的、授权需要用到认证机制。授权（Authorization）指的是确定用户能够执行什么操作的过程。例如，管理员用户被允许创建、编辑和删除帖子。非管理员用户只能被授权阅读帖子。处理授权业界也是有许多不同的方法和策略、这里介绍常见的3种、它们适用于不同需求。
身份认证（Authentication）、鉴权（Authorization）。

### 1. 基于 ACL 的权限控制
给不同用户分配权限最简单的办法就是直接给用户分配权限、比如用户 1 有权限 A、B、C，用户 2 有权限 A，用户 3 有权限 A、B。
这种记录每个用户有什么权限的方式，叫做访问控制表（Access Control List）。它是一种多对多关系、一个用户可以拥有多种权限。
一种权限也可以分配给多个用户。存储这种关系需要用户表、角色表、用户-角色的中间表。3个表才能实现这种多对多关系。

**用户表实体:** User 有 id、username、password、createTime、updateTime 5 个字段。
```JavaScript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    username: string;

    @Column({
        length: 50
    })
    password: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;

    // 通过 @ManyToMany 装饰器声明和 Permisssion 表的多对多关系。
    @ManyToMany(() => Permission)
    // 通过 @JoinTable 装饰器声明并指定中间表的名字，执行后会自动生成
    // 中间表的两个外键也都是主表删除或者更新时，从表级联删除或者更新。
    @JoinTable({
        name: 'user_permission_relation'
    })
    permissions: Permission[] 
}

```

**权限表:**  permission 有 id、name、desc、createTime、updateTime 5 个字段，desc 字段可以为空。
```JavaScript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    name: string;
    
    @Column({
        length: 100,
        nullable: true
    })
    desc: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}

```

然后还需要一个 PermissionGuard 守卫、这个跟我们之前自定义装饰器的 @Roles装饰器类似的。
可以通过设置元数据来来判断、不过一般也是将它定义成一个装饰器。
```Javascript
// 安装
$ nest g guard permission --no-spec --flat
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
    // 注入依赖
  constructor(private reflector: Reflector) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context);
    // 通过设置的元数据信息来判断当前 handler 需要的权限来判断是否返回 true
    const permission = this.reflector.get<string>('permission', context.getHandler());
    // 查数据库当前用户对应拥有的权限集合、如果包含 permission就返回true、否则抛出没有权限的异常。
    return true;
  }
}

// 设置元数据
@Get()
@SetMetadata('permission','ddd')
findAll() {}
// 然后在 PermissionGuard 里通过 reflector 取出来

// 封装成装饰器 
// permission.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const Permission = (...permission: string[]) => SetMetadata('permission', permission);
```

### 2. 基于 RBAC 的权限控制
RBAC 是 Role Based Access Control，即基于角色的权限控制是最常用的一种权限控制方案。相比于 ACL 的权限控制，RBAC 是给角色分配权限，然后给用户分配角色。用户--> 角色--> 权限 它们都是多对多的关系。
好处是当多个用户需要增加同一种角色时，只需增加一个角色然后把权限封装到这个角色里，再把这个角色授予用户即可。

**用户表**
```JavaScript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    username: string;

    @Column({
        length: 50
    })
    password: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
    
    // 指定和角色的多对多关系
    @ManyToMany(() => Role)
    // 指定中间表名
    @JoinTable({
        name: 'user_role_relation'
    })
    // 使用的中间表的属性名
    roles: Role[] 
}

```

**Role表** 有 id、name、createTime、updateTime 4 个字段。
```JavaScript
import { Column, CreateDateColumn, Entity,PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    name: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
    
    // 指定角色和权限的多对多关系
    @ManyToMany(() => Permission)
    // 指定中间表名
    @JoinTable({
        name: 'role_permission_relation'
    })
    // 指定中间表的外键名
    permissions: Permission[] 
}

```

**权限表**
```JavaScript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    name: string;
    
    @Column({
        length: 100,
        nullable: true
    })
    desc: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}

```
这样就会生成 user、role、permission 这 3 个表，还有 user_roole_relation、role_permission_relation 这 2 个中间表。这时候关键时使用typeorm时需要指定说明关联表的关联关系 relations 才能查出关联的角色信息。

定义一个 permission 装饰器 @RequirePermission(permissionName)。
```JavaScript
import { SetMetadata } from '@nestjs/common';
export const  RequirePermission = (...permissions: string[]) => SetMetadata('require-permission', permissions);
// 在守卫里取出
const requiredPermissions = this.reflector.getAllAndOverride<string[]>('require-permission', [
  context.getClass(),
  context.getHandler()
])

console.log(requiredPermissions);
// 从角色表中拿出所有权限信息比较当选需要的权限、找到返回true、找不到说明没有权限
for(let i = 0; i < requiredPermissions.length; i++) {
  const curPermission = requiredPermissions[i];
  const found = permissions.find(item => item.name === curPermission);
  if(!found) {
    throw new UnauthorizedException('您没有访问该接口的权限');
  }
}


```

### 3. 基于 策略 的权限控制

## 5.14 其它安全相关知识

### 1. 加密和哈希
加密是对信息进行编码的过程。这个过程将信息的原始表示（称为明文）转换为另一种形式，称为密文。理想情况下，只有授权的参与者可以将密文解密回到明文，并访问原始信息。加密本身并不防止干扰，但它将可理解的内容拒绝给潜在的拦截者。加密是一个双向函数；使用正确的密钥可以对加密内容进行解密。

哈希(也叫散列)是哈希函数将给定的键转换为另一个值的过程。哈希函数是一个用于根据数学算法生成新的值的函数。

主要是对用户的密码进行加密，防止用户密码泄露。

对于加密，Node.js提供了一个内置的crypto模块，您可以使用它来加密和解密字符串、数字、缓冲区、流等等。我们在原生node里已经学习过了。

对于哈希，我们推荐使用 bcrypt 或 argon2 包。Nest 本身不会在这些模块之上提供额外的封装，以避免引入不必要的抽象。我们之前也学习过。
```JavaScript
// 安装、完成后就可以使用 hash 函数。
$ npm i bcrypt
$ npm i -D @types/bcrypt

import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;// 自定义的盐
const salt = await bcrypt.genSalt();// 生一个随机的盐

const password = 'random_password';// 前端传过来的密码
const hash = await bcrypt.hash(password, saltOrRounds);
// 比较密码是否一致
const isMatch = await bcrypt.compare(password, hash);

```

### 2. Helmet
Helmet 可以通过适当设置HTTP头来帮助保护您的应用免受一些众所周知的网络漏洞。一般来说，Helmet 只是一组设置与安全相关的HTTP头的较小中间件函数。
```JavaScript
// 安装所需的包
$ npm i --save helmet
// 安装完成后，将其应用为全局中间件

import helmet from 'helmet';
app.use(helmet());


```

### 3. CORS
跨源资源共享（CORS）是一种机制，允许从另一个域请求资源。在底层，Nest 使用了 Express 的 cors 包。所以使用上是和express 的 cors 包一样。要启用CORS，在Nest应用程序对象上调用 enableCors() 方法。
```JavaScript
const app = await NestFactory.create(AppModule, { cors: true });// 使用默认设置启用CORS
const app = await NestFactory.create(AppModule);
app.enableCors({});// 启用跨域、可以传入一个配置对象和cors文档是一样的配置项。
await app.listen(3000);

```

### 4. CSRF 保护
跨站请求伪造（也称为CSRF或XSRF）是一种恶意利用网站的类型，其中来自Web应用程序信任的用户的未经授权命令被传输。要减轻这种类型的攻击，您可以使用csurf 包。
```JavaScript
// 安装所需的包
$ npm i --save csurf
// 安装完成后，将 csurf 中间件应用为全局中间件即可。

import * as csurf from 'csurf';
// ...
// somewhere in your initialization file
app.use(csurf());

```

### 5. 限流
保护应用程序免受暴力攻击的常见技术是限速。
```JavaScript
// 安装 @nestjs/throttler 包
$ npm i --save @nestjs/throttler
// 安装完成后，ThrottlerModule 可以像其他 Nest 包一样使用 forRoot 或 forRootAsync 方法进行配置。
// app.module.ts
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,// 存活时间
      limit: 10,// ttl 内的最大请求数
    }),
  ],
})
export class AppModule {}
// 一旦导入了该模块，可以选择如何绑定 ThrottlerGuard 守卫
// 全局使用如下方法即可

{
  provide: APP_GUARD,
  useClass: ThrottlerGuard
}

// 可以使用 @SkipThrottle() 装饰器跳过路由、类，或取消对被跳过的类中某个路由的跳过的速率限制。
// 传入一个布尔值
@SkipThrottle()
@Controller('users')
export class UsersController {
  @SkipThrottle(false)
  dontSkip() {
    return "List users work with Rate limiting.";
  }
}

// @Throttle(limit,ttl) 装饰器，它可以用于覆盖全局模块中设置的 limit 和 ttl，以提供更严格或更宽松的安全选项。
// 可以用在类或函数上。
```

## 5.15 OpenAPI 
OpenAPI 规范是一种语言无关的定义格式，用于描述 RESTful API。Nest 提供了一个专门的模块，通过利用装饰器来生成这样的规范。也就是配置接口文档 swagger。
```JavaScript
// 安装所需的依赖：
$ npm install --save @nestjs/swagger swagger-ui-express
// 安装完成后在main.ts 文件并使用 SwaggerModule 类初始化 Swagger

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';// 配置swagger
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 配置swagger
  const config = new DocumentBuilder()
    .setTitle('nest学习记录')
    .setDescription('nest学习记录接口文档汇总')
    .setVersion('1.0')
    .addBearerAuth() // 接口增加token认证
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 设置访问接口地址--> http://localhost:3000/api-docs#/ 查看swagger文档
  SwaggerModule.setup('api-docs', app, document, { jsonDocumentUrl: 'api-docs.json' });
  // http://localhost:3000/api-docs.json 地址是json格式，可以导入apifox等软件中自动同步接口文档 

  await app.listen(3000);
}
bootstrap();

// 在控制器(路由api)文件中定义文档
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('用户') // swagger文档标题
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '获取所有用户' })
  @Get()
  // @UseGuards(LoginAuthGuard)// 自定义token验证守卫
  @UseGuards(AuthGuard('jwt')) // passport-jwt策略token验证
  @UseInterceptors(TestInterceptor) // 方法作用域拦截器
  findAll(@Req() req) {
    console.log('req', req.user);
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '根据id获取指定用户' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: '根据id更新用户' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '根据id删除指定用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @ApiOperation({ summary: '用户登陆' })
  @UseGuards(AuthGuard('local')) // 增加登录导航校验
  @Post('login')
  login(@Body() user: LoginDto, @Req() req) {
    return this.userService.login(req);
  }

  @ApiOperation({ summary: '是否已登录测试' })
  @UseGuards(AuthGuard('local'))
  @Post('test')
  test() {
    return 1;
  }
}

// @ApiTags(...) 用于为控制器或特定路由方法添加标签，这些标签在 Swagger UI 中作为分类显示。
@ApiTags("users")
@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    // 方法实现
  }
}
// @ApiOperation({ summary: '...' }) 用于提供单个路由操作的简短描述。它通常用于详细说明一个具体的 API 功能。
@Get()
@ApiOperation({ summary: '查找所有用户' })
findAll() {
  // 方法实现
}

// @ApiResponse({ status: ..., description: ..., type: ... })
// 定义方法的响应类型及状态码。type 选项用于指定返回数据的类型，这对生成精确的响应模型极为重要。
@Get()
@ApiResponse({
  status: 200,
  description: 'Success',
  type: User
})
findAll() {
  // 方法实现
}

// @ApiParam({ name: ..., description: ..., required: ..., type: ... })
// 用于描述路径参数的细节，例如在 URL 中的 {id}。
@Get(':id')
@ApiParam({ name: 'id', description: 'User ID', required: true, type: Number })
findOne(@Param('id') id: string) {
  // 方法实现
}

// @ApiBody({ description: ..., type: ..., required: ... })
// 用于定义 API 请求体的细节。它非常有用，特别是对于 POST 和 PUT 请求。
@Post()
@ApiBody({ description: 'User payload', type: CreateUserDto, required: true })
create(@Body() createUserDto: CreateUserDto) {
  // 方法实现
}

// @ApiQuery({ name: ..., description: ..., required: ..., type: ... })
// 用于描述查询参数，例如在 GET 请求中通过 URL 传递的参数。
@Get()
@ApiQuery({ name: 'role', description: 'Filter by role', required: false, type: String })
findByRole(@Query('role') role: string) {
  // 方法实现
}

// @ApiProperty(...) 用于 DTO 类中的属性，以提供关于字段的具体信息，如类型、描述、是否必需等。
export class CreateUserDto {
  @ApiProperty({ description: "用户名", example: "Moment" })
  name: string;

  @ApiProperty({ description: "用户邮箱", example: "moment@qq.com" })
  email: string;
}
这些装饰器共同工作，能够为你的 NestJS 应用生成丰富、结构化且易于导航的 API 文档。这不仅有助于开发者理解和使用 API，而且通过这种自动化的文档方式，可以大大减少手动编写和维护 API 文档的工作。

```

# 六、WebSockets

# 七、微服务
当一个应用越来越大以后会难以维护和扩展，这时可以通过微服务的方式把业务逻辑拆分到不同的微服务里。

Nest是原生地支持微服务的开发架构、在Nest中，微服务本质上是一个使用与HTTP不同的传输层的应用程序。微服务之间默认通过 tcp 方式通信，在 nest 里需要用到 @nestjs/microservices 这个包。

## 7.1 快速上手
本质上还是使用 `$ nest new microservice-app` 命令创建项目,
但是需要安装 `$ pnpm i --save @nestjs/microservices ` 这个包。
同时入口文件 main.ts 要使用NestFactory类的createMicroservice()方法，同时指定 tcp 的端口。而不再是create()方法。

```js

import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP, // 指定传输器
      // TCP 传输器的配置
      options: {
        // host: '127.0.0.1', // 连接主机名
        port: 8888, // 传输器的行为的配置对象
        // retryAttempts: 5,// 重试消息的次数(默认:0)
        // retryDelay: 3000, // 重试消息的间隔时间(默认:0)'
      },
    },
  );
  await app.listen();
}
bootstrap();


```

## 7.2 客户端
Nest应用程序的客户端可以使用ClientProxy类与Nest微服务交换消息或发布事件。
就比如在一个http server里要引入连接微服务的客户端、它也需要安装微服务相关的包。
`$ pnpm install @nestjs/microservices --save`

```js
// 然后再app模块中引入 ClientsModule 动态模块


```



## 7.3 模式
微服务是通过模式来识别消息和事件、简单说就是识别消息和事件。




# 八、Docker

## 8.1 快速上手
Docker 是一个开源的应用容器引擎，基于 Go 语言和 C 语言开发。这里我们是通过Windows的桌面版本使用、docker desktop 可以可视化的管理它们，很方便。快速上手。Docker 提供了 Docker Hub 镜像仓库，可以把本地镜像 push 到仓库或者从仓库 pull 镜像到本地。
images 是本地的所有镜像，containers 是镜像跑起来的容器。 volume 挂载将本地挂载的目录映射到容器中。
```js
// 拉取镜像
docker pull nginx:latest
// 运行镜像
docker run --name nginx-test2 -p 80:80 -v /tmp/aaa:/usr/share/nginx/html -e KEY1=VALUE1 -d nginx:latest 
-p 是端口映射
-v 是指定数据卷挂载目录
-e 是指定环境变量
-d 是后台运行

// 执行run命令后会返回一个hash值它是容器的id。
// 通过用 docker ps 来获取容器列表的，默认是运行中的。
docker ps
docker ps -a 显示全部的

// image 镜像列表也可以通过 docker images 命令获取
docker images

// 其它常见命令
docker start：启动一个已经停止的容器
docker rm：删除一个容器
docker stop：停止一个容器


```

## 8.2 dockerfile 
在 dockerfile 里声明要做哪些事情，docker build 的时候就会根据这个 dockerfile 来自动化构建出一个镜像来。

```js
# 创建一个基于node的镜像
FROM node:latest

# 使用 18 版本的 node 镜像，它底层使用 alpine 3.14 的基础镜像。
FROM node:18-alpine3.14 

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install -g http-server
# 指定容器需要暴露的端口
EXPOSE 8080
# 指定容器跑起来时执行的命令
CMD ["http-server", "-p", "8080"]


// FROM：基于一个基础镜像来修改
// WORKDIR：指定当前工作目录
// COPY：把容器外的内容复制到容器内
// EXPOSE：声明当前容器要访问的网络端口，比如这里起服务会用到 8080
// RUN：在容器内执行命令
// CMD：容器启动的时候执行的命令

// 根据 dockerfile 来生成镜像
docker build -t custom-image:self-image .
-t 是指定名字和标签、custom-image 是镜像名，self-image 是镜像的标签

// docker 容器内跑的是 linux 系统，各种镜像的 dockerfile 都会继承 linux 镜像作为基础镜像。
// 但其实这个 linux 镜像可以换成更小的版本，也就是 alpine。
// docker 是分层存储的，dockerfile 里的每一行指令是一层，会做缓存。
// 每次 docker build 的时候，只会从变化的层开始重新构建，没变的层会直接复用。

```


# 九、实战

实现一个简单的博客 Blog 功能，包括以下功能
[基础的 Article Tag Use 的 CRUD ]
[ 统一 config 管理]
[日志搜集 ]
[ 异常处理]
[请求参数验证 Dto ]
[JWT ]
[统一返回体 ]
[上传文件包括上传到本地和上传的 OSS 服务商 ]
[请求转发 ]
[job]
[用 redis 做单点登录 ]
[微服务]
[如果部署和运维（优雅重启） ]

路由设计：
Article 相关
-get /artcels 获取所有文章
-get /artcels:id 获取指定 id 的文章
-post /artcels 创建文章
-put /artcels:id 修改文章
-delete /artcels:id 删除文章

Tag 相关
-get /tags 获取所有 标签
-post /tag 创建标签
-put /tag:id 修改标签
-delete /tag:id 删除标签

User 相关
-get /users 获取所有用户
-get /user:id 获取指定 id 用户的用户信息
-post /user 创建用户（注册）
-put /user:id 修改用户 信息
-delete /user:id 删除用户

# 十、总结
Nest作为一个Web应用程序使用至此可以说是学习结束。至于 WebSockets、微服务、或者独立应用程序的开发，可以等待下一次学习。