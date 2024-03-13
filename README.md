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
2023.8.23-购买掘金-神说要有光的-Nest 通关秘籍小册，主要学习实战部分知识点。
Nest 基础：Nest 各种功能的使用，包括 IOC、AOP、全局模块、动态模块、自定义 provider、middleware、pipe、interceptor、guard 等功能，还有 Nest CLI 的使用，Nest 项目的调试。
扩展高级：mysql、mongodb、redis、rabbitmq、nacos 等后端中间件学一遍，也会学习 pm2、docker、docker compose 等部署方案。
目标是学习之后自己能前后端一起做一个项目上线即可。

# 二、NestJS 概述

## 2.1 Nest 介绍及安装

Nest (NestJS) 是一个用于构建高效、可扩展的 Node.js  服务器端应用程序的开发框架。它利用 JavaScript 的渐进增强的能力，使用并完全支持  TypeScript （仍然允许开发者使用纯 JavaScript 进行开发），并结合了 OOP （面向对象编程）、FP （函数式编程）和 FRP （函数响应式编程）。
在底层，Nest 构建在强大的 HTTP 服务器框架上，例如  Express （默认），并且还可以通过配置从而使用 Fastify。它是一个功能比较全面的 Nodejs 后端框架。其实和 Express 用法类似、不过是在这些框架之上再进行了一层抽象，使用了控制反转依赖注入使用上更加方便，功能也更加强大而已、也是直接使用它向开发者暴露的API即可。本质上还是监听 HTTP 请求，然后处理并返回结果给前端。

Nest它就是提供了一个开箱即用的应用程序架构，允许开发者和团队创建高度可测试、可扩展、松耦合且易于维护的应用程序。

学习 NestJS 直接使用官方脚手架 Nest CLI 即可、脚手架就是一个命令行界面工具，可以帮助您初始化、开发和维护您的Nest应用程序。
安装脚手架:
`$ npm install -g @nestjs/cli` // 全局安装 Nest 脚手架
`$ npm update -g @nestjs/cli `// 全家升级脚手架版本

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
    nest info 打印 node、npm、nest 包的依赖版本
```

脚手架创建项目：
nest new project-name // 创建项目
项目运行
npm run start:dev 其它启动命令查看包管理文件即可。
此命令将使用 HTTP 服务器启动应用程序，以侦听 src/main.ts 文件中所定义的端口。

使用脚手架生成的 nest 项目时会生成一个样板应用程序结构(称为标准模式)、以鼓励开发人员将每个模块保存在其对应的专用目录中(也就是更加作用自定义模块文件名)。在我们之前学习原生node、express、koa时都是自己抽离划分的模块、而一个基本的 nest 模块也是按照 mvc 模式拆分的分成三个组成：模块 module、控制器 controller(NestJS 的路由 由 控制器负责)、服务 service, 同时它们都有专门的脚手架命令用来快速生成。
初始目录结构如下
```
项目名(文件名)
+-- dist[目录]                      // 编译后的目录，用于预览项目
+-- node_modules[目录]              // 项目使用的包目录，开发使用和上线使用的都在里边
+-- src[目录]                       // 源文件/代码，程序员主要编写的目录
|  +-- app.controller.spec.ts      // 对于基本控制器的单元测试样例
|  +-- app.controller.ts           // 控制器文件，可以简单理解为路由文件
|  +-- app.module.ts               // 模块文件，在NestJS世界里主要操作的就是模块
|  +-- app.service.ts              // 服务文件，提供的服务文件，业务逻辑编写在这里
|  +-- app.main.ts                 // 项目的入口文件，里边包括项目的主模块和监听端口号
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

安装 @nestjs/cli，也就是 nestjs 脚手架后，脚手架提供了很多命令。除了之前用来创建项目的命令还有可以生成一些别的模块代码的命令，比如 controller、service、module 等这些非常常用的。记不住也问题不大查就完事儿了。

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
 - new 命令有一个别名 n、大多数命令和一些选项都有别名。
 - my-nest-project 是 _requiredArg_。如果在命令行上没有提供 _requiredArg_，nest 将提示您提供它。另外，
 - --dry-run 有一个等效的简写形式 -d。

比较常用的生成(创建)命令 generate 如下
声明如下：可以通过 命令查看具体语法。
//创建一个 nest 元素语法，
`$ nest generate <schematic> <name> [options]`
`$ nest g <schematic> <name> [options]`
`$ nest g 文件类型 生成的组件的名称 可选项`

**常见的文件类型有**
| 名称        | 别名         | 描述     |
| :---        |    :----:   |          ---: |
| module      | mo          | 生成一个模块声明会自动在 AppModule 里引入   |
| controller  | co          | 生成一个控制器声明      |
| service     | s           | 生成一个服务声明      |
| middleware  | mi          | 生成一个中间件声明      |
| interface   | itf         | 生成一个接口      |
| interceptor | itc         | 生成一个拦截器声明      |
| guard       | gu          | 生成一个守卫声明      |
| gateway     | ga          | 生成一个网关声明      |
| filter      | f           | 生成一个过滤器声明      |
| pipe        | pi          | 生成一个管道声明      |
| class       | cl          | 生成一个新的类      |
| resource    | res         | 快速生成一个CRUD模块      |

可选参数一般就一个、即不生成测试测试文件(默认是强制生成的)
1. --spec 默认生成
2. --no-spec 禁用生成规范文件

**示例** 
```
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

注意创建顺序： 先创建 Module, 再创建 Controller 和 Service, 这样创建出来的文件控制器和服务会在 Module 中自动注册。反之，后创建 Module, Controller 和 Service,会被注册到最外层的根模块文件 app.module.ts 上。

还有一个快速创建 Contoller、Service、Module 以及 DTO 文件的方式:
比如创建一个用户 user 模块
nest generate resource user 
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

# 三、NestJS 核心基础知识

## 3.1 控制器 controller

### 1. 概述
和原生node、express、koa 里我们抽离的路由类似，nest 的控制器作用一样的: 就是处理客户端传入的请求和向客户端返回响应、nest控制器其实也是路由。

只不过在 NestJS 里是使用类和装饰器，而控制器就是使用 @Controller 装饰器装饰的一个类。装饰器的作用是将类与所需的元数据关联起来，并使Nest能够创建路由映射(将请求与相应的控制器关联起来)。

在脚手架一节我们知道要使用CLI创建控制器，只需执行`$ nest g controller [name] `命令即可。

和express里定义了路由要在入口文件引入才能起作用一样，在定义了控制器之后Nest仍然是不知道控制器存在的，因此不会创建此类的实例。在Nest里控制器总是属于某一个模块类，所以要把它导入到 @Module() 装饰器对应的 controllers 选项中,这样 Nest 就可以轻松反射（reflect）出哪些控制器（controller）必须被安装挂载,也就可以直接使用它,控制器本身只做路由的控制跳转这样有利于业务的抽离。

### 2. 使用
简单理解就是之前在express、koa里的路由相关的东西都使用了装饰器代替。
这些装饰器它们的作用和 express 里的 req、res 对象类似、不过是 nest 帮忙封装成了装饰器，可以直接使用罢了。
常见的如下：它们都是从'@nestjs/common' 模块导出的。
`import { Controller, Get, Post, Put, Patch, Delete, HttpCode, Headers, Redirect, Request, Response, Body, Param, Query,} from '@nestjs/common';`

1. @Controller() 装饰器，是一个类装饰器，用来装饰一个控制器类。
可以传入一个字符串值，作为路由路径前缀。
也可以传入一个对象，常用有三个配置属性
```
@Controller('路由前缀')
@Controller({
   path:'路径',
   host:'HTTP主机域名',
   version:'接口版本'
})
export class CatsController {}

```

2. 方法装饰器，nest 提供了所有标准 HTTP 方法对应的请求方法装饰器，用来装饰具体的请求方法(类里定义的方法)。同样的这些装饰器也可以传入一个路径参数，它会拼接在 @Controller() 装饰器参数后面。而express、koa里直接使用路由方法。
注意: 这个路径参数可以是字符串、或者模式匹配的路由。

```
// express、koa
app.get('/cat',callback)
router.post('/cat',callback)
//nestjs
@Get()
@Post()
@Put()
@Patch()
@Delete()
@All()
callback(){
  //.....
}

@HttpCode() 用来指定返回的 http 状态码
@Header() 指定自定义的响应头
@Headers() 装饰器获取请求头信息
@Redirect(url,statusCode) 将响应重定向到特定的URL、接受两个参数url和statusCode，两者都是可选的。如果省略statusCode，其默认值为302（Found）。

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

路由参数

```

3. 属性装饰器，用来装饰方法里的形式参数。
其中@Request(), @Req() 装饰器都会获取到请求 request 对象，跟 express 里的 req 对象一样
其中@Response(), @Res() 装饰器都会获取到请求 response 对象，跟 express 里的 req 对象一样

```
获取 get 请求参数和动态路由参数和 express 里一样都是在请求对象里。
req.query 和 req.params

获取 post 等请求的请求体和 express 里也是一样的都是在请求对象里。
req.body

不过 nest 都提供了对应的装饰器，方便操作。
req.query === @Query() 直接获取 query 查询对象
req.params === @Param()直接获取 params 查询对象、将特定的参数标记传递给装饰器，然后在方法体中直接按名称引用路由参数。
req.body === @Body()直接获取请求体 body 对象

@Get('getQueryAndParam/:id?')
getQuery(
 @Param('id') id: number,
 @Query() query: { value: number; name: string },
) {

}

@Post('postQuery/:id?')
postQuery(
 @Param('id') id: number,
 @Body() body: { value: number; name: string },
){

}
```

使用脚手架创建一个 cats 控制器
```javaScript
// cats.controller.ts 
// 定义一个控制器、必须使用@Controller()装饰器装饰。
import { Controller, Get } from '@nestjs/common';
// 使用 @Controller 装饰器装饰的类就是一个控制器、它可以接收一个可选的字符串参数作为路由路径前缀。
// 方便地将一组相关的路由分组，并减少重复的代码。
@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
// 必须在某个模块类的 @Module() 装饰器中的controllers 数组里注册，没有其它模块则注册到根 AppModule 模块类中。
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  // 注册
  controllers: [CatsController],
})
export class AppModule {}

```



## 3.2 提供者 provider

### 1. 概述
提供者是Nest中的一个基本概念。各种功能和业务代码具体实现的地方都可以看作是提供者 provider，比如接下来的各种拦截器、各种过滤器、各种配置模块、各种中间件、管道等全都是 Providers，即提供各种问题具体解决方法的人。比如控制器应该只处理HTTP请求、而将更复杂的任务(如: 数据库的查询、数据的处理等)委托给提供者。

在 NestJS 里就是被 @Injectable 装饰器装饰的JavaScript类就是 Providers ，提供者的主要思想是它可以通过类的构造器方法即 constructor 方法注入依赖，这意味着对象之间可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给  Nest 运行时系统。本质上就是使用了 @Injectable 装饰器装饰的类就可以被 Nest IoC 容器(反转控制容器)管理。

在 NestJS 中提供者最常见是作为 service 服务，所以文件命名一般是 xxx.service.js/ts、也可以是过滤器 xxx.filter.js/ts、也可以是拦截器 xxx.interceptor.js/ts。
等等反正就是一个用  @Injectable  装饰器装饰的类。

### 2. 使用
使用 CLI 创建一个服务提供者是很简单的、只需执行`$ nest g s [name] --no-spec`命令即可。跟之前express、koa里抽离的服务一样、要使用就必须引入。
在定义了一个服务之后就可以通过**依赖注入**的方法在一个控制器类的内部使用它了、具体实现方法是通过类构造函数 constructor 注入依赖项的。然后还要将服务添加某个模块类的   @Module() 装饰器的 providers 数组里进行注册(没有就是根模块)、注册后Nest就能够解析 CatsController 类的依赖关系进而实例化需要的服务类。
```javaScript
import { Injectable } from '@nestjs/common';
// 必须使用 @Injectable 装饰器装饰。
@Injectable()
export class CatsService {}

import { CatsService } from './cats.service';
@Controller('cats')
export class CatsController {
  // 通过类构造函数注入服务提供者、之后就可以在方法里使用了。
  // 之后 Nest 的 IoC 容器就会查找之前注册的提供者实例化，将其缓存并返回。如果已经缓存，则直接返回现有实例。这样就可以直接使用了。
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

### 3. 自定义提供者

## 3.3 模块 module

### 1. 概述
模块是 nest 的精髓所在，是控制反转 IoC 容器实现所在。Module 是 NestJS 中一个大的一个内容，它是整个 module 功能模块的收口，功能和特性和 Angular 保持一致。

在 Nest 中模块就是一个 @Module 装饰器装饰的类。 @Module 装饰器提供了元数据，Nest 用它来组织应用程序的结构。一般来说各个模块最终会在根模块 AppModule汇总、然后在入口文件main.ts里引入执行。

根模块: 每个应用程序至少有一个模块、是Nest用于构建应用程序图的起点、是Nest用于解析模块和提供者之间关系和依赖关系的内部数据结构。

```
@Module() 装饰器接受一个单一的对象作为参数，其属性描述了模块。
如果你需要把这个模块暴露到全局使用可以加 一个装饰器 @Global、全局模块应该仅注册一次，通常由根模块或核心模块完成。
@Global()
@Module({
  controllers:[], // 这里注册了的控制器也会被自动实例化
  imports:[], // 可以导入 其他 module 或者 provider
  exports:[], // 如果你这个模块中的 provider 要在别的模块中使用你必须要在这里声明导出 provider ，当然你也可以把这个 module 导出其他地方 import 一下这样其他模块中的 provider 也是可以使用的。
  providers:[] // 在这里注册了的提供者会被 Nest 注入器自动实例化，并且可以至少在整个模块中共享。
})
```

### 2. 使用
使用 CLI 创建一个模块也是很简单的、只需执行`$ nest g mo [name] --no-spec`命令即可。然后把该模块相关的所有内容都移动到了cats 目录中成一个特性模块。这样只需要在根模块里 imports 数组里注册这个特性模块即可。

```javaScript
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

### 3. 动态模块

## 3.4 中间件 Middleware

### 1. 概述
中间件是 NestJS 中实现 AOP 编程的五种方式之一。和express和koa一样、Nest中也有中间件功能类似，Nest中间件默认情况下与express中间件等效。它是一个在路由处理程序之前调用的函数、也就是在请求进入控制器之前或者响应返回给客户端之前执行一些操作的函数。中间件函数可以访问请求和响应对象，以及应用程序的请求-响应周期中的 next() 中间件函数。通常，next中间件函数由一个名为next的变量表示。

中间件函数可以执行以下任务：
1. 执行任何在中间件函数里定义的代码。
2. 对请求和响应对象进行更改。
3. 结束请求-响应周期。
4. 调用堆栈中的下一个中间件函数。如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。


### 2. 使用
在Nest中中间件有两种定义方法:
1. 一种是和express中间件一样就是一个函数没有任何特殊要求-函数式中间件。当中间件不需要任何依赖时使用。
2. 另一种是带有 @Injectable()装饰器的类中实现自定义的Nest中间件。这个类应该实现NestMiddleware 接口-类中间件。

在 Nest 中使用脚手架命令创建一个中间件使用命令 `$ nest g mi middlewareName --no-spec `、如创建一个 logger 中间件 `$ nest g mi common/logger --no-spec`
使用这个命令生成的中间件类自动实现 @nestjs/common 包中的 NestMiddleware接口。
同时可以使用 express 中的类型指定req、res next钩子的类型。

```javaScript
// 类中间件-logger 中间件
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // 这里就可以范围到请求和响应对象
    next();// 释放句柄
  }
}

// 函数式中间件
import { Request, Response, NextFunction } from 'express';
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
};

```

因为在 Nest 中使用类方法实现的中间件也是使用 @Injectable() 装饰器装饰的类(提供者)所以它完全支持依赖注入，所以可以注册到全局模块使用，也可以在指定模块中注入使用，都是通过类构造方法 constructor 实现注入依赖项。

使用方法：在@Module()装饰器中是没有设置中间件的选项的。实际上我们使用的是模块类的 configure() 方法来设置它们。这是因为包含中间件的模块必须实现 NestModule 接口实现了这个接口会自动执行模块类的 configure 方法。

MiddlewareConsumer 是一个辅助类，它提供了几种内置方法来管理中间件。
1. apply() 方法用来应用中间件,多个时逗号分隔即可。
2. forRoutes() 方法可以接受一个字符串、多个字符串、一个 RouteInfo 对象、一个控制器类，甚至是多个控制器类。
3. .exclude 方法用来排除、接受单个字符串、多个字符串或 RouteInfo 对象，用于标识要排除的路由


```javaScript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';
// 连接MySQL数据库
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
// 中间件
import { TestMiddleware } from './common/middlewares/test.middleware';

// 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'wanggeng123456',
      database: 'nest-vue-bms',
      autoLoadEntities: true, //自动注册实体，设置为 true 的时候,NestJS 会自动加载数据库实体文件xx.entity.ts文件来创建数据表(如果没有的话)
      synchronize: false, // 是否自动同步实体文件,生产环境建议关闭 - 不同步
    }),
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
      .forRoutes('*'); // 指定应用的路由或者控制器
      .forRoutes(CatsController); // 指定控制器
      .exclude(
        { path: 'cats', method: RequestMethod.GET },// RouteInfo 对象
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',
      )
  }
}

// 全局注册中间件就是使用 app 的 use 方法注册、对每个已注册的路由生效。
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);

```

### 3. 日志收集和记录中间件

使用 Nestjs 中的两个技术点 中间件 +拦截器 ，以及 Nodejs 中流行的 log 处理器 log4js 来实现。最后的实现出来的效果是：错误日志和请求日志都会被写入到本地日志文件和控制台中。后续还会写一个定时任务的把日志清理以及转存。

## 3.5 过滤器 ExceptionFilter

### 1. 概述

过滤器也是 NestJS 中实现 AOP 编程的五种方式之一，Nest 中过滤器一般是指: 异常处理过滤器,他们开箱即用返回一些指定的 JSON 信息。在 NestJS 中有一个内置异常处理层、当一个异常没有被应用程序代码处理时(显性声明处理)，它就会被这个异常处理层捕获，然后自动发送一个适当的用户友好响应。

默认情况下，这个操作是由内置的全局异常过滤器执行的，它处理类型为HttpException（以及其子类）的异常。当一个异常是未识别的（既不是HttpException，也不是继承自HttpException的类），内置的异常过滤器会生成以下默认的JSON响应:
```
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
这时就创建一个异常过滤器，负责捕获 HttpException 类的实例，并为其实现自定义响应逻辑。使用 CLI 脚手架命令快速生成一个过滤器 `$ nest g f http-exception --no-spec`、 `$ nest g f common/http-exception --no-spec`。

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

## 3.6 管道 Pipe

### 1. 概述

它也是 NestJS 中实现 AOP 编程的五种方式之一，在 NestJS 中,管道本质也是一个带有@Injectable()装饰器的类(提供者)，PipeTransform<T, R> 是每个管道必须要实现的泛型接口。泛型 T 表明输入的 value 的类型，R 表明 transfrom() 方法的返回类型。Pipe 一般用来做参数转换的。简单理解就如同水管一样。从一边流进去从另一边流出来，然后你可以在这中间也就是管道中对流动的东西进行一些处理。管道有两个典型的用例:
1. 转换: 将用户输入数据转换为所需的形式后再输出(例如，从字符串到整数)。
2. 验证: 对用户输入数据进行评估，如果有效，则不加修改地将其传递;否则，当数据不正确时抛出异常。
  
在这两种情况下，管道参数(arguments) 会由控制器的路由处理程序进行操作。

### 2. 内置管道
Nest 自带 9 个开箱即用的管道类、它们都是从 @nestjs/common 包导出。

1. ValidationPipe: 用于验证请求数据，通常用于验证请求体数据、查询参数、路由参数等。它使用了类似于 class-validator 库的装饰器来进行验证。如果验证失败，它会抛出 ValidationException 异常。

2. ParseIntPipe: 用于将输入数据解析为整数。它可以将字符串形式的整数转换为 JavaScript 整数。如果无法解析为整数，它会抛出 BadRequestException 异常。

3. ParseFloatPipe: 用于将输入数据解析为浮点数。

4. ParseBoolPipe: 用于将输入数据解析为布尔值。它可以将字符串形式的"true"和"false"转换为对应的布尔值。如果无法解析为布尔值，它会抛出 BadRequestException 异常。

5. ParseArrayPipe: 用于将输入数据解析为数组。它可以将字符串形式的 UUID 转换为 UUID 对象。如果无法解析为数组，它会抛出 BadRequestException 异常。

6. ParseUUIDPipe: 用于将输入数据解析为 UUID（Universally Unique Identifier）。它可以将字符串形式的 UUID 转换为 UUID 对象。如果无法解析为 UUID，它会抛出 BadRequestException 异常。

7. ParseEnumPipe: 枚举类型

8. ParseFilePipe: 文件类型

9. DefaultValuePipe: 用于为缺少的参数提供默认值。如果某个参数未传递，它会使用提供的默认值替代。new DefaultValuePipe(false/1)、常和转换类管道一起使用提供默认值。

### 3. 使用
和中间件、过滤器等一样，管道可以是
1. 参数范围(parameter-scoped)的、直接使用。
2. 方法范围(method-scoped)的、使用 @UsePipes 装饰器装饰
3. 控制器范围的(controller-scoped)、使用 @UsePipes 装饰器装饰
4. 全局范围(global-scoped)的、app 实例的 useGlobalPipes 方法注册全局

```JavaScript
// 方法作用域：
@Post()
@UsePipes(new JoiValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
// 所有转换管道即Parse*管道可以直接在方法参数上绑定、这些管道都在验证路由参数、查询字符串参数和请求体值的上下文中工作。
@Get(':id')
async findOne(@Param('id',new DefaultValuePipe(0) ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
// 全局：依然是在入口文件中使用 useGlobalPipes 装饰器。
app.useGlobalPipes(new ValidationPipe());
```

### 4. 自定义管道
使用 CLI 脚手架创建一个管道使用命令即可 `$ nest g pi <name>`、`$ nest g pi common/validation-pipe`。

为实现 PipeTransfrom接口，每个管道必须声明 transfrom() 方法。该方法有两个参数：
1. value 当前处理的方法参数(在被路由处理程序方法接收之前)
2. metadata 当前处理的方法参数的元数据。
元数据对象具有以下属性:
```javaScript

export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  // 参数是一个 body @Body(), query @Query(), param @Param(), 还是自定义参数
  metatype?: Type<unknown>;
  // 参数的元类型
  data?: string;
  // 传递给装饰器的字符串
}

```   
一般会使用基于对象结构的验证来对数据进行校验、这里常使用 Joi 库、它允许使用可读的 API 以直接的方式创建 schema，让我们构建一个基于 Joi schema 的验证管道。

安装依赖: `$ npm install --save joi`

```JavaScript
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
// 结构不一致时报错
{
    "message": "Validation failed",
    "error": "Bad Request",
    "statusCode": 400
}


```

还有一种比较常用的验证管道类型是:**类验证器**、Nest 与 class-validator 配合得很好。这个优秀的库允许您使用基于装饰器的验证。安装完成后，我们就可以向 Dto 类添加一些装饰器来校验。

安装依赖: `$ npm i --save class-validator class-transformer`

```JavaScript
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
    // plainToInstance 方法将普通的 JavaScript 参数对象转换为可验证的类型对象
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
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

@Post()
@UsePipes(new ValidationPipePipe())
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
// 结构不一致时报错
{
    "message": "Validation failed",
    "error": "Bad Request",
    "statusCode": 400
}
```

## 3.7 导航守卫 Guard

### 1. 概述
导航也是 NestJS 中实现 AOP 编程的五种方式之一，顾名思义 Guard 可以根据某些自定义的条件在调用某个 Controller 之前返回 true 或 false 决定放不放行、也就是进不进入这个路由。本质上 Nest 守卫也是一个带有 @Injectable()装饰器装饰的类，同时守卫要实现CanActivate 接口。

导航守卫就一个职责：它们根据运行时出现的某些条件（例如权限，角色，ACL(访问控制列表)等）来确定给定的请求是否由路由处理程序处理。也就是决定给定的请求是否进入路由进而由路由处理程序处理，也就是前端请求这个接口路径时处不处理。而这通常被称为授权，也就是看它有无授权进而查看它是否能访问某些路由。

每个守卫类都必须实现一个 canActivate()方法。这个方法函数应该返回一个布尔值，指示当前请求是否被允许。如果返回 true，请求将被处理，如果返回 false, Nest 将拒绝请求。守卫会在所有中间件之后执行，但在拦截器或管道之前执行、由守卫引发的任何异常都将由异常层(全局异常过滤器和应用于当前上下文的任何异常过滤器)处理。作用类似express、koa里的鉴权中间件。

canActivate() 函数接受一个参数，即 ExecutionContext 实例。ExecutionContext 继承自 ArgumentsHost。通过它我们可以获取对 Request 对象的引用、一般情况下我们是通过获取当前路由的元数据以及判断 token 是否过期来决定是否放行。

### 2. 使用
使用 CLI 脚手架创建一个守卫使用命令如下命令即可 `nest g gu AuthGuard --no-spec --flat`、这里我们创建一个验证守卫。

这里我们可以通过 @SetMetadata 装饰器自定义元数据来向路由处理程序附加自定义元数据的能力。但直接在路由中使用@SetMetadata()不是一个良好的实践。相反，创建您自己的装饰器。为了访问路由的角色（自定义元数据），我们将使用Reflector辅助类，它由框架提供并从@nestjs/core包中公开。

```javaScript
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
  // 注入依赖
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

和管道、过滤器使用方法类似，Guard 用法也有三种,分为全局路由守卫、控制器路由守卫、具体方法路由守卫
1. @UseGuards注册应用到方法路由守卫、控制器守卫。
2. app 对象的 useGlobalGuards 方法注册全局守卫

```JavaScript
// 全局导航守卫
app.useGlobalGuards(new TestGuard());

// 这样就只在/aa路由中生效了
@UseGuards(TestGuard)
@Get('aa')
aa(): string {
 return 'aa';
}

// 这样就是整个控制器生效
@UseGuards(RolesGuard)
export class CatsController {}

```

## 3.8 拦截器 interceptor

### 1. 概述

拦截器也是 NestJS 中实现 AOP 编程的五种方式之一，它和中间件是很类似的。
在 NestJS 中可以处理请求处理过程中的请求和响应,例如身份验证、日志记录、数据转换等。
它本质也是一个@Injectable()装饰器装饰的类，这个类实现了 NestInterceptor 接口，同时每个拦截器也实现了 intercept 方法。
该方法接收两个参数：
第一个是 ExecutionContext 实例 context(与警卫完全相同的对象)。ExecutionContext 继承自 ArgumentsHost。
在拦截器中 context.getClass()可以获取当前路由的类,
context.getHandler()可以获取到路由将要执行的方法

第二个参数是一个 CallHandler 。CallHandler 接口实现了 handle()方法。使用该方法在拦截器中的某个位置调用路由处理程序方法

```
脚手架命令快速生成一个拦截器
nest g itc test --no-spec --flat
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}

```

### 2. 使用

拦截器的绑定：为了设置拦截器，需要使用从@nestjs/common 包中导入的@UseInterceptors()装饰器。与管道和守卫一样，拦截器可以是控制器作用域、方法作用域或全局作用域。

```
1.控制器作用域：也就是只针对某个指定的控制器进行拦截，这样所有进入这个控制器的路由都会先进入这个拦截器中。
@UseInterceptors(LoggingInterceptor)
export class CatsController {}

2.方法作用域：就是只针对某个指定的方法进行拦截。
export class CatsController {
  @ApiOperation({ summary: '获取所有用户' })
  @Get()
  @UseInterceptors(TestInterceptor) // 方法作用域拦截器
  findAll() {
    return this.userService.findAll();
  }
}

3.全局作用域：就是针对全局的它是在main.ts中使用 useGlobalInterceptors 方法全局注册

 app.useGlobalInterceptors(new TransformInterceptor());

```









## 十一、安全相关

### 11.1 概述

http 是无状态的协议，也就是说上一次请求和下一次请求之间没有任何关联。
而基本所有网站都有登录功能，登录之后再次请求依然是登录状态。
那么如何实现登录状态的保持呢？

```
有两种解决方案：
1.服务端保存 session + cookie 的方案。
第一次登录时后端返回凭证信息，前端存储在cookie中，之后每次http请求都会自动携带上cookie中保存的凭证信息，算是给请求打上了唯一标识。后端根据前端传过来的标识去查找与之对应的数据 session即可。
缺点：有CSRF(跨站请求伪造)风险，因为 cookie 会在请求时自动带上，那你在一个网站登录了，再访问别的网站，万一里面有个按钮会请求之前那个网站的，那 cookie 依然能带上。而这时候就不用再登录了。

为了解决这个问题，我们一般会验证 referer，就是请求是哪个网站发起的，如果发起请求的网站不对，那就阻止掉。但这样依然不能完全解决问题，万一你用的浏览器也是有问题的，能伪造 referer 呢？

所以一般会用随机值来解决，每次随机生成一个值返回，后面再发起的请求需要包含这个值才行，否则就认为是非法的。

这个随机值叫做 token，可以放在参数中，也可以放在 请求头 header 中，因为钓鱼网站拿不到这个随机值，就算带了 cookie 也没发通过服务端的验证。

还有一个问题当并发量比较高时会使用分布式部署，这时不同服务器之间的 session就会不同。
这个问题的解决有两种方案：

一种是 session 复制，也就是通过一种机制在各台机器自动复制 session，并且每次修改都同步下。这个有对应的框架来做，比如 java 的 spring-session。
各台服务器都做了 session 复制了，那你访问任何一台都能找到对应的 session。

还有一种方案是把 session 保存在 redis，这样每台服务器都去那里查，只要一台服务器登录了，其他的服务器也就能查到 session，这样就不需要复制了。
分布式会话的场景，redis + session 的方案更常用一点。
还好，session 在分布式时的这个问题也算是有解决方案的。

2.客户端保存 jwt token 的方案。
session + cookie 的方案是把状态数据保存在服务端，再把 id 保存在 cookie 里来实现的。
既然这样的方案有那么多的问题，那我反其道而行之，不把状态保存在服务端了，直接全部放在请求里，也不放在 cookie 里了，而是放在 请求头 header 里，这样是不是就能解决那一堆问题了呢？
token 的方案常用 json 格式来保存，叫做 json web token，简称 JWT。它保存在 request header 里的一段字符串（比如用 header 名可以叫 authorization）。
它由三部分组成：header、payload、verify signature
header 部分保存当前的加密算法，
payload 部分是具体存储的数据，
verify signature 部分是把 header 和 payload 还有 salt 做一次加密之后生成的。
然后这三部分会分别做Base 64加密后再返回。
然后一般放到请求头header 的authorization:Bearer xxx.xxx.xxx 字段上。
请求的时候把这个 header 带上，服务端就可以解析出对应的 header、payload、verify signature 这三部分，然后根据 header 里的算法也对 header、payload 加上 salt 做一次加密，如果得出的结果和 verify signature 一样，就接受这个 token。

流程是用户登录提交用户名和密码-后端接收并认证-认证通过生成 jwt token并返回给前端-前端本地保存返回的jwt token-之后每次请求都在请求头中携带-后端拦截请求并验证-验证通过执行业务逻辑并返回数据-前端展示数据-如果是验证不通过返回错误信息-前端提示错误信息并返回登录页面。至此整个登录流程结束。

但是这个方案也有安全性问题，因为它是把数据直接 Base64 之后就放在了 header 里，那别人就可以轻易从中拿到状态数据，比如用户名等敏感信息，也能根据这个 JWT 去伪造请求。所以 JWT 要搭配 https 来用，让别人拿不到 header。




```

### 11.2 代码层面解决

在 Nest 里实现 session 还是用的 express 的中间件 express-session。
安装 express-session 和它的 ts 类型定义
npm install express-session @types/express-session

然后在入口模块里启用它

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'guang',// 指定加密的密钥 secret
    resave: false,// 每次访问时是否都会更新 session
    saveUninitialized: false // 是否初始化一个空的 session 对象
  }));
  await app.listen(3000);
}
bootstrap();

```

然后在 controller 里就可以注入 session 对象：
直接使用@Session 装饰器即可。

```
@Get('sss')
sss(@Session() session) {
    console.log(session)
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
}


```

在 Nest 里实现 jwt 需要引入 @nestjs/jwt 这个包
安装：npm install @nestjs/jwt

然后在 AppModule 里引入 JwtModule,那就是全局注册，也可以在指定 module 文件中注册。
JwtModule 是一个动态模块，通过 register 传入 option。
或者是 registerAsync，然后通过 useFactory 异步拿到 option 传入。

```
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'guang',
      signOptions: {
        expiresIn: '7d'
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


```

注册成功后就可以在 controller 里注入 JwtModule 里的 JwtService 了。

```
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor(
    // jwt服务
    private readonly jwtService: JwtService,
  ) {}
  <!-- 或者定义私有属性 -->
  private readonly jwtService: JwtService
}
然后添加一个 handler返回即可：使用 jwtService.sign 来生成一个 jwt token，放到 response header 里。
注意：注入 response 对象之后，默认不会把返回值作为 body 了，需要设置 passthrough 为 true 才可以。
@Get('ttt')
ttt(@Res({ passthrough: true}) response: Response) {
    const newToken = this.jwtService.sign({
      count: 1
    });

    response.setHeader('token', newToken);
    return 'hello';
}



```


## 十二、nest 连接 MySQL 数据库

nest 中使用 ORM 技术（Object-Relational Mapping）,即把关系数据库的表结构映射到对象上。
来操作数据库，这里我们选择 typeORM 这个库来操作数据库。
安装：npm install --save @nestjs/typeorm typeorm mysql2
接下来创建实体类就可以通过代码来建表操作表，进行数据操作，TypeORM 是通过实体映射到数据库表。
所以我们先创建对应的实体类 entity，nest 中使用 entities 文件夹存放。

### 12.1 实体 entity

实体是一个用@Entity()装饰器装饰过的映射到数据库表（或使用 MongoDB 时的集合）的类。
可以通过定义一个新类来创建一个实体。

### 12.1 nest 操作数据库步骤

安装必须的包之后就可以在 nest 中进行配置进而通过代码实现对数据库的增删改查了。

1. 在 nest 项目中注册 typeORM

首先我们在 app.module 中引用 TypeOrmModule，TypeOrmModule 由 @nestjs/typeorm 提供

```
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';
// 连接MySQL数据库
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
// 全局中间件
import { TestMiddleware } from './common/middlewares/test.middleware';

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
      autoLoadEntities: true, //自动注册实体，设置为 true 的时候,NestJS 会自动加载数据库实体文件xx.entity.ts文件来创建数据表(如果没有的话)
      synchronize: false, // 是否自动同步实体文件,生产环境建议关闭 - 不同步
    }),
    PostsModule,
    TagsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// 导出根模块类，它已经经过@Module 装饰器 装饰了。
export class AppModule implements NestModule {
  // 实现中间件注册
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TestMiddleware).forRoutes('*');
  }
}




```

2. 创建实体 Entity

Entity 就是由 @Entity 装饰器装饰的一个类，TypeORM 会为此类模型创建数据库表。
其中 @Entity 装饰器 传入的参数就是实际创建的数据库表名。还有字段名的定义、约束、校验等都是在这里定义的。

```
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

3. 在 module 中注入要使用那些存储库

orm 有两种方式使用具体的数据库表、一种是使用 EntityManager 实体管理器、另一种是使用 Repository
它就像 EntityManager 一样都能实现对数据库表的 curd 操作，但是 Repository 操作仅限于具体实体也就是指定的单个表。所以一般我们使用后者。

```
-- posts.module.ts --
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
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

4. 在 serveice 文件中使用仓库

模块文件中注入之后就可以在服务类中注册使用了,使用 @InjectRepository(实体类名)的形式注册。
之后通过这个变量就可以实现对对应数据库表的 curd。

```
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  constructor(
    @InjectRepository(PostsEntity) // 注入实体类仓库操作数据库
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  /**
   * 测试路由
   * @returns string
   */
  getHello(): string {
    return 'Hello World! test router';
  }
  getQuery(params: number, query: QueryItf): object {
    return { id: params, value: query.value, name: query.name };
  }
  postQuery(params: number, body: QueryItf): object {
    return { id: params, value: body.value, name: body.name };
  }
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

### 12.2 字段校验

不管是前端传递的表单数据、还是声明实体时的实体字段一般都是需要校验的。比如必填、非空、数字等类型。在 nest 中常使用 class-validator+类验证器来实现。
安装：npm install --save class-validator class-transformer

## 十三、配置接口文档 swagger

安装：npm install @nestjs/swagger swagger-ui-express -S

# 四、

# 五、

# 六、实战

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

# 七、总结
