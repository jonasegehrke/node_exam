<script>
  import { isLoggedIn, responseData, isAdmin } from "../../store/store";
  import { useNavigate, useLocation } from "svelte-navigator";
  import { toasts } from "svelte-toasts";

  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    if (username === "" || password === "") {
      toasts.error("Udfyld venligst både brugernavn og password");
      return;
    }

    const data = { username: username, password: password };

    try {
    await fetch("MYURL/api/auth", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        isLoggedIn.set(data.isLoggedIn);
        isAdmin.set(data.isAdmin);
        responseData.set(data);
      });

    if ($isLoggedIn) {
      toasts.success("Du er nu logget ind");
      navigate("/", {
        state: { from: $location.pathname },
        replace: true,
      });
    } else {
      toasts.error($responseData.message);
    }
  } catch (e) {
    toasts.error("For mange login forsøg, prøv igen senere")
  }
}

  const onKeyPress = (e) => {
    if (e.charCode === 13) {
      handleLogin();
    }
  };
</script>

<div class="welcome-container">
  <div class="content">
    <div class="heading-container">
      <h1 class="logo">PrettyIntra</h1>
      <p class="catchphrase">Bedste skoleintra i landet.</p>
    </div>

    <div class="login-container">
      <h2 class="form-heading">Log ind</h2>
      <input
        type="text"
        class="username"
        id="username"
        placeholder="Brugernavn"
        required
        on:keypress={onKeyPress}
      />
      <input
        type="password"
        class="password"
        id="password"
        placeholder="Adgangskode"
        on:keypress={onKeyPress}
      />
      <button on:click={handleLogin} class="login-btn">Log ind</button>
    </div>
  </div>
</div>

<style>
  .welcome-container {
    background: #f2f4f7;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .heading-container {
    padding-bottom: 50px;
  }

  @media (max-width: 1374px) {
    .heading-container {
      padding-bottom: 50px;
    }
  }

  .content {
    display: flex;
    width: 50%;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
  }

  .form-heading {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 1em;
    font-family: var(--primary-font);
    color: var(--color-blue-secondary);
  }

  .logo {
    color: var(--color-blue-main);
    font-family: var(--primary-font);
    font-size: 4em;
  }

  .catchphrase {
    font-family: var(--primary-font);
    font-weight: 200;
    font-size: 1.2em;
  }

  .login-container {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 2rem;
    width: 350px;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
  }

  input {
    outline: none;
    padding: 0.8rem 1rem;
    margin-bottom: 0.8rem;
    font-size: 1.1rem;
  }

  input:focus {
    border: 1.8px solid var(--color-blue-main);
  }

  .login-btn {
    outline: none;
    border: none;
    background: var(--color-blue-main);
    padding: 0.8rem 1rem;
    border-radius: 0.4rem;
    font-size: 1.1rem;
    color: #fff;
  }

  .login-btn:hover {
    background: var(--color-blue-secondary);
    cursor: pointer;
  }
</style>
