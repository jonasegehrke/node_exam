<script>
    import Lesson from './Lesson.svelte'
    import moment from 'moment';

    
    //change weekdays depending on week
    const week = {
        monday: moment().startOf('week').add('days', 1).format('YYYY-MM-DD'),
        tuesday: moment().startOf('week').add('days', 2).format('YYYY-MM-DD'),
        wednesday: moment().startOf('week').add('days', 3).format('YYYY-MM-DD'),
        thursday: moment().startOf('week').add('days', 4).format('YYYY-MM-DD'),
        friday: moment().startOf('week').add('days', 5).format('YYYY-MM-DD'),
    }
    

    
    console.log(week)
</script>

<div class="calendar-container">
  <div class="cols">
    <div class="time-col top-left-corner">Tidspunkt</div>
    <div>Mandag <br> {week.monday}</div>
    <div>Tirsdag <br> {week.tuesday}</div>
    <div>Onsdag <br> {week.wednesday}</div>
    <div>Torsdag <br> {week.thursday}</div>
    <div class="top-right-corner">Fredag <br> {week.friday}</div>
  </div>

  <div class="rows">

    <div class="time">8:30 - 10:00</div>
    <div class="time">10:15 - 11:45 </div>
    <div class="time">12:30 - 14:00</div>
    <div class="time bottom-left-corner">14:15 - 15:45</div>

    <div class="row-item"><Lesson subject="Dansk"/></div>
    <div class="row-item"><Lesson subject="Dansk"/></div>
    <div class="row-item"> </div>
    <div class="row-item"> </div>
    
    <div class="row-item"><Lesson subject="Matematik"/></div>
    <div class="row-item"><Lesson subject="Matematik"/></div>
    <div class="row-item"><Lesson subject="Dansk"/></div>
    <div class="row-item"><Lesson subject="Dansk"/></div>

    <div class="row-item"><Lesson subject="Geografi"/></div>
    <div class="row-item"><Lesson subject="Geografi"/></div>
    <div class="row-item"> </div>
    <div class="row-item"> </div>

    <div class="row-item"><Lesson subject="Historie"/></div>
    <div class="row-item"><Lesson subject="Historie"/></div>
    <div class="row-item"><Lesson subject="Engelsk"/></div>
    <div class="row-item"><Lesson subject="Engelsk"/></div>

    <div class="row-item"></div>
    <div class="row-item"></div>
    <div class="row-item"><Lesson subject="Engelsk"/></div>
    <div class="row-item bottom-right-corner"><Lesson subject="Engelsk" corner={true}/></div>

    
  </div>
</div>

<style>
  .calendar-container {
    width: 840px;
    background-color: #fff;
    background: #fff;
    font-size: 0.8em;
  
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
    font-family: var(--primary-font);
    margin: 25px 0;
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
  .cols {
    width: 100%;
    display: flex;
  }

  .cols div:not(.time-col) {
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

  .time-col{
    outline: 1px solid rgba(0, 0, 0, 0.7);
    overflow: hidden;
    height: 50px;
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    
  }

  .rows {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    
    max-height: 400px;
  }
  .row-item{
    outline: 1px solid rgba(0, 0, 0, 0.7);
    height: 100px;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #fff;
  }

  

  .time{
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
