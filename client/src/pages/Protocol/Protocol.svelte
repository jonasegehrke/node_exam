<script>
  import { currentClass, isLoggedIn, isAdmin } from "../../store/store";
  import { useNavigate, useLocation } from "svelte-navigator";
  import { toasts } from "svelte-toasts";
  import { onMount } from "svelte";
  import moment from "moment";

  let currentStudents = [];
  const navigate = useNavigate();
  const location = useLocation();

  //validate admin privileges
  async function validateAdmin() {
    const resp = await fetch("MYURL/api/login/status", {
      method: "POST",
      credentials: "include",
    });

    const respData = await resp.json();

    isLoggedIn.set(respData.isLoggedIn);
    isAdmin.set(respData.isAdmin);
  }
  onMount(async () => {
    await validateAdmin();
    if (!$isAdmin) {
      navigate("/", {
        state: { from: $location.pathname },
        replace: true,
      });
    }
    currentStudents = await getStudentsFromClass();
  });

  async function getStudentsFromClass() {
    const resp = await fetch(
      "MYURL/api/students/class/" + $currentClass.classId,
      {
        credentials: "include",
      }
    );

    const respData = await resp.json();

    return respData.data;
  }

  async function addAbsence() {
    const allCheckboxes = document.querySelectorAll(".checkbox");

    allCheckboxes.forEach(async (checkbox) => {
      const currentStudent = currentStudents.find(
        (student) => student.studentId === Number(checkbox.value)
      );

      if (!checkbox.checked) {
        if (
          currentStudent.lastAbsenceCheckDate === moment().format("YYYY-MM-DD")
        )
          return;

        currentStudent.absenceLessons += 1;
        currentStudent.lastAbsenceCheck = false;
        currentStudent.lastAbsenceCheckDate = moment().format("YYYY-MM-DD");
      } else {
        if (
          currentStudent.lastAbsenceCheckDate === moment().format("YYYY-MM-DD")
        ) {
          if (currentStudent.lastAbsenceCheck === 0) {
            currentStudent.absenceLessons -= 1;
          }
        }
        currentStudent.lastAbsenceCheck = true;
        currentStudent.lastAbsenceCheckDate = moment().format("YYYY-MM-DD");
      }

      await fetch("MYURL/api/students/absence/" + checkbox.value, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentStudent),
      });
    });
    currentStudents = await getStudentsFromClass();
    toasts.success("Fravær registreret");
  }
</script>

<div class="container">
  <table>
    <thead>
      <tr>
        <th>Navn</th>
        <th>Til stede</th>
      </tr>
    </thead>
    <tbody>
      {#each currentStudents as student}
        <tr>
          <td>{student.firstName + " " + student.lastName}</td>
          <td id="checkbox-td">
            {#if student.lastAbsenceCheckDate === moment().format("YYYY-MM-DD")}
              <input
                type="checkbox"
                class="checkbox"
                value={student.studentId}
                checked={student.lastAbsenceCheck}
              />
            {:else}
              <input
                type="checkbox"
                class="checkbox"
                value={student.studentId}
              />
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <button on:click={addAbsence} id="add-absence-btn">Gem</button>
</div>

<style>
  .container {
    overflow: overlay;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  table {
    width: 300px;
    border-collapse: collapse;
    margin: 50px auto;
  }
  tr:nth-of-type(odd) {
    background: #eee;
  }
  th {
    background: var(--nav-color);
    color: white;
    font-weight: bold;
  }

  td,
  th {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
    font-size: 18px;
  }

  #checkbox-td {
    text-align: center;
  }

  input {
    width: 25px;
    height: 25px;
  }

  #add-absence-btn {
    margin-bottom: 25px;
    outline: none;
    border: none;
    background: #1877f2;
    padding: 0.8rem 1rem;
    border-radius: 0.4rem;
    font-size: 1.1rem;
    color: #fff;
  }

  #add-absence-btn:hover {
    background: var(--color-blue-secondary);
    cursor: pointer;
  }
</style>
