<script>
  import {
    userData,
    posts,
    isAdmin,
    classes,
    currentClass,
  } from "../../store/store";
  import Post from "../../components/Post.svelte";
  import StudentCard from "../../components/StudentCard.svelte";
  import TeacherCard from "../../components/TeacherCard.svelte";
  import { onMount } from "svelte";
  import moment from "moment";
  import { toasts } from "svelte-toasts";

  let mounted = false;
  onMount(async () => {
    if ($isAdmin) {
      await getTeacherData();
    } else {
      await getStudentData();
    }
    await getPosts();
    mounted = true;
  });

  //Get teacher data
  async function getTeacherData() {
    const resp = await fetch("MYURL/api/teacher/user", {
      credentials: "include",
    });
    const respData = await resp.json();
    userData.set(respData.teacherData);
    classes.set(respData.classes);

    if ($currentClass === null) {
      currentClass.set(respData.classes[0]);
    }
  }
  //Get student data
  async function getStudentData() {
    const response = await fetch("MYURL/api/students/user", {
      credentials: "include",
    });
    const data = await response.json();
    userData.set(data.data);

    const classRoom = {
      className: data.data.className,
      classId: data.data.classId,
    };
    currentClass.set(classRoom);

  }

  //Get posts for the students class
  async function getPosts() {
    const response = await fetch("MYURL/api/posts/" + $currentClass.classId, {
      credentials: "include",
    });
    const data = await response.json();
    posts.set(data.data);

  }

  function handleFormOpen() {
    const form = document.getElementById("create-post");

    form.classList.toggle("hidden");
    form.classList.toggle("show");
  }

  async function handleSendPost() {
    const title = document.getElementById("title-input");
    const content = document.getElementById("content-input");
    const created = moment().format("YYYY-MM-DD HH:mm:ss");
    const studentName = $userData.firstName + " " + $userData.lastName;
    const classId = $currentClass.classId;

    if (title.value === "" || content.value === "") {
      toasts.error("Udfyld venligst både titel og indhold");
      return;
    }

    const post = {
      title: title.value,
      content: content.value,
      created: created,
      studentName: studentName,
      classId: classId,
    };

    try {
      await fetch("MYURL/api/posts", {
        method: "POST",
        body: JSON.stringify(post),
        headers: { "Content-type": "application/json; charset=UTF-8" },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((responseText) => {
          if (responseText.success) {
            toasts.success("Dit opslag er nu oprettet");
            getPosts();

            title.value = "";
            content.value = "";
          } else {
            toasts.error("Der skete en fejl");
          }
        });
    } catch (e) {
      toasts.error("Der skete en fejl");
    }
  }
</script>

{#if mounted}
  <div class="container">
    <div class="posts">
      <div class="header-container">
        <button on:click={handleFormOpen} id="open-form-btn"
          >Opret opslag</button
        >
        <h1>{$currentClass.className}'s opslagstavle</h1>
      </div>
      <div id="create-post" class="hidden">
        <input id="title-input" type="text" placeholder="Titel" />
        <textarea
          type="text"
          id="content-input"
          cols="40"
          rows="8"
          placeholder="Besked"
        />

        <button on:click={handleSendPost} id="send-post-btn">Slå op</button>
      </div>

      {#each $posts as post}
        <Post
          title={post.title}
          content={post.content}
          creator={post.studentName}
          timestamp={post.created}
        />
      {/each}
    </div>
    <div class="student-info">
      {#if $isAdmin}
        <TeacherCard
          firstName={$userData.firstName}
          lastName={$userData.lastName}
          email={$userData.email}
          phone={$userData.phone}
        />
      {:else}
        <StudentCard
          firstName={$userData.firstName}
          lastName={$userData.lastName}
          studentNumber={$userData.studentNumber}
          className={$userData.className}
          email={$userData.email}
          phone={$userData.phone}
          address={$userData.address}
          showGrades={true}
          dansk={$userData.dansk}
          engelsk={$userData.engelsk}
          historie={$userData.historie}
          matematik={$userData.matematik}
          geografi={$userData.geografi}
          small={false}
        />
      {/if}
    </div>
  </div>
{/if}

<style>
  .container {
    overflow: overlay;
    display: flex;
    justify-content: space-evenly;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
  }
  .header-container h1 {
    display: flex;
    align-items: flex-end;
    font-family: var(--primary-font);
  }

  #create-post {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 2rem;
    width: 500px;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
    font-family: var(--primary-font);
    margin: 25px 0;
  }

  #title-input {
    outline: none;
    padding: 0.8rem 1rem;
    margin-bottom: 0.8rem;
    font-size: 1.1rem;
  }

  #title-input:focus {
    border: 1.8px solid var(--color-blue-main);
  }

  #content-input {
    outline: none;
    padding: 0.8rem 1rem;
    margin-bottom: 0.8rem;
    font-size: 0.8rem;
    resize: none;
  }

  #content-input:focus {
    border: 1.8px solid var(--color-blue-main);
  }

  #create-post > * {
    font-family: var(--primary-font);
    margin: 0.5rem;
  }

  #create-post.hidden {
    height: 0px;
    margin: 0px;
    padding: 0px;
    visibility: hidden;
  }

  :global(#create-post.show) {
    animation: fadeIn 0.5s;
    visibility: revert;
  }

  #send-post-btn {
    outline: none;
    border: none;
    background: #1877f2;
    padding: 0.8rem 1rem;
    border-radius: 0.4rem;
    font-size: 1.1rem;
    color: #fff;
  }

  #send-post-btn:hover {
    background: var(--color-blue-secondary);
    cursor: pointer;
  }

  #open-form-btn {
    margin-top: 25px;
    outline: none;
    border: none;
    background: #1877f2;
    padding: 0.8rem 1rem;
    border-radius: 0.4rem;
    font-size: 1.1rem;
    color: #fff;
  }

  #open-form-btn:hover {
    background: var(--color-blue-secondary);
    cursor: pointer;
  }
</style>
