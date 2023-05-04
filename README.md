# 一、概述

nestjs9.0.0+ 的学习，主要包括以下几个部分内容。
nestjs 概述、
nestjs 项目创建、
MySQL 连接和操作、
resfulapi curd 接口实现、
接口校验、
swagger 接口文档编写
等内容

# 二、nestjs 概述及使用

## 2.1 nestjs 概述

Nest (NestJS) 是一个用于构建高效、可扩展的  Node.js  服务器端应用程序的开发框架。它利用 JavaScript 的渐进增强的能力，使用并完全支持  TypeScript （仍然允许开发者使用纯 JavaScript 进行开发），并结合了 OOP （面向对象编程）、FP （函数式编程）和 FRP （函数响应式编程）。
在底层，Nest 构建在强大的 HTTP 服务器框架上，例如  Express （默认），并且还可以通过配置从而使用  Fastify ！它是一个功能比较全面的 Nodejs 后端框架。

安装脚手架:
npm i -g @nestjs/cli // 全局安装 Nest
之后跟 vue 脚手架类似就可以使用：nest 命令。
nest -v 查看安装的版本。
nest -h 查看帮助信息。
脚手架创建项目：
nest new project-name // 创建项目
项目运行
npm run start 或者快捷启动名 nest start
此命令将使用 HTTP 服务器启动应用程序，以侦听 src/main.ts 文件中所定义的端口。
项目目录结构如下：
dist 打包的目录
test 测试的目录
src 源码目录
├── app.controller.spec.ts 针对控制器的单元测试
├── app.controller.ts 单个路由的基本控制器(Controller)
├── app.module.ts 应用程序的根模块(Module)
├── app.service.ts 具有单一方法的基本服务(Service)
├── main.ts nest 应用程序的入口文件，它使用核心函数 NestFactory 来创建 Nest 应用程序的实例。

AppModule 是应用程序的根模块，它提供了用来启动应用的引导机制，可以包含很多功能模块。
.module 文件需要导出一个使用@Module() 装饰器装饰过的类，
@Module() 装饰器接收四个属性：
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

# 三、控制器 controller

从概述里已经知道，控制器就是被 @Controller 装饰的类就是一个 Controller ，在 module 中把它导入到对应的 controllers 中就能够使用它,其功能是处理传入的请求和向客户端返回响应。本身只做路由的控制跳转。
@Controller() 装饰器可以传入一个字符串值，作为路由前缀。
可以使用 @Get @Put @Post @Delete 装饰器来定义 http 请求类型。如果你给他传递了参数那么这个参数就是它的路径。
@Req，@Res 装饰器获取请求 request 和 响应 response 对象。
@Param，@Query 装饰器获取 get 的 query 参数和 parma 参数
@Body 装饰器获取 POST PUT 等请求的 Body 参数
@HttpCode，@Header，@Redirect 装饰器自定义状态码，请求头类型，重定向

# 四、提供者 provider

在 Nest 中随处可见的都是 Providers ，比如接下来的拦截器啊，各种配置模块啊，各种中间间啊全都是统统都是 Providers，即提供各种问题具体解决方法的人。在 Nestjs 凡被 @Injectable 装饰的类 都是 Providers ，他们都可以通过  constructor  注入依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给  Nest 运行时系统。 Provider 只是一个用  @Injectable()  装饰器注释的类。在 nestjs 一般作为 service 服务，所以文件命名一般是 xxx.service.js/ts。
它是业务实际处理的地方，它的使用也和前面 的 controller 类似，你需要在 module 入口加入到指定的对象 providers 选项中去。

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
安装：npm install @nestjs/typeorm typeorm mysql2 -S

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
