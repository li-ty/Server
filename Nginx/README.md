![image](https://user-images.githubusercontent.com/26899221/164879440-a756e791-ccda-4302-8d9e-6693866d6d11.png)
# 目录结构
## conf  

用来存放配置文件相关  

## html  

用来存放静态文件的默认目录 html、css等  

## sbin  

nginx的主程序  

# 基本运行原理
![image](https://user-images.githubusercontent.com/26899221/164879588-1c66c75e-ffa4-44e8-b99f-b5308ee41a44.png)

# Nginx配置与应用场景
## 最小配置
worker_processes  

worker_processes 1; 默认为1，表示开启一个业务进程  

worker_connections  

worker_connections 1024; 单个业务进程可接受连接数  

include mime.types;  

include mime.types; 引入http mime类型  

default_type application/octet-stream;  

default_type application/octet-stream; 如果mime类型没匹配上，默认使用二进制流的方式传输。  

sendfile on;  

sendfile on; 使用linux的 sendfile(socket, file, len) 高效网络传输，也就是数据0拷贝。  

未开启sendfile  
![image](https://user-images.githubusercontent.com/26899221/164879677-ec99e5d9-a6ff-4a41-992d-759122541f99.png)
开启后
![image](https://user-images.githubusercontent.com/26899221/164879781-5bcb4799-64c4-4c34-9860-7436e7df6b8e.png)

server
![image](https://user-images.githubusercontent.com/26899221/164882147-a18ecd59-c2f7-4250-92bc-a1379d636643.png)

虚拟主机配置  
```
server {
  listen 80; 监听端口号
  server_name localhost; 主机名
  location / { 匹配路径
    root html; 文件根目录
    index index.html index.htm; 默认页名称
  }
  error_page 500 502 503 504 /50x.html; 报错编码对应页面
  location = /50x.html {
    root html;
  }
}
```

## 虚拟主机
原本一台服务器只能对应一个站点，通过虚拟主机技术可以虚拟化成多个站点同时对外提供服务
### servername匹配规则
我们需要注意的是servername匹配分先后顺序，写在前面的匹配上就不会继续往下匹配了。
### 完整匹配
我们可以在同一servername中匹配多个域名  
```
server_name vod.mmban.com www1.mmban.com;
```
### 通配符匹配
```
server_name *.mmban.com
```
### 通配符结束匹配
```
server_name vod.*;
```
### 正则匹配
```
server_name ~^[0-9]+\.mmban\.com$;
```
# 反向代理
proxy_pass http://baidu.com;
```
location / {
  proxy_pass http://atguigu.com/;
}
```
# 基于反向代理的负载均衡
```
upstream httpd {
  server 192.168.44.102:80;
  server 192.168.43.103:80;
}
```
## 负载均衡策略
### 轮询
默认情况下使用轮询方式，逐一转发，这种方式适用于无状态请求。
### weight(权重)
指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。
```
upstream httpd {
  server 127.0.0.1:8050 weight=10 down;
  server 127.0.0.1:8060 weight=1;
  server 127.0.0.1:8060 weight=1 backup;
}
```
- down：表示当前的server暂时不参与负载
- weight：默认为1.weight越大，负载的权重就越大。
- backup： 其它所有的非backup机器down或者忙的时候，请求backup机器。
### ip_hash
根据客户端的ip地址转发同一台服务器，可以保持回话。
### least_conn
最少连接访问
### url_hash
根据用户访问的url定向转发请求
### fair
根据后端服务器响应时间转发请求
