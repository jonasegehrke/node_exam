<script>
  import { students } from "../../store/store";
  import StudentCard from "../../components/StudentCard.svelte";

  async function getAllStudents() {
    const response = await fetch("http://localhost:3000/api/students/");
    const data = await response.json();

    students.set(data.data);
  }

  getAllStudents();

  console.log($students)
</script>
<div class="container">
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

</style>
