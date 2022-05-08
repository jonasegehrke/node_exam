<script>
  import ChatMessage from "./ChatMessage.svelte";
  import SearchSelect from "./SearchSelect.svelte";
  import { userData } from "../store/store";
  import moment from "moment";
  import { io } from "socket.io-client";

  const socket = io("MYURL");



  socket.on("connect", () => {
  });

  setTimeout(() => {

    const user = {
    userId: $userData.studentId,
  };
  socket.emit("update-client-socket-ids", user);
    
  }, 1000);
  


  let currentRecieverId = null;

  async function updateChatRoom(event) {
    //fetch pre messages
    currentRecieverId = event.detail.recieverId;

    const resp = await fetch(
      "MYURL/api/chat/" + $userData.studentId + "/" + currentRecieverId,
      {
        credentials: "include",
      }
    );

    const respData = await resp.json();

    //clear previous chat
    document.getElementById("chat").innerHTML = "";

    //Set new messages
    respData.forEach((message) => {
      let isYou = false;

      if (message.sender === $userData.studentId) isYou = true;

      new ChatMessage({
        target: document.getElementById("chat"),
        props: {
          senderIsYou: isYou,
          message: message.message,
        },
      });
    });

    //open chatroom
  }

  socket.on("receive-message", (message) => {
    if(message.senderId === currentRecieverId){
      receiveMessage(message);
    }else{
      //this should make a notification on the chaticon and let the user know who sent a message
      //createNotification(message);
    }
    
  });

  function receiveMessage(message) {
    const chat = document.getElementById("chat");

    new ChatMessage({
      target: chat,
      props: {
        senderIsYou: false,
        message: message.message,
      },
    });

    chat.scrollTop = chat.scrollHeight;
  }

  async function handleSendMessage() {
    //post
    if (currentRecieverId === null) return;

    const message = document.getElementById("message").value;
    const chat = document.getElementById("chat");

    if (message.length === 0) return;

    //Socket send
    const socketMessage = {
      message: message,
      senderId: $userData.studentId,
      receiverId: currentRecieverId,
    }

    socket.emit("send-message", socketMessage);

    //database send
    const data = {
      sender: $userData.studentId,
      reciever: currentRecieverId,
      message: message,
      messageSent: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    await fetch("MYURL/api/chat", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    new ChatMessage({
      target: chat,
      props: {
        senderIsYou: true,
        message: message,
      },
    });

    chat.scrollTop = chat.scrollHeight;
    document.querySelector("#message").value = "";
  }

  const onKeyPress = (e) => {
    if (e.charCode === 13) {
      handleSendMessage();
    }
  };
</script>

<div class="chat-container">
  <div class="header">
    <SearchSelect label={"Ny besked"} on:onSelect={updateChatRoom} />
  </div>

  <hr />

  <div id="chat" />
  <hr />
  <div class="send-message">
    <input
      id="message"
      type="text"
      placeholder="Skriv din besked her"
      autocomplete="off"
      on:keypress={onKeyPress}
    />
    <a id="send-message-btn" on:click={handleSendMessage}
      ><svg
        width="35px"
        height="31.5px"
        viewBox="0 0 20 18"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <title>send</title>
        <desc>Created with Sketch.</desc>
        <g
          id="Icons"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <g id="Rounded" transform="translate(-374.000000, -1529.000000)">
            <g id="Content" transform="translate(100.000000, 1428.000000)">
              <g
                id="-Round-/-Content-/-send"
                transform="translate(272.000000, 98.000000)"
              >
                <g>
                  <polygon id="Path" points="0 0 24 0 24 24 0 24" fill="none" />
                  <path
                    d="M3.4,20.4 L20.85,12.92 C21.66,12.57 21.66,11.43 20.85,11.08 L3.4,3.6 C2.74,3.31 2.01,3.8 2.01,4.51 L2,9.12 C2,9.62 2.37,10.05 2.87,10.11 L17,12 L2.87,13.88 C2.37,13.95 2,14.38 2,14.88 L2.01,19.49 C2.01,20.2 2.74,20.69 3.4,20.4 Z"
                    id="🔹Icon-Color"
                    fill="#4d709c"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg></a
    >
  </div>
</div>

<style>
  .send-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 13%;
  }

  #message {
    outline: none;
    padding: 5px;
    width: 80%;
    border-radius: 5px;
    border: none;
    height: 67%;
  }

  #message:focus {
    border: 1.8px solid var(--color-blue-main);
  }

  #send-message-btn {
    cursor: pointer;
    height: 35px;
    width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chat-container {
    height: 400px;
    width: 300px;
    margin-right: 100px;
    background-color: rgb(190, 190, 190);
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
    color: #fff;
    backdrop-filter: blur(10px);
  }

  #chat {
    font-family: var(--primary-font);
    color: #fff;
    display: flex;
    flex-direction: column;
    height: 70%;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }

  .header {
    width: 100%;
    min-height: 15%;
  }

  hr {
    margin: 2px;
  }
</style>
