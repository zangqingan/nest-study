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