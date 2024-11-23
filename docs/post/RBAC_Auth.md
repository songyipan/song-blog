# 前言
> 所谓的RBAC<font style="color:rgb(37, 41, 51);">是 Role Based Access Control，基于角色的权限控制，给用户分配不同的角色，每个角色有相对应的权限。详情如下图所示</font>
>

![](/public/qianyan.png)

# 创建数据库
        从上面的图不难看出，如果要创建表就要有user、role、permission这三个表，它们的对应关系为多对多。

首先创建一个名叫**rbac-nest**的数据库, 在nestjs项目中安装TypeORM需要的依赖包:`npm install --save @nestjs/typeorm typeorm mysql2`。

## 创建实体类
创建一个`user`模块

执行命令：`nest g res user --no-spec`，选择`REST API`，连续回车

![](/public/chuangjianshitilei.png)

在user模块中的entities文件夹中新增连个实体类`role`和`permission`，创建role.entity.ts和permission.entity.ts分别新增如下代码：

### user.entity.ts中:
```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
  })
  roles: Role[];
}

```

这里我简单介绍一下上面代码的大概意思：

创建了一个主键id、用户名、密码、创建日期、更细日期、表关联关系。`@Entity()`装饰器来定义User这个类是一个实体类，`@PrimaryGeneratedColumn`这个装饰器用来定义`id`这个属性是一个主键并且自增，`@Column`定义属性为表字段。`@ManyToMany(() => Role)`这个字段表示与`Role`这个表是多对多的关系。`@JoinTable({name: 'user_role'})`创建中间表，并且表明是user_role。想要了解更多TypeORM的知识可以翻阅文档: [typeorm中文文档](https://www.typeorm.org/)。以上代码会有报错，因为`role`这个实体类还没创建。

### role.entity.ts中:
```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission',
  })
  permissions: Permission[];
}

```

以上代码我就把不过多介绍了，name对应的角色名，description对应的是角色描述。但是以上代码会有报错，因为`Permission`实体类没有创建。

### permission.entity.ts中：
```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}

```

这个代码和role里面几乎一模一样，只不过少了后面的ManyToMany。

## 在数据库中新增表：
在app.module.ts中引入`TypeOrmModule`并做一些配置：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123123',
      database: 'rbac-nest',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

synchronize: 如果是true代表自自动同步创建表

entities：实体类，数据库中的表就是根据实体类创建的

将database、username、password换成自己的。保存之后执行指令：`npm run start:dev`启动项目，查看数据库是不是增加了几个表：

![](/public/zaishujukuzhongxinzengbiao.png)

至此数据库的创建完成了。

# 登录
## 初始化数据
首先我们对表进行一些数据的填充：

在user/user.service.ts中删除自动生成的一些代码再添加初始化的代码：

```typescript
import { Injectable } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly entityManager: EntityManager) {}
  async initData() {
    const user1 = new User();
    user1.username = 'xiaosong1';
    user1.password = '123123';

    const user2 = new User();
    user2.username = 'xiaosong2';
    user2.password = '123123';

    const role1 = new Role();
    role1.name = 'admin';
    role1.description = 'admin';

    const role2 = new Role();
    role2.name = 'user';
    role2.description = 'user';

    const permission1 = new Permission();
    permission1.name = 'add';
    permission1.description = 'add';

    const permission2 = new Permission();
    permission2.name = 'updata';
    permission2.description = 'updata';

    const permission3 = new Permission();
    permission3.name = 'del';
    permission3.description = 'del';

    const permission4 = new Permission();
    permission4.name = 'query';
    permission4.description = 'query';

    role1.permissions = [permission1, permission2, permission3, permission4];

    role2.permissions = [permission1, permission2, permission4];

    user1.roles = [role1];

    user2.roles = [role2];

    await this.entityManager.save(Permission, [
      permission1,
      permission2,
      permission3,
      permission4,
    ]);

    await this.entityManager.save(Role, [role1, role2]);

    await this.entityManager.save(User, [user1, user2]);
  }
}

```

不要被上面的代码吓到，其实很简单，直接不必理解什么意思直接复制粘贴拿来用就行了，主要看一下填加后的u用户和角色以及权限之间的关系：

![](/public/dengluchushihuashuju.png)
在user/user.controller.ts中修改代码如下：

```typescript
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  initData() {
    return this.userService.initData();
  }
}
```

在apifox里面请求一下接口：

![](/public/dengluchushhuashuju-apifox.png)


打开数据库表就会看到数据已经填充成功了，至此已经完成一半的工作了。

## JWT
### 配置jwt
首先要先安装一下依赖包：`npm install --save @nestjs/jwt`

在app.module.ts中引入`JwtModule`：

![](/public/peizhijwt.png)


```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123123',
      database: 'rbac-nest',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

`secret`： 密钥

`signOptions: { expiresIn: '1d' }`：过期时间1天

`global: true`：全局模块

### 登录功能
在`**construct中把jwtservice注入**`

```typescript
constructor(
  private readonly entityManager: EntityManager,
  private readonly jwtService: JwtService,
) {}
```

在user/user.service.ts中添加一个login函数:

```typescript
async login(createUserDto: CreateUserDto) {
  const userInfo = await this.entityManager.findOne(User, {
    where: {
      username: createUserDto.username,
      password: createUserDto.password,
    },
    relations: {
      roles: true,
    },
  });

  if (!userInfo) throw new HttpException('用户名或密码错误', 401);

  console.log(userInfo.roles);

  return {
    token: this.jwtService.sign({
      username: userInfo.username,
      roles: userInfo.roles,
    }),
  };
}
```

以上代码中`entityManager.findOne`通过username和password查找是否存在该用户，使用`relations`查处对应的role，如果查出来了就使用`jwtService.sign`生成token，token里面存储了用户名和roles。

在user.controller.ts中添加login

```typescript
@Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.userService.login(createUserDto);
  }
```

接下里在apifox里面测试一下，可以看到token已经生成了：

![](/public/peizhijwt-apifox.png)


### 创建登录的守卫
有些接口是需要登录之后才能访问的，这里我们创建一个login-guard:

首先执行指令创建一个守卫：`nest g gu guard/login --no-spec`

在guard/login.guard.ts中增加如下代码：

```typescript
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from 'src/user/entities/role.entity';

declare module 'express' {
  interface Request {
    user: {
      username: string;
      roles: Role[];
    };
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) throw new HttpException('Unauthorized', 401);

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
    } catch (error) {
      throw new HttpException('Unauthorized', 401);
    }
    return true;
  }
}

```

以上代码看上去很多但是不要慌，这里简单梳理一下就知道什么意思了，真正涉及到逻辑很少。守卫返回一个boolen，如果反水false就是不通过如果是true就是通过。接下来一段一段的讲解一下：

`const request: Request = context.switchToHttp().getRequest();`：获取request对象，request里面存放着请求携带的数据以及token等。

`const token = request.headers.authorization`：在请求头中获取token。

`if (!token) throw new HttpException('Unauthorized', 401);`：如果token不存在就抛出一个异常。

`const decoded = this.jwtService.verify(token);`：对token进行校验，这段代码是放在`try/catch`里面的，如果校验失败了就执行catch里面的抛出异常。

`request.user = decoded;`：将校验通过后的信息（username，role）放在request对象里面，这个request对象存在于全上下文中可以在其他地方获取到user这个对象。

其中以下这段代码的作用是给Request扩展了一个user。

```typescript
declare module 'express' {
  interface Request {
    user: {
      username: string;
      roles: Role[];
    };
  }
}
```

然后把这个loginGuard添加为全局守卫。这样就不用在路由上面一个个的加了：

![](/public/chuangjiandenglushouwei.png)


那么就会有一个问题，全局加上需要登录的守卫这样登录接口也要被拦截了，还有一些不需要登录的借口也要被拦截，这里我们就用到了自定义装饰器。

#### 自定义装饰器：
执行指令：`nest g d  decorator/custom  --no-spec --flat`创建自定装饰器。

在创建的自定义装饰器文件中添加如下代码：

```typescript
import { SetMetadata } from '@nestjs/common';

export const RequireLoginKey = 'require-login';
export const RequireLogin = () => SetMetadata(RequireLoginKey, true);
```

在需要登录的地方加上这个这个RequireLogin装饰器，这里在user.controller.ts中添随便添加一个add路由并且加上RequireLogin装饰器：

![](/public/chuangjiandenglushouwei-1.png)



在改造一下login守卫，这里使用reflector获取装饰器里的数据

![](/public/chuangjiangdenglshouwei-2.png)

这里解释一下代码：

```typescript
const loginFlag = this.reflector.get<boolean>( // 最终获取到的是true（如果路由上面加了这个requirelogin装饰器） 
      RequireLoginKey,  // 这里是装饰器对应的唯一key，在装饰器里面有写
      context.getHandler(),
    );
```

`if (!loginFlag) return true;`：如果不是true则说说明不用登录校验也可以通过直接返回true就不执行后面的代码了。

接下来在apifox里面测试一下，先不带着token请求add这个接口：

![](/public/zidingyizhuangshiqi-apifox-1.png)

请求一下login接口获取到token，带着token请求一次：

![](/public/zidingyizhuangshiqi-apifox-2.png)

显然这个装饰器已经生效了。这个自定义装饰器很重要后面实现权限校验就是通过这个实现的。

# 实现RBAC
创建一个守卫：`nest g gu guard/permission --no-spec `

在自定义装饰器中添加一个permission装饰器：

![](/public/shixianrbac-1.png)

接下来在需要权限的地方加上这个装饰器。要注意装饰器里的参数，这里是一个字符串数组。

在user.controllser.ts中随便增加一个del接口，并且加上RequireLogin装饰和Permission装饰器。

![](/public/shixianrbac-2.png)

接下来在user.service.ts中增加一个根据role的id获取权限列表的函数：

```typescript
async getPermissionByRoleId(roleId: number[]) {
    const res = await this.entityManager.find(Role, {
      where: {
        id: In(roleId),
      },
      relations: {
        permissions: true,
      },
    });

    // 得到一个permission名字的数组
    const permission: string[] = [].concat(
      ...res.map((item) => {
        return item.permissions.map((item) => {
          return item.name;
        });
      }),
    );

    return permission;
  }
```

对PermissionGuard添加代码，以下代码看上去很多其实有效代码就几行，看注释就能清楚什么意思。

```typescript
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PermissionKey } from 'src/decorator/custom.decorator';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {

    // 获取装饰器中的参数，也就是所需要的权限名
    const permission = this.reflector.get<string[]>(
      PermissionKey,
      context.getHandler(),
    );

    // 如果为空则说明不用权限直接返回true
    if (!permission) return true;

    // 获取request对象
    const request: Request = context.switchToHttp().getRequest();

    // 在request中得到在登录守卫中存储的user
    const user = request.user;

    // 得到role的id数组
    const rolesId = user.roles.map((role) => role.id);

    // 调用在user.service.ts中增加的获取权限列表的函数得到权限列表
    const res = await this.userService.getPermissionByRoleId(rolesId);

    console.log(res);
    console.log(permission);

    // 判断res中的权限是否包含permission中的权限，如果有一个不匹配的就抛出异常
    for (let i = 0; i < permission.length; i++) {
      if (!res.includes(permission[i])) {
        throw new HttpException('Permission denied', 403);
      }
    }

    return true;
  }
}

```

再将permission守卫添加到全局：

![](/public/shixianrbac-3.png)

最后我们在apifox里测试一下：

![](/public/shixianzhuangshiqi-api-1.png)

然后改一下装饰器中的参数，加一个没有的权限：

![](/public/shixianzhuangshiqi-3.png)

在apifox里面再次测试一下：

![](/public/shixianzhuangshiqi-api-2.png)

可以看到已经返回异常信息了，说明已经生效了。至此已经完成了，如有错误欢迎大家评论区留言。代码仓库地址：[完整代码](https://gitee.com/songyipantest/nest-rbac.git)

