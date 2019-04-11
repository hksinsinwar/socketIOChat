const redisAdapter = require('socket.io-redis');
const Redis = require('ioredis')

module.exports=function(io){

const startupNodes = [
    {
      port: 6380,
      host: '127.0.0.1'
    },
    {
      port: 6379,
      host: '127.0.0.1'
    },
    {
        port: 6381,
        host: '127.0.0.1'
      }

];
var redisCl=new Redis.Cluster(startupNodes)
redisCl.on("error",function(err){
    console.log("REDIS CONNECT error "+ err);
    console.log('node error', err.lastNodeError);
});
io.adapter(redisAdapter({
    pubClient: redisCl,
    subClient: redisCl
  }));
  
}