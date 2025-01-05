## 1、安装
> `npm install prisma`   
## 2、初始化
>` npx prisma init`
>会增加一个schema.prisma文件和env文件。
>修改evn中的链接, 在增加一个影子数据库（自己建一个空数据库就行）。

## 3、连接数据库
> 在schema.prisma中
``` js
datasource db {
  provider          = "mysql"
  url               = env("DATABASE_URL")
  // 影子数据库
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```
## 4、增加表
> 在schema.prisma中增加以下代码
``` js
model User {
  id       Int      @id @default(autoincrement())
  username String
  password String
  CreateAt DateTime @default(now())
  UpdataAt DateTime @updatedAt
  App      App[]
}
model App {
  id         Int      @id @default(autoincrement())
  title      String
  content    String   @db.Text
  previewImg String
  CreateAt   DateTime @default(now())
  UpdataAt   DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id])
  userId     Int
}

```
> 执行命令（可以一直点enter键）: `npx prisma migrate dev`。执行完毕之后查看对应数据库会增加一个user表。

## 5、使用mockjs数据填充
> 在prisma文件夹中创建seed.ts文件并写入如下代码:
``` js
import {PrismaClient} from '@prisma/client'
import {Random} from 'mockjs'

const prsma = new PrismaClient()

const run = async () => {
     for (let i=0; i<30; i++) {
          prisma.user.create({
             data: {
               username: Random.cname() ,
               password: Random.string()
             }
          })
     }
}

run()
```
> 在packge.json里面增加执行脚本
``` js
"prisma": {
    "seed": "node-ts prisma/seed.ts"
}
```
> 执行如下命令
`npx prssma db seed` , 打开数据库发现填充了30条数据
## 6、表关联填充
> user表和APP表是一对多的关系
``` js

const run = async () => {
  for (let i = 0; i < 30; i++) {
    await prisma.user.create({
      data: {
        username: Random.cname(),
        password: Random.string(),
        // 表关联填充
        App: {
          create: {
            title: Random.csentence(),
            content: Random.cparagraph(),
            previewImg: Random.image('300x300'),
          },
        },
      },
    })
  }
}
```
## 7、修改数据填充
> 将表中的第一个用户设成管理
``` js
const run = async () => {
  for (let i = 0; i < 30; i++) {
    await prisma.user.create({
      data: {
        username: Random.cname(),
        password: Random.string(),
        App: {
          create: {
            title: Random.csentence(),
            content: Random.cparagraph(),
            previewImg: Random.image('300x300'),
          },
        },
      },
    })
  }
  // 先将第一个用户查找出来
  const user = await prisma.user.findFirst()
  // 根据id修改username和password
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      username: 'admin',
      password: 'admin',
    },
  })
}
```
> 将`seed.ts`模块化
创建一个seed文件夹，创建一个user.ts文件，将修改用户为管理员的代码剪切到这里
``` js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
   const user = await prisma.user.findFirst()
   await prisma.user.update({
      where: {
         id: user.id
      },
      data: {
         username: 'admin',
         password: '123123'
      }
   })
}

```