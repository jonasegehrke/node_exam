<script>
  export let firstName;
  export let lastName;
  export let studentNumber;
  export let className;
  export let email;
  export let phone;
  export let address;
  export let showGrades;
  export let dansk;
  export let engelsk;
  export let historie;
  export let matematik;
  export let geografi;

  export let small;

  //remove null values
  if (dansk == null) {
    dansk = "";
  }
  if (engelsk == null) {
    engelsk = "";
  }
  if (historie == null) {
    historie = "";
  }
  if (matematik == null) {
    matematik = "";
  }
  if (geografi == null) {
    geografi = "";
  }
</script>

{#if small}
 <div class="test"></div>
{:else}
<div class="card-container">
  <div class="general-info">
    <h3 id="name">{firstName + " " + lastName}</h3>
    <h5 id="student-number">{studentNumber}</h5>
    <p id="class">Klasse: {className}</p>
  </div>

  {#if showGrades}
    <hr />
    <div class="grades">
      <h5 id="grades-heading">Karakterer</h5>
      <p>Dansk: {dansk}</p>
      <p>Engelsk: {engelsk}</p>
      <p>Historie: {historie}</p>
      <p>Matematik: {matematik}</p>
      <p>Geografi: {geografi}</p>
    </div>
  {/if}

  <hr />

  <div class="contact-info">
    <h5 id="contact-heading">Kontakt</h5>
    <p>{email}</p>
    <p>{phone}</p>
    <p>{address}</p>
  </div>
</div>
{/if}

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

  .general-info {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;

    width: 100%;
  }

  #name {
    width: 50%;
  }
  #student-number {
    width: 50%;
    text-align: end;
  }

  .grades{
    display: flex;
    flex-flow: column;
    width: 100%;
  }

  #grades-heading {
    text-align: center;
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
