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

# 二、nestjs 概述及基本使用

## 2.1 nestjs 概述

Nest (NestJS) 是一个用于构建高效、可扩展的 Node.js  服务器端应用程序的开发框架。它利用 JavaScript 的渐进增强的能力，使用并完全支持  TypeScript （仍然允许开发者使用纯 JavaScript 进行开发），并结合了 OOP （面向对象编程）、FP （函数式编程）和 FRP （函数响应式编程）。
在底层，Nest 构建在强大的 HTTP 服务器框架上，例如  Express （默认），并且还可以通过配置从而使用  Fastify 。它是一个功能比较全面的 Nodejs 后端框架。其实和 Express 用法类似，不同在用使用了控制反转依赖注入。使用上更加方便。

安装脚手架:
npm install -g @nestjs/cli // 全局安装 Nest 脚手架
npm update -g @nestjs/cli // 全家升级脚手架版本
之后跟 vue 脚手架类似就可以使用：nest 命令。
它可以
生成项目结构和各种代码
编译代码
监听文件变动自动编译
打印项目依赖信息

```
    常用命令：
    nest -v 查看安装的版本。
    nest -h 查看帮助信息即脚手架提供的命令。
    nest new 快速创建项目
    nest generate 快速生成各种代码
    nest build 使用 tsc 或者 webpack 构建代码
    nest start 启动开发服务，支持 watch 和调试
    nest info 打印 node、npm、nest 包的依赖版本
```

脚手架创建项目：
nest new project-name // 创建项目
项目运行
npm run start / nest start 其它启动命令查看包管理文件即可。
此命令将使用 HTTP 服务器启动应用程序，以侦听 src/main.ts 文件中所定义的端口。

nest 项目初始目录结构如下：

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

main.ts 就是项目的入口文件，一些全局的配置会在这里注入加载。

AppModule 是应用程序的根模块，它提供了用来启动应用的引导机制，可以包含很多功能模块。
.module 文件需要导出一个使用@Module() 装饰器装饰过的类，
@Module() 装饰器接收一个对象，它有四个属性：
providers、Nest.js 注入器实例化的提供者（服务提供者），处理具体的业务逻辑，各个模块之间可以共享
controllers、处理 http 请求，包括路由控制，向客户端返回响应，将具体业务逻辑委托给 providers 处理。
imports、导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入。也就是其它 .module 文件，创建时 nest 会自动导入。
exports、导出服务的列表，供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里配置导出。

.controller('/路径参数名') 文件需要导出一个使用@Controller 装饰器装饰过的类，用来定义控制器。该装饰器可以传入一个路径参数，作为访问这个控制器的主路径。类似 express、koa 里的路由。
类的属性会使用各种特定装饰器来定义 HTTP 请求类型，这些 http 请求类型装饰器也可以传入一个路径参数。
如：@Get 是请求方法的装饰器，对 getHello 方法进行修饰， 就表示这个方法会被 GET 请求调用。
@Get、@Post、@Put 等众多用于 HTTP 方法处理装饰器，经过它们装饰的方法，可以对相应的 HTTP 请求进行响应。同时它们可以接受一个字符串或一个字符串数组作为参数，这里的字符串可以是固定的路径，也可以是通配符。

.service() 文件需要导出一个使用@Injectable 装饰器装饰过的类，用来定义服务。也就是路由命中后会执行的操作，数据的处理返回，数据库的查询，写入，更新，删除等操作都是在这个文件中进行。
使用@Injectable 修饰后的 服务类, 在 模块 中注册之后，就可以直接在控制器中使用，我们就不需要使用 new AppService()去实例化，直接引入过来就可以用。也就是说在@Module 装饰器的 providers 选项中注册了，@Module 装饰器中 controllers 选项中注册的控制器里就可以直接引入使用 service 文件里定义的方法。

所以一个基本的 nest 模块是按照 mvc 模式拆分的分成三个组成：模块 module、控制器 controller、服务 service。

## 2.2 nestjs 使用

安装 nest-cli，也就是 nestjs 脚手架后，脚手架提供了很多命令。除了之前用来创建项目的命令还有可以生成一些别的代码的命令，比如 controller、service、module 等。
声明如下：可以通过 nest generate -h 命令查看具体语法。
//创建一个 nest 元素语法，
nest generate [文件类型] [文件名] [文件目录] [参数]
缩写：nest g [文件类型] [文件名] [文件目录] [参数]
常见的文件类型有：
模块 module/mo、生成的模块会自动在 AppModule 里引入。
控制器 controller/co、
服务 service/s、
中间件 middleware/mi、
接口 interface/itf、
工具类 library/lib 、
网关 gateway/ga、等等。

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

注意创建顺序： 先创建 Module, 再创建 Controller 和 Service, 这样创建出来的文件控制器和服务会在 Module 中自动注册。
反之，后创建 Module, Controller 和 Service,会被注册到最外层的根模块文件 app.module.ts 上。

还有一个快速创建 Contoller、Service、Module 以及 DTO 文件的方式:
比如创建一个用户 user 模块
nest generate resource user / nest g res user 这样就快速生成了一个 curd 模块,它同样会自动在 AppModule 引入.

打包命令：nest build 用来构建项目它会在 dist 目录下生成编译后的代码。
同样的它也有一些选项参数，可以通过 nest build -h 查看。

nest info 命令:这个就是查看项目信息的，包括系统信息、 node、npm 和依赖版本

如上等相关的配置都可以在 nest-cli.json 配置文件中对应的配置选项上配置，就跟 vue 项目的配置文件一样。

## 2.3 nestjs 实战目录

这是一种约定：
项目名(文件名)
├──dist 打包的目录
├──node_modules 模块依赖安装存放目录
├──test 测试的目录
├──src 源码目录
├───── app.controller.spec.ts 针对控制器的单元测试
├───── app.controller.ts 单个路由的基本控制器(Controller)
├───── app.module.ts 应用程序的根模块(Module)
├───── app.service.ts 具有单一方法的基本服务(Service)
├───── main.ts nest 应用程序的入口文件，它使用核心函数 NestFactory 来创建 Nest 应用程序的实例。

## 2.4 nestjs 全局模块

当一个模块被很多地方使用时就可以考虑将其变成全局模块，只需要在模块前添加 @Global()装饰器装饰即可。
不过全局模块还是尽量少用，不然注入的很多 provider 都不知道来源，会降低代码的可维护性。

## 2.5 nestjs 生命周期

Nest 在启动的时候，会递归解析 Module 依赖，扫描其中的 provider、controller，注入它的依赖。
全部解析完后，会监听网络端口，开始处理请求。
这个过程中，Nest 暴露了一些生命周期方法：
首先，递归初始化模块，会依次调用模块内的 controller、provider 的 onModuleInit 方法，然后再调用 module 的 onModuleInit 方法。

全部初始化完之后，再依次调用模块内的 controller、provider 的 onApplicationBootstrap 方法，然后调用 module 的 onApplicationBootstrap 方法。然后监听网络端口。之后 Nest 应用就正常运行了。这个过程中，onModuleInit、onApplicationBootstrap 都是我们可以实现的生命周期方法。

应用销毁的时候也同样有生命周期：先调用每个模块的 controller、provider 的 onModuleDestroy 方法，然后调用 Module 的 onModuleDestroy 方法。之后再调用每个模块的 controller、provider 的 beforeApplicationShutdown 方法，然后调用 Module 的 beforeApplicationShutdown 方法。然后停止监听网络端口。之后调用每个模块的 controller、provider 的 onApplicationShutdown 方法，然后调用 Module 的 onApplicationShutdown 方法。之后停止进程。

provider、controller、module 都支持启动和销毁的生命周期函数，这些生命周期函数都支持 async 的方式。

# 三、控制器 controller

后端框架基本都是 MVC 的架构。MVC 是 Model View Controller 的简写。MVC 架构下，请求会先发送给 Controller 控制器，由它调度 Model 层的 Service 来完成业务逻辑，然后返回对应的 视图 View。

和 express 里的路由类似，nest 的控制器作用一样的：就是处理客户端传入的请求和向客户端返回响应。
而在 nestjs 里，控制器就是被 @Controller 装饰器装饰的类就是一个 Controller 。
而控制器总是属于某一个模块，所以要在 module 文件中把它导入到@Module() 装饰器对应的 controllers 选项中,这样 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装,也就可以直接使用它,其本身只做路由的控制跳转这样有利于业务的抽离。

在这个文件中常用的装饰器如下，它们的作用和 express 里的 req、res 对象类似。
就是 nest 帮忙封装成了装饰器，可以直接使用罢了。
常见的如下：它们都是'@nestjs/common' 模块导出的。
import { Controller, Get, Post, Put, Patch, Delete, HttpCode, Headers, Redirect, Request, Response, Body, Param, Query,} from '@nestjs/common';

@Controller() 装饰器，是一个类装饰器，用来装饰一个类。
可以传入一个字符串值，作为路由前缀。
也可以传入一个对象，常用有三个配置属性
{
path:'路径',
host:'路径',
version:'接口版本'
}

方法装饰器，nest 提供了所有标准 HTTP 方法对应的请求方法装饰器，用来装饰具体的请求方法。
@Get(), @Post(), @Put(), @Patch(), @Delete(), @All()。也可以给这些装饰器传入一个路径参数，它会拼接在@Controller() 装饰器参数后面。
其它的方法装饰器还有如：@HttpCode() 用来指定返回的 http 状态码、@Headers 装饰器获取请求头信息、@Redirect 装饰器重定向。

属性装饰器，用来装饰方法里的参数。
其中@Request(), @Req() 装饰器都会获取到请求 request 对象，跟 express 里的 req 对象一样
其中@Response(), @Res() 装饰器都会获取到请求 response 对象，跟 express 里的 req 对象一样

获取 get 请求参数和动态路由参数和 express 里一样都是在请求对象里。
req.query 和 req.params

获取 post 等请求的请求体和 express 里也是一样的都是在请求对象里。
req.body

不过 nest 都提供了对应的装饰器，方便操作。
req.query === @Query() 直接获取 query 查询对象
req.params === @Param()直接获取 params 查询对象
req.body === @Body()直接获取请求体 body 对象

# 四、提供者 provider

各种功能和业务代码具体实现的地方就是提供者 provider，比如接下来的各种拦截器、各种过滤器、各种配置模块、各种中间间等全都是 Providers，即提供各种问题具体解决方法的人。

在 Nestjs 凡被 @Injectable 装饰器装饰的类就是 Providers ，提供者的主要思想是它可以注入依赖。他们都可以通过  constructor()方法注入依赖，这意味着对象之间可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给  Nest 运行时系统。
本质上就是使用了 @Injectable() 装饰器声明的类就可以被 Nest IoC 容器管理。

在 nestjs 一般作为 service 服务，所以文件命名一般是 xxx.service.js/ts。
也可以是过滤器， xxx.filter.js/ts。
也可以是拦截器， xxx.interceptor.js/ts。
等等反正就是一个用  @Injectable()  装饰器装饰的类。

它是业务实际处理的地方，它的使用也和前面 的 controller 类似，也需要在 module 文件通过@Module() 装饰器导入到对应的对象 providers 选项中去，这样就相当于在模块文件中注册。然后当控制器文件中使用 constructor 构造函数声明依赖时 constructor(private readonly catsService: CatsService),nest 的 IOC 容器就会查找之前注册的提供者实例化，将其缓存并返回。如果已经缓存，则直接返回现有实例。这样就可以直接使用了。

# 五、模块 module

Module 是 Nestjs 中 大的一个内容，它是整个 module 功能模块的收口 ，功能和特性和 Angular 保持一致。模块是具有 @Module() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来组织应用程序的结构。
@Module() 装饰器可以接受下面的参数
如果你需要把这个模块 暴露到全局使用可以加 一个装饰器 @Global
@Global()
@Module({
controllers:[], // 前面说过的控制器
imports:[], // 可以注入 其他 module 或者 provider
exports:[], // 如果你这个模块中的 provider 要在别的模块中使用你必须要在这里声明导出 provider ，当然你也可以把这个 module 导出其他地方 import 一下这样其他模块中的 provider 也是可以使用的。
providers:[] // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享。
})

# 六、拦截器 interceptor

拦截器是 NestJS 中实现 AOP 编程的五种方式之一，它和中间件是很类似的。
在 NestJS 中可以处理请求处理过程中的请求和响应,例如身份验证、日志记录、数据转换等。
它本质也是一个@Injectable()装饰器装饰的类，这个类实现了 NestInterceptor 接口，同时每个拦截器也实现了 intercept 方法，改方法接收两个参数：第一个是 ExecutionContext 实例 context(与警卫完全相同的对象)。ExecutionContext 继承自 ArgumentsHost。
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

# 七、过滤器 filter

## 7.1 过滤器概述

过滤器也是 NestJS 中实现 AOP 编程的五种方式之一，Nest 中过滤器一般是指 异常处理 过滤器,他们开箱即用，返回一些指定的 JSON 信息。在 NestJS 中有一个内置异常层可以自动处理整个程序中抛出的异常,比如你访问一个不存在的路由它会自动返回 404。

Nest 提供了一个内置的 HttpException 类，从@nestjs/common 包中公开。可以在任意地方使用它抛出一个错误。HttpStatus 也是从@nestjs/common 包中导入的一个 helper 枚举对象。
HttpException 构造函数接收两个必填参数用来决定返回的信息
new HttpException('描述信息', http 状态码);
默认情况下，返回的 JSON 响应体也包含两个属性:
statusCode:默认为 status 参数中提供的 HTTP 状态码
message:基于状态的 HTTP 错误的简短描述。

此外：Nest 提供了一组继承自基本 HttpException 的标准异常。这些都是从@nestjs/common 包中暴露出来的，代表了许多最常见的 HTTP 异常:

```
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
当客户端访问时就会返回如下内容：
{
  "statusCode": 403,
  "message": "Forbidden"
}

```

## 7.2 过滤器生成

```
脚手架命令快速生成一个过滤器
 nest g f http-exception --no-spec --flat

 /**
 * 统一的异常处理器-在错误发生时做一个统一的过滤处理后再返回给前台
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
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


```

## 7.3 过滤器注册

和中间件、守卫、拦截器类似，也是有全局作用域过滤器、控制器作用域、方法作用域三种。

```
方法作用域：使用UseFilters装饰器装饰即可
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}

控制器作用域：
@UseFilters(new HttpExceptionFilter())
export class CatsController {}

全局作用域过滤器：在入口文件中使用useGlobalFilters装饰器设置全局
app.useGlobalFilters(new HttpExceptionFilter());

```

# 八、中间件 middleware

中间件是 NestJS 中实现 AOP 编程的五种方式之一与 Express 中的中间件类似,它是用于处理 HTTP 请求和响应的功能模块。也就是在请求进入控制器之前或者响应返回给客户端之前执行一些操作的函数。中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的 `next()` 中间件函数。

```
在nestjs中使用脚手架命令创建一个中间件
nest g mi middlewareName --no-spec --flat
使用这个命令生成的中间件类自动实现 @nestjs/common 包中的 NestMiddleware接口。
同时可以使用express 中的类型指定req、res next钩子的类型。

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}

```

因为 nest 中间件也是使用 @Injectable() 装饰器装饰的类所以它完全支持依赖注入，所以可可以注册到全局模块使用，也可以在指定模块中注入使用。

使用方法：在@Module()装饰器中是没有设置中间件的选项的。实际上我们使用的是模块类的 configure()方法来设置它们。这是因为包含中间件的模块必须实现 NestModule 接口所以会自动执行模块类的 configure 方法。

```
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
// 导出根模块类，它已经经过@Module 装饰器 装饰了。
export class AppModule implements NestModule {
  // 实现中间件注册
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TestMiddleware) // 应用中间件,多个时逗号分隔即可。
      .forRoutes('*'); // 指定应用的路由或者控制器
  }
}


```

全局中间件就是使用 nest 使用 app 的 use 方法注册

```

const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);

```

## 9.1 日志收集和记录中间件

使用 Nestjs 中的两个技术点 中间件 +拦截器 ，以及 Nodejs 中流行的 log 处理器 log4js 来实现。最后的实现出来的效果是：错误日志和请求日志都会被写入到本地日志文件和控制台中。后续还会写一个定时任务的把日志清理以及转存。

# 九、导航守卫 Guard

它也是 NestJS 中实现 AOP 编程的五种方式之一，顾名思义,Guard 可以根据某些自定义的条件在调用某个 Controller 之前返回 true 或 false 决定放不放行。也就是进不进这个路由。本质上守卫也是一个带有@Injectable()装饰器的类。同时守卫应该实现 CanActivate 接口。

导航守卫就一个职责就是决定给定的请求是否由路由处理程序处理，也就是前端请求这个路径时处不处理。
这取决于运行时存在的某些条件：如权限、角色、acl 等这通常被称为授权，也就是看它有无授权进而查看它是否能访问某些路由。

每个守卫都必须实现一个 canActivate()函数。这个函数应该返回一个布尔值，指示当前请求是否被允许。
如果返回 true，请求将被处理。如果返回 false, Nest 将拒绝请求。
和拦截器一样有一个 ExecutionContext 类型的 context 参数,同样的我们可以根据 context.getHandler()拿到某个路由的元数据。
一般情况下我们是通过获取当前路由的元数据以及判断 token 是否过期来决定是否放行

```
使用脚手架命令快速生成一个守卫
nest g gu test --no-spec --flat
-- test.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TestGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}

Guard用法也有三种,分为全局路由守卫、控制器路由守卫、具体方法路由守卫,首先我们来看全局路由守卫的使用方法,用法和上面拦截器差不多,在main.ts中通过app.useGlobalGuards进行注册。
 // 全局导航守卫
  app.useGlobalGuards(new TestGuard());

想要控制单个路由或者整个控制器的守卫写法也和拦截器差不多,在app.controller.ts使用UseGuards启用即可
  @UseGuards(TestGuard)
  @Get('aa')
  aa(): string {
    return 'aa';
  }
这样就只在/aa路由中生效了

@UseGuards(RolesGuard)
export class CatsController {}
这样就是整个控制器生效

```

# 十、管道 pipe

## 10.1 管道概述

它也是 NestJS 中实现 AOP 编程的五种方式之一，在 NestJS 中,管道本质也是一个带有@Injectable()装饰器的类，它应该实现 PipeTransform 接口。Pipe 一般用来做参数转换的。简单理解就如同水管一样。从一边流进去从另一边流出来，然后你可以在这中间也就是管道中对流动的东西进行一些处理。

管道有两个典型的用例:
转换:将用户输入数据转换为所需的形式(例如，从字符串到整数)。
验证:对用户输入数据进行评估，如果有效，则不加修改地将其传递;否则，当数据不正确时抛出异常。
在这两种情况下，管道都对由控制器路由处理程序处理的参数进行操作。

## 10.2 管道注册

和中间件、过滤器等一样，管道也有全局作用域、方法作用域

```
方法作用域：
@Post()
@UsePipes(new JoiValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
方法参数：绑定其他转换管道(所有Parse*管道)的工作原理类似。这些管道都在验证路由参数、查询字符串参数和请求体值的上下文中工作。
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}

@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}

全局：依然是在入口文件中使用 useGlobalPipes 装饰器。
 app.useGlobalPipes(new ValidationPipe());


```

## 10.3 内置管道

NestJS 提供了很多内置的 Pipe,其中有六个管道是可以开箱即用的它们都是从 @nestjs/common 包导出。

ValidationPipe: 用于验证请求数据，通常用于验证请求体数据、查询参数、路由参数等。它使用了类似于 class-validator 库的装饰器来进行验证。如果验证失败，它会抛出 ValidationException 异常。

ParseIntPipe: 用于将输入数据解析为整数。它可以将字符串形式的整数转换为 JavaScript 整数。如果无法解析为整数，它会抛出 BadRequestException 异常。

ParseBoolPipe: 用于将输入数据解析为布尔值。它可以将字符串形式的"true"和"false"转换为对应的布尔值。如果无法解析为布尔值，它会抛出 BadRequestException 异常。

ParseArrayPipe: 用于将输入数据解析为数组。它可以将字符串形式的 UUID 转换为 UUID 对象。如果无法解析为数组，它会抛出 BadRequestException 异常。

ParseUUIDPipe: 用于将输入数据解析为 UUID（Universally Unique Identifier）。它可以将字符串形式的 UUID 转换为 UUID 对象。如果无法解析为 UUID，它会抛出 BadRequestException 异常。

DefaultValuePipe: 用于为缺少的参数提供默认值。如果某个参数未传递，它会使用提供的默认值替代。

## 10.4 自定义管道

和其它 AOP 编程实现方式类似的

```
脚手架命令快速生成一个管道
nest g pi test --no-spec --flat
每个管道都必须实现transform()方法来实现PipeTransform接口契约。这个方法有两个参数:
value参数是当前处理的方法参数(在被路由处理方法接收之前)，
metadata是当前处理的方法参数的元数据是一个包含被处理数据的元数据对象,它有两个属性分别为
type: 表示正在处理的数据的类型。可以是 'body'、'query'、'param' 或其他。这可以让我们确定管道是应用于请求体、查询参数、路由参数还是其他类型的数据。
metatype: 表示正在处理的数据的原始 JavaScript 类型。例如，如果正在处理一个参数，并且该参数是一个字符串，那么 metatype 可能是 String 类型。


import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TestPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}

注册使用：第一种是全局使用,可以在main.ts使用app.useGlobalPipes()进行全局注册,还可以在module中通过注入的方式使用。
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { CustomPipe } from './custom.pipe';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomPipe, // 启用自定义管道
    },
  ],
})
export class AppModule {}


```

# 十一、登录状态相关

## 10.1 概述

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

## 10.2 代码层面解决

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

# 十二、nest 连接 MySQL 数据库

ORM 技术（Object-Relational Mapping）,即把关系数据库的表结构映射到对象上。
这里选择 typeORM 来操作数据库。
安装：npm install --save @nestjs/typeorm typeorm mysql2
接下来创建实体类就可以通过代码来建表操作表，进行数据操作，TypeORM 是通过实体映射到数据库表。
所以我们先创建对应的实体类 entity，nest 中使用 entities 文件夹存放。

## 12.1 实体 entity

实体是一个用@Entity()装饰器装饰过的映射到数据库表（或使用 MongoDB 时的集合）的类。
可以通过定义一个新类来创建一个实体。

# 十三、配置接口文档 swagger

安装：npm install @nestjs/swagger swagger-ui-express -S

# 十四、实战

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
