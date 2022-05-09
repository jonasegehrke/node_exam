<script>
  import {
    currentClass,
    isLoggedIn,
    isAdmin,
    students,
  } from "../../store/store";
  import { useNavigate, useLocation } from "svelte-navigator";
  import { toasts } from "svelte-toasts";
  import { onMount } from "svelte";

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

  async function addAbsence(){
      const allCheckboxes = document.querySelectorAll(".checkbox");
      const studentsWithAbsence = [];

        allCheckboxes.forEach((checkbox) => {
            if (!checkbox.checked) {
                studentsWithAbsence.push(checkbox.value);
            }
        });
        console.log(studentsWithAbsence);

        studentsWithAbsence.forEach( async (studentId) => {
            const currentStudent = currentStudents.find(student => student.studentId === Number(studentId));
            currentStudent.absenceLessons += 1;
            console.log(studentId)
            await fetch("MYURL/api/students/absence/" + studentId, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentStudent),
            });
        });

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
          <td id="checkbox-td"><input type="checkbox" value={student.studentId} class="checkbox" /></td>
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
