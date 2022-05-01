<script>
  import { Link } from "svelte-navigator";
</script>

<nav>
  <ul class="nav-links">
    <li class="nav-item">
      <Link to="/logout" class="svelte-link">Logout</Link>
    </li>
  </ul>
</nav>

<style>

:global(.svelte-link) {
    color: var(--nav-font-color) !important;
    text-decoration: none !important;
  }

  nav{
    position: absolute;
    width: 100%;
    background-color: var(--color-blue-main);
    height: var(--nav-height);
  }

  .nav-links{
    height: 100%;
    font-size: 20px;
    display: flex;
    list-style: none;
    width: 40%;
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
