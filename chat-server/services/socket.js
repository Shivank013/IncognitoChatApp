const { Server } = require("socket.io");
const Redis = require("ioredis");
const prismaClient = require("./prisma");
const { produceMessage } = require("./kafka");

const pub = new Redis({
  host: "redis-3e3dde48-sharmashivank905-chat-app.a.aivencloud.com",
  port: 10947,
  username: "default",
  password: "AVNS__brlTnNydlYJxIDk_dW",
});

const sub = new Redis({
  host: "redis-3e3dde48-sharmashivank905-chat-app.a.aivencloud.com",
  port: 10947,
  username: "default",
  password: "AVNS__brlTnNydlYJxIDk_dW",
});

class SocketService {
  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", async ({ message }) => {
        console.log("New Message Rec.", message);
        // publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("new message from redis", message);
        io.emit("message", message);
        await produceMessage(message);
        console.log("Message Produced to Kafka Broker");
      }
    });
  }

  get io() {
    return this._io;
  }
}

module.exports = SocketService;
