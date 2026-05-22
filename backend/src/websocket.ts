import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { Server } from "http";
import mongoose from "mongoose";


export type WebSocketMessageType = 
  | "chat_message"
  | "new_question"
  | "update_question"
  | "delete_question"
  | "new_answer"
  | "update_answer"
  | "delete_answer";


export interface WebSocketBase{
  type: WebSocketMessageType;
  message?: string;
}


export interface chatMessage extends WebSocketBase{
  type: "chat_message";
  message: string;
}

export interface newQuestionMessage extends WebSocketBase{
  type: "new_question";
  message: string;
}

export interface updateQuestionMessage extends WebSocketBase{
  type: "update_question";
  message: string;

}

export interface deleteQuestionMessage extends WebSocketBase{
  type: "delete_question";
  message: string;
}

export interface newAnswerMessage extends WebSocketBase{
  type: "new_answer";
  message: string;
}

export interface updateAnswerMessage extends WebSocketBase{
  type: "update_answer";
  message: string;
}

export interface deleteAnswerMessage extends WebSocketBase{
  type: "delete_answer";
  message: string;
  
}
