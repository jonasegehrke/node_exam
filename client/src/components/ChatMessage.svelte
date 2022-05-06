<script>
  export let senderIsYou;
  export let message;
</script>

{#if senderIsYou}
  <div class="from-you">
    <p>{message}</p>
  </div>
{:else}
  <div class="from-other">
    <p>{message}</p>
  </div>
{/if}

<style>
    .from-you {
    background: var(--color-blue-main);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-right: 10px;
    max-width: 80%;
    align-self: flex-end;
  }

  .from-other {
    background: #202020;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    max-width: 80%;
    align-self: flex-start;
    word-break: break-all;
  }
</style>
