# Windows环境下安装RocketMQ  
## 环境  
JDK1.8、Maven、Git
## 地址：http://rocketmq.apache.org

## 启动：  
启动NAMESERVER：bin下，然后执行‘start mqnamesrv.cmd’，启动NAMESERVER。成功后会弹出提示框，此框勿关闭。  
启动BROKER：bin下，然后执行‘start mqbroker.cmd -n 127.0.0.1:9876 autoCreateTopicEnable=true’，启动BROKER。成功后会弹出提示框，此框勿关闭。  



# RocketMQ插件部署
## 1.下载
地址：https://github.com/apache/rocketmq-externals.git 
下载完成之后，进入‘rocketmq-externals\rocketmq-console\src\main\resources’文件夹，打开‘application.properties’进行配置。  
```
server.contextPath=
server.port=8088    # 配置端口
#spring.application.index=true
spring.application.name=rocketmq-console
spring.http.encoding.charset=UTF-8
spring.http.encoding.enabled=true
spring.http.encoding.force=true
logging.config=classpath:logback.xml
#if this value is empty,use env value rocketmq.config.namesrvAddr  NAMESRV_ADDR | now, you can set it in ops page.default localhost:9876
rocketmq.config.namesrvAddr=127.0.0.1:9876      #配置NAMESERVER地址
#if you use rocketmq version < 3.5.8, rocketmq.config.isVIPChannel should be false.default true
rocketmq.config.isVIPChannel=
#rocketmq-console's data path:dashboard/monitor
rocketmq.config.dataPath=/tmp/rocketmq-console/data
#set it false if you don't want use dashboard.default true
rocketmq.config.enableDashBoardCollect=true
```
## 2. 编译启动
用CMD进入‘\rocketmq-externals\rocketmq-console’文件夹，执行‘mvn clean package -Dmaven.test.skip=true’，编译生成。

编译成功之后，Cmd进入‘target’文件夹，执行‘java -jar rocketmq-console-ng-1.0.0.jar’，启动‘rocketmq-console-ng-1.0.0.jar’。

## 3.测试
浏览器中输入‘127.0.0.1:配置端口’，成功后即可查看。
