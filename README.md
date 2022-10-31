# 一、概述
nestjs 9.0.0的学习。

# 二、nestjs概述
Nest (NestJS) 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的开发框架。它利用JavaScript 的渐进增强的能力，使用并完全支持 TypeScript （仍然允许开发者使用纯 JavaScript 进行开发），并结合了 OOP （面向对象编程）、FP （函数式编程）和 FRP （函数响应式编程）。
在底层，Nest 构建在强大的 HTTP 服务器框架上，例如 Express （默认），并且还可以通过配置从而使用 Fastify ！它是一个功能比较全面的Nodejs后端框架。
安装脚手架:
npm i -g @nestjs/cli  // 全局安装Nest
脚手架创建项目：
nest new project-name  // 创建项目
项目运行
npm run start
此命令将使用 HTTP 服务器启动应用程序，以侦听 src/main.ts 文件中所定义的端口。
项目目录结构
dist 打包的目录
test 测试的目录
src 源码目录
├── app.controller.spec.ts 针对控制器的单元测试
├── app.controller.ts 单个路由的基本控制器(Controller)
├── app.module.ts 应用程序的根模块(Module)
├── app.service.ts 具有单一方法的基本服务(Service)
├── main.ts 应用程序的入口文件，它使用核心函数 NestFactory 来创建 Nest 应用程序的实例。

AppModule是应用程序的根模块，根模块提供了用来启动应用的引导机制，可以包含很多功能模块。
.mudule文件需要使用一个@Module() 装饰器的类，
@Module() 装饰器接收四个属性：
providers、Nest.js注入器实例化的提供者（服务提供者），处理具体的业务逻辑，各个模块之间可以共享
controllers、处理http请求，包括路由控制，向客户端返回响应，将具体业务逻辑委托给providers处理。
imports、导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入
exports、导出服务的列表，供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里配置导出

使用@Controller装饰器来定义控制器, @Get是请求方法的装饰器，对getHello方法进行修饰， 表示这个方法会被GET请求调用。该装饰器可以传入一个路径参数，作为访问这个控制器的主路径：

使用@Injectable修饰后的 AppService, 在AppModule中注册之后，在app.controller.ts中使用，我们就不需要使用new AppService()去实例化，直接引入过来就可以用。

@Get、@Post、@Put等众多用于HTTP方法处理装饰器，经过它们装饰的方法，可以对相应的HTTP请求进行响应。同时它们可以接受一个字符串或一个字符串数组作为参数，这里的字符串可以是固定的路径，也可以是通配符。

nestjs脚手架提供的常用命令
1:创建模块
//语法
nest g [文件类型] [文件名] [文件目录]
//创建一个posts 帖子模块
nest g mo posts 
mo--module 模块
posts-- 文件名
文件目录不指定时默认再src下
执行命令后根模块会自动imports导入新建的模块

2:创建控制器
nest g co posts
co-- controller
此时创建了一个posts控制器，命名为posts.controller.ts以及一个该控制器的单元测试文件.执行完命令， 文件posts.module.ts中会自动引入PostsController,并且在@Module装饰器的controllers选项中注入。

3:创建服务类
nest g service posts

注意创建顺序： 先创建Module, 再创建Controller和Service, 这样创建出来的文件在Module中自动注册，反之，后创建Module, Controller和Service,会被注册到外层的app.module.ts

# 三、控制器controller
从概述里已经知道，控制器就是被 @Controller 装饰的类就是一个 Controller ，在module中把它导入到对应的controllers中就能够使用它,其功能是处理传入的请求和向客户端返回响应。本身只做路由的控制跳转。
@Controller() 装饰器可以传入一个字符串值，作为路由前缀。
可以使用 @Get @Put @Post @Delete 装饰器来定义http请求类型。如果你给他传递了参数那么这个参数就是它的路径。
@Req，@Res装饰器获取请求 request 和 响应 response 对象。
@Param，@Query装饰器获取get的query参数和parma参数
@Body装饰器获取POST PUT 等请求的Body参数
@HttpCode，@Header，@Redirect装饰器自定义状态码，请求头类型，重定向

# 四、提供者provider
在Nest中随处可见的都是 Providers ，比如接下来的拦截器啊，各种配置模块啊，各种中间间啊全都是统统都是 Providers，即提供各种问题具体解决方法的人。在Nestjs 凡被 @Injectable 装饰的类 都是Providers ，他们都可以通过 constructor 注入依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 Nest运行时系统。 Provider 只是一个用 @Injectable() 装饰器注释的类。在nestjs一般作为service服务，所以文件命名一般是 xxx.service.js/ts。
它是业务实际处理的地方，它的使用也和前面 的controller 类似，你需要在module入口加入到指定的对象providers选项中去。

# 五、模块module
Module是 Nestjs中 大的一个内容，它是整个module功能模块的收口 ，功能和特性和Angular保持一致。模块是具有 @Module() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来组织应用程序的结构。
@Module() 装饰器可以接受下面的参数
如果你需要把这个模块 暴露到全局使用可以加 一个装饰器 @Global
@Global()
@Module({ 
    controllers:[], // 前面说过的控制器
    imports:[], // 可以注入 其他module 或者provider
    exports:[], // 如果你这个模块中的provider要在别的模块中使用你必须要在这里声明导出provider ，当然你也可以把这个module导出其他地方import 一下这样其他模块中的provider也是可以使用的。
    providers:[]  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享。
})

# 六、实战
实现一个简单的博客Blog功能，包括以下功能
[基础的Article Tag Use 的CRUD ]
[ 统一config管理]
[日志搜集 ]
[ 异常处理]
[请求参数验证Dto ]
[JWT ]
[统一返回体 ]
[上传文件包括上传到本地和上传的OSS服务商 ]
[请求转发 ]
[job]
[用redis做单点登录 ]
[微服务]
[如果部署和运维（优雅重启） ]

路由设计：
Article相关
-get /artcels 获取所有文章
-get /artcels:id 获取指定id的文章
-post /artcels 创建文章
-put /artcels:id 修改文章
-delete /artcels:id 删除文章


Tag相关
-get /tags 获取所有 标签
-post /tag 创建标签
-put /tag:id 修改标签
-delete /tag:id 删除标签

User相关
-get /users 获取所有用户
-get /user:id 获取指定id用户的用户信息
-post /user 创建用户（注册）
-put /user:id 修改用户 信息
-delete /user:id 删除用户





