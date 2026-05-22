import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { Server } from "http";
import mongoose from "mongoose";


export type WebSocketMessageType = 
  | "chat_message"
  | "new_post"
  | "update_post"
  | "delete_post"
  | "new_comment"
  | "update_comment"
  | "delete_comment"
  | "new_answer"
  | "update_answer"
  | "delete_answer";


export interface WebSocketBase{
  type: WebSocketMessageType;
  message?: string;
}


export interface chatMessage extends WebSocketBase{

}

export interface newPostMessage extends WebSocketBase{

}

export interface updatePostMessage extends WebSocketBase{

}

export interface deletePostMessage extends WebSocketBase{

}

export interface newCommentMessage extends WebSocketBase{

}

export interface updateCommentMessage extends WebSocketBase{

}

export interface deleteCommentMessage extends WebSocketBase{

}

export interface newAnswerMessage extends WebSocketBase{

}

export interface updateAnswerMessage extends WebSocketBase{

}

export interface deleteAnswerMessage extends WebSocketBase{

}
