const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    const roomId = sortedIds.join("_");
    const secret = process.env.ROOM_SECRET || "devtinder_room_secret";
    return crypto.createHmac("sha256", secret).update(roomId).digest("hex");
};

const initilizeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: [
                 "http://localhost:5173",
             ],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected: " + socket.id);

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });

        socket.on("sendMessage", ({ roomId, message }) => {
            console.log(`Received message for room ${roomId}: ${message}`);
            socket.to(roomId).emit("receiveMessage", message);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected: " + socket.id);
        });
    });
};

module.exports = { initilizeSocket, getSecretRoomId };