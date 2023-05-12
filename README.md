# 一、概述

nestjs^9.0.0 的学习，主要包括以下几个部分内容。
nestjs 概述、
nestjs 项目创建、
nestjs 相关知识学习、
MySQL 连接和操作、
resfulapi curd 接口实现、
接口校验、
swagger 接口文档编写
等内容

# 二、nestjs 概述及使用

## 2.1 nestjs 概述

Nest (NestJS) 是一个用于构建高效、可扩展的  Node.js  服务器端应用程序的开发框架。它利用 JavaScript 的渐进增强的能力，使用并完全支持  TypeScript （仍然允许开发者使用纯 JavaScript 进行开发），并结合了 OOP （面向对象编程）、FP （函数式编程）和 FRP （函数响应式编程）。
在底层，Nest 构建在强大的 HTTP 服务器框架上，例如  Express （默认），并且还可以通过配置从而使用  Fastify ！它是一个功能比较全面的 Nodejs 后端框架。其实和 Express 用法类似，不同在用使用了控制反转依赖注入。

安装脚手架:
npm i -g @nestjs/cli // 全局安装 Nest 脚手架
之后跟 vue 脚手架类似就可以使用：nest 命令。
nest -v 查看安装的版本。
nest -h 查看帮助信息。
脚手架创建项目：
nest new project-name // 创建项目
项目运行
npm run start 其它启动命令查看包管理文件即可。
此命令将使用 HTTP 服务器启动应用程序，以侦听 src/main.ts 文件中所定义的端口。

nest 项目目录结构如下：
项目名(文件名)
dist 打包的目录
node_modules 模块依赖安装存放目录
test 测试的目录
src 源码目录
├── app.controller.spec.ts 针对控制器的单元测试
├── app.controller.ts 单个路由的基本控制器(Controller)
├── app.module.ts 应用程序的根模块(Module)
├── app.service.ts 具有单一方法的基本服务(Service)
├── main.ts nest 应用程序的入口文件，它使用核心函数 NestFactory 来创建 Nest 应用程序的实例。

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

安装 nest-cli，也就是 nestjs 脚手架后，脚手架提供了很多命令。
其中常用命令如下：
//创建一个 nest 元素语法
nest generate [文件类型] [文件名] [文件目录]
nest g [文件类型] [文件名] [文件目录]
常见的文件类型有：模块 module/mo、控制器 controller/co、服务 service/s、中间件 middleware/mi、接口 interface/itf、工具类 library/lib 等等

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

注意创建顺序： 先创建 Module, 再创建 Controller 和 Service, 这样创建出来的文件在 Module 中自动注册。
反之，后创建 Module, Controller 和 Service,会被注册到最外层的根模块文件 app.module.ts 上。

还有一个快速创建 Contoller、Service、Module 以及 DTO 文件的方式:
比如创建一个用户 user 模块
nest g resource user
这样就快速生成了一个 curd 模块

## 2.3 nestjs 实战目录

这是一种约定：
项目名(文件名)
dist 打包的目录
node_modules 模块依赖安装存放目录
test 测试的目录
src 源码目录
├── app.controller.spec.ts 针对控制器的单元测试
├── app.controller.ts 单个路由的基本控制器(Controller)
├── app.module.ts 应用程序的根模块(Module)
├── app.service.ts 具有单一方法的基本服务(Service)
├── main.ts nest 应用程序的入口文件，它使用核心函数 NestFactory 来创建 Nest 应用程序的实例。

# 三、控制器 controller

和 express 里的路由类似，作用一样的就是处理客户端传入的请求和向客户端返回响应。
而在 nestjs 里，控制器就是被 @Controller 装饰器装饰的类就是一个 Controller 。而控制器总属于某一个模块，所以要在 module 文件中把它导入到@Module() 装饰器对应的 controllers 选项中这样就能够使用它,其本身只做路由的控制跳转这样有利于业务的抽离。

在这个文件中常用的装饰器如下，它们的作用和 express 里的 req、res 对象类似。就是 nest 帮忙封装成了装饰器，可以直接使用罢了。常见的如下：它们都是'@nestjs/common' 模块导出的。
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
req.query === @Query()
req.params === @Param()
req.body === @Body()

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

# 六、nest 连接 MySQL 数据库

ORM 技术（Object-Relational Mapping）,即把关系数据库的表结构映射到对象上。
这里选择 typeORM 来操作数据库。
安装：npm install --save @nestjs/typeorm typeorm mysql2
接下来创建实体类就可以通过代码来建表操作表，进行数据操作，TypeORM 是通过实体映射到数据库表。
所以我们先创建对应的实体类 entity，nest 中使用 entities 文件夹存放。

## 6.1 实体 entity

实体是一个用@Entity()装饰器装饰过的映射到数据库表（或使用 MongoDB 时的集合）的类。
可以通过定义一个新类来创建一个实体。

# 七、拦截器 interceptor

# 八、过滤器 filter
Nest中过滤器一般是指 异常处理 过滤器,他们开箱即用，返回一些指定的JSON信息。


# 九、中间价 middleware

# 七、配置接口文档 swagger

安装：npm install @nestjs/swagger swagger-ui-express -S

# 七、实战

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
