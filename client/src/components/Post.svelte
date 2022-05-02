<script>
  export let title;
  export let content;
  export let creator;
  export let timestamp;
</script>

<div class="post-container">
  <h3 id="title">{title}</h3>
  <h4 id="creator">{creator}</h4>
  <p id="content">{content}</p>
  <p id="timestamp">{timestamp}</p>
</div>

<style>
  .post-container {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    background: #fff;
    padding: 2rem;
    width: 500px;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
    font-family: var(--primary-font);
    margin: 25px 0;
  }

  #title {
    margin-bottom: 1em;
    width: 50%;
  }

  #content {
    font-size: 0.8em;
  }

  #creator {
    width: 50%;
    text-align: end;
    font-size: 0.8em;
  }

  #creator,
  #timestamp {
    opacity: 0.5;
  }

  #timestamp {
    width: 100%;
    text-align: end;
    margin-top: 1em;
    font-size: 0.6em;
  }
</style>
