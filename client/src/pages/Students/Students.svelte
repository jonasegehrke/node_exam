<script>
  import { students } from "../../store/store";
  import StudentCard from "../../components/StudentCard.svelte";

  async function getAllStudents() {
    const response = await fetch("MYURL/api/students/", {
      credentials: "include",
    });
    
    const data = await response.json();
    students.set(data.data);
  }

  getAllStudents();

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
.container{
    overflow: overlay;
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>
