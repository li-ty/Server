# MySQL集群部署方案

MySQL数据库一主双从集群模式依赖MySQL主从复制，MyCat数据库中间件和Docker，所以服务器需要安装Docker及MyCat。
MyCat下载地址：[MyCat](http://www.mycat.org.cn/)

## 基于Docker的Mysql主从复制搭建

首先拉取docker镜像,我们这里使用5.7版本的mysql：
``` shell
docker pull mysql:5.7
```
然后使用此镜像启动容器，这里需要分别启动一主双从三个容器：

主：
``` shell
docker run -p 3000:3306 --name master -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
```
双从：
``` shell
docker run -p 3001:3306 --name slave1 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
docker run -p 3001:3306 --name slave2 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
```
master对外映射的端口是3000，slave1、slave2对外映射的端口分别是3001、3002。因为docker容器是相互独立的，每个容器有其独立的ip，所以不同容器使用相同的端口并不会冲突。这里我们应该尽量使用mysql默认的3306端口，否则可能会出现无法通过ip连接docker容器内mysql的问题。
使用docker ps命令查看正在运行的容器，可以使用Navicat等工具测试连接mysql。

**配置master(主)**  
通过docker exec -it 627a2368c865 /bin/bash命令进入到master容器内部，也可以通过docker exec -it master /bin/bash命令进入。627a2368c865是容器的id，master是容器的名称。在数据库配置文件/etc/mysql/mysql.conf.d/mysqld.cnf追加以下配置：
```
## 同一局域网内注意要唯一
server-id=1 
## 开启二进制日志功能，可以随便取（关键）
log-bin=mysql-bin
```
命令如下：
``` shell
echo 'server-id=1' >> /etc/mysql/mysql.conf.d/mysqld.cnf
echo 'log-bin=mysql-bin' >> /etc/mysql/mysql.conf.d/mysqld.cnf
```
如果操作出错，可用命令sed -i '$d' /etc/mysql/mysql.conf.d/mysqld.cnf删除最后一行。配置完成之后，需要重启mysql服务使配置生效。使用service mysql restart完成重启。重启mysql服务时会使得docker容器停止，我们还需要docker start master启动容器。

下一步在登录master数据库创建数据同步用户，授予用户 slave REPLICATION SLAVE权限和REPLICATION CLIENT权限，用于在主从库之间同步数据。SQL命令如下：
``` sql
CREATE USER 'slave'@'%' IDENTIFIED BY '123456';
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'slave'@'%';
```

**配置slave(从)（从一从二流程一样）**  
和配置master(主)一样，在slave配置文件/etc/mysql/mysql.conf.d/mysqld.cnf中追加以下配置：
```
## 设置server_id,注意要唯一
server-id=2
## 开启二进制日志功能，以备Slave作为其它Slave的Master时使用
log-bin=mysql-slave-bin   
## relay_log配置中继日志
relay_log=edu-mysql-relay-bin
```
配置完成后也需要重启mysql服务和docker容器，操作和配置master(主)一致。

**链接master(主)和slave(从)**  
在master进入mysql，执行show master status;获取File和Position字段的值。然后在slave中进入mysql，执行
``` sql
change master to master_host='172.17.0.2', master_user='slave', master_password='123456', master_port=3306, master_log_file='mysql-bin.000001', master_log_pos= 2830, master_connect_retry=30;
```
命令说明：
master_host：master的地址，也可以是容器的独立ip
``` shell
# 容器的独立ip可以通过如下命令获取
docker inspect --format='{{.NetworkSettings.IPAddress}}' 容器名称|容器id
```
master_port：master的端口号，指的是容器的端口号

master_user：用于数据同步的用户

master_password：用于同步的用户的密码

master_log_file：指定 slave 从哪个日志文件开始复制数据，即上文中提到的 File 字段的值

master_log_pos：从哪个 Position 开始读，即上文中提到的 Position 字段的值

master_connect_retry：如果连接失败，重试的时间间隔，单位是秒，默认是60秒

然后在slave中的mysql终端执行start slave;开启主从复制，然后执行show slave status \G;查询主从同步状态。如果SlaveIORunning 和 SlaveSQLRunning 都是Yes，说明主从复制已经开启成功。


## MyCat安装配置
安装JDK，然后
``` shell
# 下载并解压MyCat到/usr/local/目录
cd /usr/local/
wget http://dl.mycat.io/1.6.5/Mycat-server-1.6.5-release-20180122220033-linux.tar.gz
tar -xvf Mycat-server-1.6.5-release-20180122220033-linux.tar.gz 
cd mycat/
```
在bin目录下./mycat console 前台运行，./mycat start 启动，./mycat stop 停止等等。
MyCat连接命令(跟MySQL连接方式一致，只是端口不同)：
``` shell
mysql -h ip地址 -uroot -p123456 -P8066
```
**配置文件**  
server.xml(此文件主要用来配置连接MyCat的用户及权限等)：
``` xml
        <user name="root" defaultAccount="true"><!-- 用户名，是否默认用户 -->
                <property name="password">123456</property><!-- 用户密码 -->
                <property name="schemas">TESTDB</property><!-- 逻辑数据库名 -->
                <property name="defaultSchema">TESTDB</property><!-- 默认逻辑数据库 -->
        </user>

        <user name="user"><!-- 其他用户 -->
                <property name="password">user</property>
                <property name="schemas">TESTDB</property>
                <property name="readOnly">true</property><!-- 是否只读 -->
                <property name="defaultSchema">TESTDB</property>
        </user>

```

schema.xml(此文件主要用于配置读写分离、分库分表、主从切换等策略)：
``` xml
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">
        <schema name="TESTDB" checkSQLschema="false" sqlMaxLimit="100"><!-- 逻辑数据库 -->
                <table name="test" primaryKey="id" dataNode="dn1"/><!-- 逻辑数据库表 -->
        </schema>

        <dataNode name="dn1" dataHost="localhost1" database="db" /><!-- 数据库节点，及对应的真实数据库名 -->

        <dataHost name="localhost1" maxCon="1000" minCon="10" balance="1" writeType="0" switchType="1" slaveThreshold="100" dbType="mysql" dbDriver="native"><!-- 数据库主机从机配置，balance属性代表不同的读写分离类型； writeType属性用于配置写操作的分配；switchType属性用于配置主从切换-->
                <heartbeat>select user()</heartbeat>
                <writeHost host="hostM1" url="192.168.19.127:3000" user="root" password="123456"><!-- 默认写主机，对应上文配置的master主机 -->
                        <readHost host="hostS1" url="192.168.19.127:3001" user="root" password="123456"/><!-- 读主机1，对应上文配置的slave1 -->
                        <readHost host="hostS2" url="192.168.19.127:3002" user="root" password="123456"/><!-- 读主机2，对应上文配置的slave2 -->
                </writeHost>
                <writeHost host="hostS1" url="192.168.19.127:3001" user="root" password="123456"/><!-- 如果默认写主机宕机，且switchType属性配置为自动切换，则启用该主机为写主机 -->
                <writeHost host="hostS2" url="192.168.19.127:3002" user="root" password="123456"/>
        </dataHost>
</mycat:schema>

```
配置文件改好后重启MyCat，通过mysql -h ip地址 -uroot -p123456 -P8066连接即可。MyCat的默认连接端口是8066，管理端口是9066。
