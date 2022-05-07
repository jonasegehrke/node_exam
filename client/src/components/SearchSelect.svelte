<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let recieverId = null;

  function onSelect(){
    dispatch('onSelect',{
      recieverId: recieverId,
    });
  }

  export let label;


  

  async function getSearchResults() {
    const search = document.getElementById("search").value;
    const resp = await fetch("MYURL/api/students/" + search, {
      credentials: "include",
    });
    const respData = await resp.json();

    document.getElementById("datalist").innerHTML = "";

    respData.data.forEach((student) => {
      const option = document.createElement("span");
      option.value = student.studentId;
      option.innerHTML = student.firstName + " " + student.lastName;
      option.classList.add("search-result");
      option.addEventListener("click", () => {
        document.getElementById("search").value = "";
        document.getElementById("datalist").innerHTML = "";
        document.getElementById("label").innerHTML =
          "Chat med: " + student.firstName + " " + student.lastName;
        recieverId = option.value;
        onSelect();
        
      });
      document.getElementById("datalist").appendChild(option);
    });
  }
</script>

<h4 id="label">{label}</h4>
<input
  type="text"
  id="search"
  placeholder="Modtager"
  autocomplete="off"
  on:input={getSearchResults}
/>
<div id="datalist" />

<style>
  #datalist {
    background: #3d3d3d;
    display: block;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
  }

  :global(.search-result) {
    cursor: pointer;
    width: 100%;
    padding: 10px;
  }

  #search {
    outline: none;
    padding: 5px;
    width: 100%;
    border-radius: 5px;
    border: none;
  }

  #search:focus {
    border: 1.8px solid var(--color-blue-main);
  }

  #label{
    font-family: var(--primary-font);
    color: #000000;
    margin-bottom: 5px;
  }
</style>
