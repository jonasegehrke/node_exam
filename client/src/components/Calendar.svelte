<script>
  import { studentData } from "../store/store";
  import Lesson from "./Lesson.svelte";
  import moment from "moment";
  import { onMount } from "svelte";
  

  let week = {
    monday: moment().startOf("week").add("days", 1).format("YYYY-MM-DD"),
    tuesday: moment().startOf("week").add("days", 2).format("YYYY-MM-DD"),
    wednesday: moment().startOf("week").add("days", 3).format("YYYY-MM-DD"),
    thursday: moment().startOf("week").add("days", 4).format("YYYY-MM-DD"),
    friday: moment().startOf("week").add("days", 5).format("YYYY-MM-DD"),
  };

  async function getLessons() {
    const resp = await fetch(
      `MYURL/api/lessons/${$studentData.classId}/${week.monday}/${week.friday}`
    );
    const respData = await resp.json();
    return respData.data;
  }

  onMount(async () => {
    const lessons = await getLessons();
    updateCalendar(lessons);

  });

  async function handleCalendarBack() {
    week = {
      monday: moment(week.monday).subtract(7, "days").format("YYYY-MM-DD"),
      tuesday: moment(week.tuesday).subtract(7, "days").format("YYYY-MM-DD"),
      wednesday: moment(week.wednesday).subtract(7, "days").format("YYYY-MM-DD"),
      thursday: moment(week.thursday).subtract(7, "days").format("YYYY-MM-DD"),
      friday: moment(week.friday).subtract(7, "days").format("YYYY-MM-DD"),
    };

    //get lessons for each day
    const lessons = await getLessons();
    //update the calendar on the page
    updateCalendar(lessons);
  }

  async function handleCalendarForward() {
    week = {
      monday: moment(week.monday).add(7, "days").format("YYYY-MM-DD"),
      tuesday: moment(week.tuesday).add(7, "days").format("YYYY-MM-DD"),
      wednesday: moment(week.wednesday).add(7, "days").format("YYYY-MM-DD"),
      thursday: moment(week.thursday).add(7, "days").format("YYYY-MM-DD"),
      friday: moment(week.friday).add(7, "days").format("YYYY-MM-DD"),
    };

    //get lessons for each day
    const lessons = await getLessons();
    //update the calendar on the page
    updateCalendar(lessons);
  }

  function updateCalendar(lessons) {
    console.log(lessons)
    const cols = document.querySelectorAll(".col-item");
    //clear the calendar
    cols.forEach((col) => {
      col.innerHTML = "";
    });
    let currentColDay = 0;

    lessons.forEach((lesson, i) => {
      const day = moment(lesson.lessonDate).day();

      cols.forEach((col, j) => {
        if (j % 4 === 0) ++currentColDay;

        if (currentColDay === day) {
          if (Number(col.dataset.value) === lesson.lessonNumber) {
            new Lesson({
              target: col,
              props: {
                subject: lesson.lessonSubject,
              },
            });
          }
        }
      });
      currentColDay = 0;
    });
  }
</script>

<div class="calendar-container">
  <div class="calendar">
    <div class="rows">
      <div class="time-row top-left-corner">Tidspunkt</div>
      <div>Mandag <br /> {week.monday}</div>
      <div>Tirsdag <br /> {week.tuesday}</div>
      <div>Onsdag <br /> {week.wednesday}</div>
      <div>Torsdag <br /> {week.thursday}</div>
      <div class="top-right-corner">Fredag <br /> {week.friday}</div>
    </div>

    <div class="cols">
      <div class="time">08:30 - 10:00</div>
      <div class="time">10:15 - 11:45</div>
      <div class="time">12:30 - 14:00</div>
      <div class="time bottom-left-corner">14:15 - 15:45</div>

      <div class="col-item" data-value="1" />
      <div class="col-item" data-value="2" />
      <div class="col-item" data-value="3" />
      <div class="col-item" data-value="4" />

      <div class="col-item" data-value="1" />
      <div class="col-item" data-value="2" />
      <div class="col-item" data-value="3" />
      <div class="col-item" data-value="4" />

      <div class="col-item" data-value="1" />
      <div class="col-item" data-value="2" />
      <div class="col-item" data-value="3" />
      <div class="col-item" data-value="4" />

      <div class="col-item" data-value="1" />
      <div class="col-item" data-value="2" />
      <div class="col-item" data-value="3" />
      <div class="col-item" data-value="4" />

      <div class="col-item" data-value="1" />
      <div class="col-item" data-value="2" />
      <div class="col-item" data-value="3" />
      <div class="col-item bottom-right-corner" data-value="4" />
    </div>
  </div>
  <div class="buttons">
    <button id="left-btn" class="btn" on:click={handleCalendarBack}
      >&larr</button
    >
    <button id="right-btn" class="btn" on:click={handleCalendarForward}
      >&rarr</button
    >
  </div>
</div>

<style>
  .calendar-container {
    display: flex;

    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 50px;
    height: 25px;
    border-radius: 5px;
    border: none;
    background-color: var(--color-blue-main);
    color: #fff;
  }

  .btn:hover {
    background: var(--color-blue-secondary);
    cursor: pointer;
  }

  .calendar {
    width: 840px;
    background-color: #fff;
    background: #fff;
    font-size: 0.8em;

    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
    font-family: var(--primary-font);
    margin: 10px 0;
    height: 450px;
  }

  .top-left-corner {
    border-radius: 0.5rem 0 0 0;
  }

  .top-right-corner {
    border-radius: 0 0.5rem 0 0;
  }

  .bottom-right-corner {
    border-radius: 0 0 0.5rem 0;
  }

  .bottom-left-corner {
    border-radius: 0 0 0 0.5rem;
  }
  .rows {
    width: 100%;
    display: flex;
  }

  .rows div:not(.time-row) {
    outline: 1px solid rgba(0, 0, 0, 0.7);
    overflow: hidden;
    height: 50px;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #fff;
  }

  .time-row {
    outline: 1px solid rgba(0, 0, 0, 0.7);
    overflow: hidden;
    height: 50px;
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .cols {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    max-height: 400px;
  }
  .col-item {
    outline: 1px solid rgba(0, 0, 0, 0.7);
    height: 100px;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #fff;
  }

  .time {
    outline: 1px solid rgba(0, 0, 0, 0.7);
    overflow: hidden;
    height: 100px;
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }
</style>
