export type Message = {
  text?: string;
  audio?: string;
  time: string;
  color?: string;
  size?: string;
  sender: "me" | "other";
};

export type ChatMessageResponseAPI = {
  id:string;
  senderId:string;
  receiverId:string;
  text:string;
  textColor:string;
  textSize:string;
  createAt:string;  //〇〇:〇〇の形で整形します。
};
