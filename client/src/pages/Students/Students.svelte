<script>
  import { students, isAdmin } from "../../store/store";
  import StudentCard from "../../components/StudentCard.svelte";
  import { toasts } from "svelte-toasts";

  let allClasses = [];

  async function getAllStudents() {
    const response = await fetch("MYURL/api/students/", {
      credentials: "include",
    });

    const data = await response.json();
    students.set(data.data);
  }

  async function getAllClasses() {
    const resp = await fetch("MYURL/api/classes/", {
      credentials: "include",
    });

    const respData = await resp.json();

    allClasses = respData.data;
  }

  getAllStudents();
  getAllClasses();

  function handleFormOpen() {
    const form = document.getElementById("create-new-student");

    form.classList.toggle("hidden");
    form.classList.toggle("show");
  }

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  async function handleCreateStudent() {
    const firstName = document.getElementById("firstName-input");
    const lastName = document.getElementById("lastName-input");
    const email = document.getElementById("email-input");
    const phone = document.getElementById("phone-input");
    const address = document.getElementById("address-input");
    const classId = document.getElementById("className-select");

    if (
      firstName.value === "" ||
      lastName.value === "" ||
      address.value === "" ||
      classId.value === ""
    ) {
      toasts.error("Udfyld venligst alle felter korrekt");
      return;
    }

    if(phone.value.replace(/\s/g, "").length !== 8){
      toasts.error("Telefonnummer er ikke gyldig");
      return;
    }

    if (!validateEmail(email.value)) {
      toasts.error("Email er ikke gyldig");
      return;
    }

    const student = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      classId: classId.value,
    };

    try {
      await fetch("MYURL/api/students", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      })
        .then((response) => response.json())
        .then((responseText) => {
          if (responseText.success) {
            toasts.success("Elev er oprettet");
            getAllStudents();

            firstName.value = "";
            lastName.value = "";
            email.value = "";
            phone.value = "";
            address.value = "";
            classId.value = "";
          } else {
            toasts.error("Der skete en fejl");
          }
        });
    } catch (e) {
      toasts.error("Der skete en fejl");
    }
  }
</script>

<div class="container">
  {#if $isAdmin}
    <button on:click={handleFormOpen} id="open-new-student-form-btn"
      >Opret ny elev</button
    >
  {/if}
  <div id="create-new-student" class="hidden">
    <p>Fornavn</p>
    <input name="firstname" id="firstName-input" type="text" placeholder="Fornavn" />
    <p>Efternavn</p>
    <input id="lastName-input" type="text" placeholder="Efternavn" />
    <p>Email</p>
    <input id="email-input" type="text" placeholder="Email" />
    <p>Telefon</p>
    <input id="phone-input" type="tel" placeholder="12 34 56 78" />
    <p>Adresse</p>
    <input id="address-input" type="text" placeholder="Adresse" />
    <p>Klasse</p>
    <select name="className-select" id="className-select">
      {#each allClasses as className}
        <option value={className.classId}>{className.className}</option>
      {/each}
    </select>

    <button on:click={handleCreateStudent} id="create-student-btn">Opret</button
    >
  </div>
  {#each $students as student}
    <StudentCard
      firstName={student.firstName}
      lastName={student.lastName}
      studentNumber={student.studentNumber}
      className={student.className}
      email={student.email}
      phone={student.phone}
      address={student.address}
      showGrades={false}
      small={true}
    />
  {/each}
</div>

<style>
  .container {
    overflow: overlay;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  #open-new-student-form-btn,
  #create-student-btn {
    margin: 25px;
    outline: none;
    border: none;
    background: #1877f2;
    padding: 0.8rem 1rem;
    border-radius: 0.4rem;
    font-size: 1.1rem;
    color: #fff;
  }

  #open-new-student-form-btn:hover,
  #create-student-btn:hover {
    background: var(--color-blue-secondary);
    cursor: pointer;
  }

  #create-new-student {
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

  input,
  #className-select {
    outline: none;
    padding: 0.8rem 1rem;
    margin-bottom: 0.8rem;
    font-size: 1.1rem;
  }

  input:focus,
  #className-select:focus {
    border: 1.8px solid var(--color-blue-main);
  }

  #create-new-student.hidden {
    height: 0px;
    margin: 0px;
    padding: 0px;
    visibility: hidden;
  }

  :global(#create-new-student.show) {
    animation: fadeIn 0.5s;
    visibility: revert;
  }
</style>
