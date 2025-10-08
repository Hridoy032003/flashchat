import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server, Socket } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

interface ConnectedPairs {
  [key: string]: string;
}

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store waiting users
  let waitingUser: Socket | null = null;
  const connectedPairs = new Map<string, string>(); // Map to track paired users
  const rooms = new Map<string, Socket>(); // Map to track users in rooms

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Handle user looking for a match
    socket.on('find-peer', () => {
      console.log('User looking for peer:', socket.id);
      
      if (waitingUser && waitingUser.id !== socket.id) {
        // Match with waiting user
        const peer1 = waitingUser;
        const peer2 = socket;
        
        // Store the pair
        connectedPairs.set(peer1.id, peer2.id);
        connectedPairs.set(peer2.id, peer1.id);
        
        // Notify both users that they're matched
        peer1.emit('peer-matched', { peerId: peer2.id, initiator: true });
        peer2.emit('peer-matched', { peerId: peer1.id, initiator: false });
        
        console.log('Matched:', peer1.id, 'with', peer2.id);
        waitingUser = null;
      } else {
        // No one waiting, this user becomes the waiting user
        waitingUser = socket;
        socket.emit('waiting');
      }
    });

    // Handle joining a specific room
    socket.on('join-room', (roomId: string) => {
      console.log('User trying to join room:', socket.id, roomId);
      
      const existingUser = rooms.get(roomId);
      
      if (existingUser && existingUser.id !== socket.id) {
        // Another user is waiting in this room
        const peer1 = existingUser;
        const peer2 = socket;
        
        // Store the pair
        connectedPairs.set(peer1.id, peer2.id);
        connectedPairs.set(peer2.id, peer1.id);
        
        // Remove from rooms
        rooms.delete(roomId);
        
        // Notify both users that they're matched
        peer1.emit('peer-matched', { peerId: peer2.id, initiator: true, roomId });
        peer2.emit('peer-matched', { peerId: peer1.id, initiator: false, roomId });
        
        console.log('Room matched:', peer1.id, 'with', peer2.id, 'in room', roomId);
      } else {
        // This user is the first in the room
        rooms.set(roomId, socket);
        socket.emit('room-waiting', { roomId });
        console.log('User waiting in room:', roomId);
      }
    });

    // Handle leaving a room
    socket.on('leave-room', (roomId: string) => {
      if (rooms.get(roomId)?.id === socket.id) {
        rooms.delete(roomId);
        console.log('User left room:', roomId);
      }
    });

    // Handle WebRTC signaling
    socket.on('signal', (data: { signal: any }) => {
      const targetId = connectedPairs.get(socket.id);
      if (targetId) {
        io.to(targetId).emit('signal', {
          signal: data.signal,
          from: socket.id
        });
      }
    });

    // Handle chat messages
    socket.on('chat-message', (message: string) => {
      const targetId = connectedPairs.get(socket.id);
      if (targetId) {
        io.to(targetId).emit('chat-message', {
          message: message,
          from: socket.id
        });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', () => {
      const targetId = connectedPairs.get(socket.id);
      if (targetId) {
        io.to(targetId).emit('typing-start');
      }
    });

    socket.on('typing-stop', () => {
      const targetId = connectedPairs.get(socket.id);
      if (targetId) {
        io.to(targetId).emit('typing-stop');
      }
    });

    // Handle skip/disconnect
    socket.on('skip', () => {
      handleDisconnect(socket);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      handleDisconnect(socket);
    });

    function handleDisconnect(socket: Socket) {
      // If this user was waiting, clear them
      if (waitingUser && waitingUser.id === socket.id) {
        waitingUser = null;
      }

      // Remove from any room
      for (const [roomId, roomSocket] of rooms.entries()) {
        if (roomSocket.id === socket.id) {
          rooms.delete(roomId);
          break;
        }
      }

      // Notify paired user about disconnection
      const pairedUserId = connectedPairs.get(socket.id);
      if (pairedUserId) {
        io.to(pairedUserId).emit('peer-disconnected');
        connectedPairs.delete(pairedUserId);
        connectedPairs.delete(socket.id);
      }
    }
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
