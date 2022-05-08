<script>
  import { Link } from "svelte-navigator";
  import { isAdmin, classes, currentClass } from "../store/store";

  function handleChangeClass() {
    const selectedClassId = document.getElementById("select-class").value;

    const classRoom = $classes.find(
      (classRoom) => classRoom.classId === Number(selectedClassId)
    );

    currentClass.set(classRoom);

    window.location.reload();
  }
</script>

<nav>
  <div class="logo">
    <Link to="/" class="svelte-link logo-link">
      <svg
        height="50px"
        width="100%"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill="#fff"
          d="M318 123.645l-61.5 35.7-61.76-35.7 61.76-35.7zm93.68 54.19l-61.76 35.7 61.76 35.7 61.5-35.7zm-294.39 80.64l61.76 35.7 61.5-35.7-61.5-35.7zm139.52-80.57l-61.76 35.7 61.76 35.7 61.5-35.7zM31 298.365l62 35.69v-71l-62-35.65v71zm373-26l-62 35.69v70.94l62-35.66v-70.97zm-225.11-139.4l-61.76 35.7 61.76 35.7 61.5-35.7zM109 343.305l62 35.69v-70.94l-62-35.69v71zm225.41-120.45l-61.76 35.7 61.76 35.7 61.5-35.7zM249 353.055l-62-35.7v71l62 35.7v-71zm77-35.67l-61 35.67v70.94l61-35.66v-70.95zm8.07-184.5l-61.76 35.7 61.76 35.7 61.5-35.7zm-232.6 44.95l-61.77 35.7 61.76 35.7 61.5-35.7zM481 227.565l-61 35.66v70.94l61-35.66v-70.94zm-286.11 75.93l61.76 35.7 61.5-35.7-61.5-35.7z"
          class="cls-1"
        /></svg
      >
      <p class="brand-name">PrettyIntra</p>
    </Link>
  </div>
  <ul class="nav-links">
    <li class="nav-item">
      {#if $isAdmin && $currentClass !== null}
        <select on:change={handleChangeClass} name="class" id="select-class">
          <option class="option-class" value=""
            >{$currentClass.className}</option
          >

          {#each $classes as classRoom}
            {#if classRoom.classId !== $currentClass.classId}
              <option class="option-class" value={classRoom.classId}
                >{classRoom.className}</option
              >
            {/if}
          {/each}
        </select>
      {/if}
    </li>
    <li class="nav-item">
      <Link to="/" class="svelte-link">Forside</Link>
    </li>
    <li class="nav-item">
      <Link to="/schedule" class="svelte-link">Skema</Link>
    </li>
    <li class="nav-item">
      <Link to="/students" class="svelte-link">Elever</Link>
    </li>
    {#if !$isAdmin}
      <li class="nav-item">
        <Link to="/absence" class="svelte-link">Fravær</Link>
      </li>
    {/if}
    <li class="nav-item">
      <Link to="/logout" class="svelte-link">Log ud</Link>
    </li>
  </ul>
</nav>

<style>
  :global(.svelte-link) {
    color: var(--nav-font-color) !important;
    text-decoration: none !important;
  }

  :global(.logo-link) {
    display: flex;
    align-items: center;
  }

  :global(#select-class) {
    border: none;
    background-color: transparent;
    color: var(--nav-font-color);
    font-size: 1em;
    font-family: var(--primary-font);
  }

  :global(.option-class) {
    background-color: var(--nav-color);
  }

  .brand-name {
    margin-left: 20px;
    font-family: var(--primary-font);
    font-size: 0.8em;
  }

  nav {
    position: absolute;
    width: 100%;
    background-color: var(--nav-color);
    height: var(--nav-height);
  }

  .logo {
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 1%;
    transform: translate(-1%, -50%);
    display: flex;
    align-items: center;
  }

  .nav-links {
    height: 100%;
    font-family: var(--primary-font);
    font-size: 1em;
    display: flex;
    list-style: none;
    width: 50%;
    justify-content: space-around;
    align-items: center;
    margin-left: auto;
  }

  .nav-links .nav-item {
    transition: all 0.3s ease 0s;
    text-decoration: none;
    color: var(--nav-font-color);
  }
</style>
