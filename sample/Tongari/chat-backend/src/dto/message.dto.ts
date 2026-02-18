//React向けDTO
export interface ChatMessageDTO {
  id: string;
  
  senderId: string;
  receiverId: string;

  text: string;

  style: {
    fontSize: number;
    color: string;
  };

  createdAt: Date;
}