<script>
  import ChatMessage from "./ChatMessage.svelte";
  import SearchSelect from "./SearchSelect.svelte";
</script>

<div class="chat-container">
  <div class="header">
    <h4>Ny besked</h4>
    <SearchSelect />
  </div>

  <hr />

  <div class="chat">
    <ChatMessage senderIsYou={true} message={"hey"} />

    <ChatMessage senderIsYou={false} message={"hey"} />
  </div>
</div>

<style>
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

  .chat-container h4 {
    font-family: var(--primary-font);
    color: #000000;
    margin-bottom: 5px;
  }

  .chat {
    font-family: var(--primary-font);
    color: #fff;
    display: flex;
    flex-direction: column;
    height: 80%;
    overflow-y: scroll;
  }

  .header {
    width: 100%;
  }

  hr {
    margin: 5px;
  }
</style>
