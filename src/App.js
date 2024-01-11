import logo from './logo.svg';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"
import { useState } from 'react';

const API_KEY = "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";
const systemMessage = {
  role: "system",
  content: "Explain all concepts"
}

function App() {
  const [messages, setMessages] = useState([
    {
      message : "Hello i am ChatGPT, Ask me anything!",
      sender : "ChatGPT"
    }
  ]);
  
  const handleSend = async(message) =>{
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user"
    };
    const newMessages = [...messages,newMessage];
    setMessages(newMessages)
    await processMessageToChatGPT(newMessages)
  }

  async function processMessageToChatGPT(chatMessages){
    let apiMessages = chatMessages.map((messageObject) =>{
      let role = ""
      if(messageObject.sender === "ChatGPT"){
        role = "assistant"
      }else{
        role = "user"
      }
      return {role : role, content: messageObject.message}
    });


    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages":[
        systemMessage,
        ...apiMessages
      ]
    }



    await fetch("https://api.openai.com/v1/chat/completions",
    {
      method:"POST",
      headers:{
        "Authorization":"Bearer" + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data)=>{
      return data.json();
    }).then((data)=>{
      console.log(data);
      if (data.choices && data.choices.length > 0) {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
      } else {
        console.error("No choices in the response data");
      }
    });
  }

  return (
    <div className="App">
      <h1>Proptimize</h1>
      <div className='container'>

        <MainContainer>

        <ChatContainer>
          <MessageList>
            {messages.map((message,i)=>{
              console.log(message)  
              return <Message key={1} model = {message}/>
            }) }
          </MessageList>
          <MessageInput placeholder='Ask anything' onSend={handleSend}/>
        </ChatContainer>
        </MainContainer>
      </div>
      
    </div>
  );
}

export default App;
