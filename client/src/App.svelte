<script>
  import { Router, Route, Link } from "svelte-navigator";
  import Login from "./pages/Login/Login.svelte";
  import Home from "./pages/Home/Home.svelte";
  import PrivateRoute from "./components/PrivateRoute.svelte";
  import Logout from "./components/Logout.svelte";
  import { ToastContainer, FlatToast } from "svelte-toasts";
  import { isLoggedIn } from "./store/store";
  import NavBar from './components/NavBar.svelte'
</script>

<Router>

  {#if $isLoggedIn}
    <NavBar />
  {/if}

  <main>
    <div class="wrapper">
      <PrivateRoute path="/" let:location>
        <Home />
      </PrivateRoute>

      <Route path="/login">
        <Login />
      </Route>
      <Route path="/logout">
        <Logout />
      </Route>

      <ToastContainer placement="bottom-right" let:data>
        <FlatToast {data} />
      </ToastContainer>
    </div>
  </main>
</Router>

<style>
	main{
		height: 100%;
	}
	.wrapper{
		height: 100%;
	}
</style>
