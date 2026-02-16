import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//ReactでAPIを呼び出すためにaxiosをインポート
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)
  
  //APIからのレスポンスを保存するためのstate
  const [message,setMessage] = useState("");

  //APIを呼び出す関数
  const fetchMessage = async () => {
    try{
      const res = await axios.get("http://localhost:3001/api/test");
      setMessage(res.data.message); //レスポンスからmessageをstateに保存
    }catch(err){
      console.error(err);
    }
  };
 
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      
      <div>
        <h1>React+Nodeの接続テスト</h1>
        <button onClick={fetchMessage}>サーバから取得</button>
        <p>{message}</p>
      </div>
    </>

  )
}

export default App
