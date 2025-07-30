import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';

const socket = (io: Server) => {
  io.on('connection', socket => {
    socket.emit('i-active',"I am id")
    
    logger.info(colors.blue('A user connected'));

    //disconnect
    socket.on('disconnect', (socker) => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
