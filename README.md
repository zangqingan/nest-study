# 一、概述
nestjs 9.0.0的学习。

# 二、nestjs概述
Nest (NestJS) 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的开发框架。它利用JavaScript 的渐进增强的能力，使用并完全支持 TypeScript （仍然允许开发者使用纯 JavaScript 进行开发），并结合了 OOP （面向对象编程）、FP （函数式编程）和 FRP （函数响应式编程）。
在底层，Nest 构建在强大的 HTTP 服务器框架上，例如 Express （默认），并且还可以通过配置从而使用 Fastify ！它提供了一个体系结构。
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

# 三、
# 一、nestjs学习记录
  缘起：跟b站的全栈之巅入门学习的https://space.bilibili.com/341919508，配合官方文档https://docs.nestjs.cn/8/firststeps。总的来说和之前的express，koa，egg类似，区别在于nestjs提供了一种架构，一种体系结构，它帮助开发人员实现层的最大分离，并在应用程序中增加抽象。

# 二、nestjs概述
Nest 是一个用于构建高效、可扩展的渐进式 Node.js 服务端应用框架，基于 TypeScript 编写并且结合了 OOP（面向对象编程）、FP（函数式编程）、FRP（函数式响应编程） 的相关理念。并且设计上很多灵感来自于 Angular4。而Angular 的很多模式又来自于 Java 中的 Spring 框架，依赖注入、面向切面编程等，所以你可以认为： Nest 是 Node.js 版的 Spring 框架。
  具有以下特点：
    完美支持 Typescript
    面向 AOP 编程
    支持 Typeorm
    高并发，异步非阻塞 IO
    Node.js 版的 spring
    构建微服务应用
## 2.1 安装启动
框架的好处就是不用自己搭建项目，一般都有自己的脚手架，nestjs使用Nest CLI 构建项目。
跟其它脚手架工具一样，安装脚手架之后就可以使用nest命令了
$ npm i -g @nestjs/cli  全局安装nest脚手架
$ nest -v 查看版本信息
$ nest new project-name 新建一个nest项目
$ nest update -f -t latest  nest版本过低时升级为最新版 
创建 project-name 目录， 安装 node_modules 和一些其他样板文件，并将创建一个 src 目录，这个目录是未来源码存放目录，根据用户自己的专用目录保存对应的模块。
src
 ├── app.controller.spec.ts 对于基本控制器的单元测试样例
 ├── app.controller.ts 带有单个路由的基本控制器示例
 ├── app.module.ts 应用程序的根模块
 ├── app.service.ts 带有单个方法的基本服务
 └── main.ts 应用程序入口文件，主要是定义了一个异步启动函数用来启动应用程序。
书写好代码之后可以使用如下命令启动项目。
$ npm run start

# 三、nestjs控制器
控制器（Controller）负责处理客户端传过来请求并在处理好后向客户端发送响应内容，在传统的 MVC 架构中控制器的目的就是负责接收和处理指定请求与应用程序的对应关系。那么怎么控制哪个控制器接收哪些请求呢？这是由后端的路由机制来控制的。通常，每个控制器有多个路由，不同的路由也可以执行不同的操作。
##  3.1 路由 
得益于 TypeScript，创建一个基本的控制器，Nest 可以使用类来实现控制器的功能，使用装饰器来实现路由功能：即装饰器会将类与所需的元数据相关联，并使 Nest 能够创建路由映射（将请求绑定到相应的控制器）。
它们分别需要配合控制器类的装饰 @Controller() 和HTTP具体请求方法的装饰器 如get请求的@Get() 装饰器来使用从而决定一个路由规则：即路径和请求方法以及对应的处理函数。

注意：Nest 为所有标准的 HTTP 方法提供了相应的装饰器：@Put()、@Delete()、@Patch()、@Options()、以及 @Head()。此外，@All() 则用于定义一个用于处理所有 HTTP 请求方法的处理程序。

@Controller('Router Prefix'),使用它装饰(声明)一个类为控制器类，可以传入一个可选的路由路径前缀参数，对一组相关的路由进行分组，并最大程度地减少重复代码。

@Get('profile') 装饰器，使用它告诉 Nest 接收到指定的HTTP请求方法类型(get请求还是post请求或其它)时，触发对应的函数也就是它装饰的那个方法。 

创建控制器语法：可以手动创建文件也可以使用命令创建。命令创建是会自动更新根模块。
$ nest g controller cats(控制器名)

Request对象：和之前的node框架一样，处理程序有时需要访问客户端的请求细节。Nest 也提供了对底层平台（默认为 Express）的请求对象（request）的访问方式。我们可以在处理函数的签名中使用 @Req() 装饰器，指示 Nest 将请求对象注入处理程序。
Response对象：在请求处理函数中注入 @Res()或 @Response() 时，会将 Nest 置于该处理函数的特定于库（Library-specific mode）的模式下，并负责管理响应。这样做时，必须通过调用 response 对象（例如，res.json(…) 或 res.send(…)）发出某种响应，否则 HTTP 服务器将挂起。


nest控制器为此提供了一系列的装饰器，主要有路由触发时回调函数形参装饰器，回调函数装饰器。一个是装饰方法的形参，一个是装饰方法本身。一般也都需要从 @nestjs/common 包导入。
方法形参装饰器：
装饰器名称 	                        描述
@Request()， @Req()	        对应Express的req，
@Response() ，@Res()	      对应Express的res，
@Next() 	                  对应Express的next
@Session() 	                对应Express的req.session
@Param(param?: string) 	    对应Express的req.params 动态路由参数数据
@Body(param?: string) 	    对应Express的req.body
@Query(param?: string) 	    对应Express的req.query



方法装饰器：ben
装饰器名称 	描述
@Post() 	对应Express的Post方法
@Get() 	对应Express的Get方法
@Put() 	对应Express的Put方法
@Delete() 	对应Express的Delete方法
@All() 	对应Express的All方法
@Patch() 	对应Express的Patch方法
@Options() 	对应Express的Options方法
@Head() 	对应Express的Head方法
@Render() 	对应Express的res.render方法
@Headers(param?: string) 	  对应Express的req.headers,指定自定义响应头
@HttpCode() 	对应Express的res.status方法，可以配合HttpStatus枚举,修改返回的HTTP状态码
@Redirect(url,statusCode)   响应重定向到特定的 URL,如果省略，则 statusCode 默认为 302。

最终Controller 做的事情仅仅是接收请求，并在合适的时候调用到 Service，至于 Service 内部怎么实现的 Controller 完全不在乎。也就是路由命中执行回调，但是回调到底怎么处理的我不关心，我只是分发路由。

# 四、nestjs提供者
Providers 是 Nest 的一个基本概念。 主要的设计理念来自于控制反转（Inversion of Control，简称 IOC1 ）模式中的依赖注入（Dependency Injection）特性。许多基本的 Nest 类可能被视为 provider - service, repository, factory, helper 等等。 他们都可以通过 constructor 注入依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 Nest运行时系统。使用 @Injectable() 装饰器装饰的类就是一个 Provider，装饰器方法会优先于类被解析执行。
