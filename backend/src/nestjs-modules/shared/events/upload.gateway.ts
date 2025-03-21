import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CsvImportParentOutput } from '../../upload-users/queues/create/create-import-csv.processor';

@WebSocketGateway({
  cors: {
    origin: '*', // HOTFIX: Corrigir depois puxando de variável de ambiente.
  },
})
export class UploadGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(UploadGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const flowId = client.handshake.query.flowId as string;
    if (flowId) {
      client.join(flowId);
      this.logger.log(`Cliente ${client.id} conectado ao flowId=${flowId}`);
    } else {
      this.logger.warn(`Cliente ${client.id} conectado sem flowId!`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }
  emitProgress(flowId: string, progress: number) {
    this.server.emit('upload-progress', { flowId, progress });
    this.server.to(flowId).emit('upload-progress', { flowId, progress });
  }

  emitChunkCompleted(flowId: string, chunkIndex: number) {
    this.server.emit('chunk-completed', { flowId, chunkIndex });
    this.server.to(flowId).emit('chunk-completed', { flowId, chunkIndex });
  }

  emitFinished(jobId: string, returnvalue: CsvImportParentOutput) {
    this.server.emit('upload-finished', {
      jobId: jobId,
      result: returnvalue,
    });
    this.server.to(returnvalue.flowId).emit('upload-finished', {
      jobId: jobId,
      result: returnvalue,
    });
  }
  @SubscribeMessage('join-flow')
  joinFlow(@MessageBody() data: { flowId: string }, client: Socket) {
    if (data.flowId) {
      client.join(data.flowId);
      this.logger.log(
        `Cliente ${client.id} entrou no flow ${data.flowId} via subscribeMessage`,
      );
    }
  }
}
