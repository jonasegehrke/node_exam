<script>
  export let firstName;
  export let lastName;
  export let email;
  export let phone;
</script>

<div id="card-lg" class="card-container">
  <div class="general-info">
    <h3 id="name">{firstName + " " + lastName}</h3>
  </div>

  <hr />

  <div class="contact-info">
    <h5 id="contact-heading">Kontakt</h5>
    <p>{email}</p>
    <p>{phone}</p>
  </div>
</div>

<style>
  .card-container {
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

  :global(#card-lg.inspect) {
    box-shadow: 0 0px 4px rgb(0 0 0 / 50%), 0 0px 16px rgb(0 0 0 / 50%);
    cursor: pointer;
    animation: fadeIn 1s;
    transition: all 0.5s ease-in-out;
  }



  .general-info {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;

    width: 100%;
  }

  #name {
    width: 50%;
  }





  .contact-info {
    display: flex;
    flex-flow: column;
    width: 100%;
  }

  #contact-heading {
    text-align: center;
  }

  hr {
    width: 100%;
    margin: 1em 0;
  }

  p {
    font-size: 0.8em;
  }
</style>
