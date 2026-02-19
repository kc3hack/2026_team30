//Reactに送るDTO
export interface ReactRequestDTO {
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

//Reactから貰うDTO(テキスト)
export interface ReactResponseTextDTO {
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

//Reactから貰うDTO(音声)
export interface ReactResponseAudioDTO {
  id: string;
  senderId: string;
  receiverId: string;
  //audioIdはNodeで生成
  audioPath: string;
  createdAt: Date;
}