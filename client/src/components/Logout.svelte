<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { isLoggedIn } from '../store/store';
    import { toasts } from "svelte-toasts";
  
    const navigate = useNavigate();
    const location = useLocation();
  
    isLoggedIn.set(false);
  
    $: if ($isLoggedIn === false) {
      toasts.info("Du er nu logget ud");
      navigate("/login", {
        state: { from: $location.pathname },
        replace: true,
      });
    }
  </script>
  
  {#if $isLoggedIn}
    <slot />
  {/if}
  