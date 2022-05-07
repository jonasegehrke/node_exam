<script>
  import { Router, Route } from "svelte-navigator";
  import { ToastContainer, FlatToast } from "svelte-toasts";
  import { isAdmin, isLoggedIn } from "./store/store";
  import Login from "./pages/Login/Login.svelte";
  import Home from "./pages/Home/Home.svelte";
  import Students from "./pages/Students/Students.svelte";
  import Absence from "./pages/Absence/Absence.svelte";
  import NavBar from "./components/NavBar.svelte";
  import PrivateRoute from "./components/PrivateRoute.svelte";
  import Logout from "./components/Logout.svelte";
  import Schedule from "./pages/Schedule/Schedule.svelte";
  import ChatBar from "./components/ChatBar.svelte";
 
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

      <PrivateRoute path="/students" let:location>
        <Students />
      </PrivateRoute>

      <PrivateRoute path="/absence" let:location>
        <Absence />
      </PrivateRoute>

      <PrivateRoute path="/schedule" let:location>
        <Schedule />
      </PrivateRoute>

  
      <Route path="/login">
        <Login />
      </Route>
   
      <Route path="/logout">
        <Logout />
      </Route>

      {#if $isLoggedIn}
        <ChatBar />
      {/if}

      <ToastContainer placement="bottom-left" let:data>
        <FlatToast {data} />
      </ToastContainer>
    </div>
  </main>
</Router>

<style>
  main {
    height: 100%;
  }
  .wrapper {
    height: 100%;
  }
</style>
