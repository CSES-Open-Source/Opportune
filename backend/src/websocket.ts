import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { Server } from "http";
import mongoose from "mongoose";
import Question from "./models/Questions";
import Answer from "./models/Answers";

export type WebSocketMessageType =
  | "new_question"
  | "update_question"
  | "delete_question"
  | "new_answer"
  | "update_answer"
  | "delete_answer"
  | "error";

export interface WebSocketBase {
  type: WebSocketMessageType;
}

export interface newQuestionMessage extends WebSocketBase {
  type: "new_question";
  questionTitle: string;
  questionContent: string;
  userId: string;
}

export interface updateQuestionMessage extends WebSocketBase {
  type: "update_question";
  questionId: string;
  questionTitle?: string;
  questionContent?: string;
}

export interface deleteQuestionMessage extends WebSocketBase {
  type: "delete_question";
  questionId: string;
}

export interface newAnswerMessage extends WebSocketBase {
  type: "new_answer";
  questionId: string;
  answerContent: string;
  userId: string;
}

export interface updateAnswerMessage extends WebSocketBase {
  type: "update_answer";
  answerId: string;
  answerContent: string;
}

export interface deleteAnswerMessage extends WebSocketBase {
  type: "delete_answer";
  answerId: string;
  questionId: string;
}

export type WebSocketMessage =
  | newQuestionMessage
  | updateQuestionMessage
  | deleteQuestionMessage
  | newAnswerMessage
  | updateAnswerMessage
  | deleteAnswerMessage;

function isNewQuestion(data: unknown): data is newQuestionMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as newQuestionMessage).type === "new_question" &&
    typeof (data as newQuestionMessage).questionTitle === "string" &&
    typeof (data as newQuestionMessage).questionContent === "string" &&
    typeof (data as newQuestionMessage).userId === "string"
  );
}

function isUpdateQuestion(data: unknown): data is updateQuestionMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as updateQuestionMessage).type === "update_question" &&
    typeof (data as updateQuestionMessage).questionId === "string"
  );
}

function isDeleteQuestion(data: unknown): data is deleteQuestionMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as deleteQuestionMessage).type === "delete_question" &&
    typeof (data as deleteQuestionMessage).questionId === "string"
  );
}

function isNewAnswer(data: unknown): data is newAnswerMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as newAnswerMessage).type === "new_answer" &&
    typeof (data as newAnswerMessage).questionId === "string" &&
    typeof (data as newAnswerMessage).answerContent === "string" &&
    typeof (data as newAnswerMessage).userId === "string"
  );
}

function isUpdateAnswer(data: unknown): data is updateAnswerMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as updateAnswerMessage).type === "update_answer" &&
    typeof (data as updateAnswerMessage).answerId === "string" &&
    typeof (data as updateAnswerMessage).answerContent === "string"
  );
}

function isDeleteAnswer(data: unknown): data is deleteAnswerMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as deleteAnswerMessage).type === "delete_answer" &&
    typeof (data as deleteAnswerMessage).answerId === "string" &&
    typeof (data as deleteAnswerMessage).questionId === "string"
  );
}

const forumClients = new Set<WebSocket>();

const threadClients = new Map<string, Set<WebSocket>>();

function broadcastToForum(message: object): void {
  const payload = JSON.stringify(message);
  for (const client of forumClients) {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  }
}

function broadcastToThread(questionId: string, message: object): void {
  const clients = threadClients.get(questionId);
  if (!clients) return;
  const payload = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  }
}

export function initWebSocket(server: Server): void {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const threadId = url.searchParams.get("threadId");

    forumClients.add(ws);

    if (threadId) {
      if (!threadClients.has(threadId)) threadClients.set(threadId, new Set());
      threadClients.get(threadId)!.add(ws);
    }

    ws.on("message", (raw) => {
      void (async () => {
        try {
          const parsed: unknown = JSON.parse(raw.toString());

          if (isNewQuestion(parsed)) {
            const question = await Question.create({
              questionTitle: parsed.questionTitle,
              questionContent: parsed.questionContent,
              userId: parsed.userId,
            });
            broadcastToForum({ type: "new_question", question });
          } else if (isUpdateQuestion(parsed)) {
            if (!mongoose.isValidObjectId(parsed.questionId))
              throw new Error("Invalid question ID");
            const question = await Question.findByIdAndUpdate(
              parsed.questionId,
              {
                questionTitle: parsed.questionTitle,
                questionContent: parsed.questionContent,
              },
              { new: true, runValidators: true },
            );
            if (!question) throw new Error("Question not found");
            broadcastToForum({ type: "update_question", question });
            broadcastToThread(parsed.questionId, {
              type: "update_question",
              question,
            });
          } else if (isDeleteQuestion(parsed)) {
            if (!mongoose.isValidObjectId(parsed.questionId))
              throw new Error("Invalid question ID");
            const question = await Question.findById(parsed.questionId);
            if (!question) throw new Error("Question not found");
            await Answer.deleteMany({ _id: { $in: question.answers } });
            await question.deleteOne();
            broadcastToForum({
              type: "delete_question",
              questionId: parsed.questionId,
            });
            broadcastToThread(parsed.questionId, {
              type: "delete_question",
              questionId: parsed.questionId,
            });
          } else if (isNewAnswer(parsed)) {
            if (!mongoose.isValidObjectId(parsed.questionId))
              throw new Error("Invalid question ID");
            const question = await Question.findById(parsed.questionId);
            if (!question) throw new Error("Question not found");
            const answer = await Answer.create({
              userId: parsed.userId,
              answerContent: parsed.answerContent,
            });
            question.answers.push(answer._id);
            await question.save();
            broadcastToThread(parsed.questionId, {
              type: "new_answer",
              answer,
              questionId: parsed.questionId,
            });
          } else if (isUpdateAnswer(parsed)) {
            if (!mongoose.isValidObjectId(parsed.answerId))
              throw new Error("Invalid answer ID");
            const answer = await Answer.findByIdAndUpdate(
              parsed.answerId,
              { answerContent: parsed.answerContent },
              { new: true, runValidators: true },
            );
            if (!answer) throw new Error("Answer not found");
            // Broadcast to all threads — simpler than tracking which thread the answer belongs to
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN)
                client.send(JSON.stringify({ type: "update_answer", answer }));
            });
          } else if (isDeleteAnswer(parsed)) {
            if (!mongoose.isValidObjectId(parsed.answerId))
              throw new Error("Invalid answer ID");
            await Answer.findByIdAndDelete(parsed.answerId);
            broadcastToThread(parsed.questionId, {
              type: "delete_answer",
              answerId: parsed.answerId,
            });
          } else {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Unrecognized message type",
              }),
            );
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Internal error";
          ws.send(JSON.stringify({ type: "error", message }));
        }
      })();
    });

    ws.on("close", () => {
      forumClients.delete(ws);
      if (threadId) threadClients.get(threadId)?.delete(ws);
    });

    ws.on("error", (err) => console.error("WebSocket error:", err));
  });

  console.log("WebSocket server initialized.");
}
