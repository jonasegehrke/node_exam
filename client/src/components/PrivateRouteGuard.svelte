<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { isLoggedIn, isAdmin } from "../store/store";

   const navigate = useNavigate();
    const location = useLocation();

  async function validateLoginStatus(){
    const resp = await fetch("MYURL/api/login/status", {
      method: "POST",
      credentials: "include",
    });
    const respData = await resp.json();
    isLoggedIn.set(respData.isLoggedIn);
    isAdmin.set(respData.isAdmin);
  
    if ($isLoggedIn === false) {
      navigate("/login", {
        state: { from: $location.pathname },
        replace: true,
      });
    }
    }

    validateLoginStatus();
  
</script>

{#if $isLoggedIn}
  <slot />
{/if}
