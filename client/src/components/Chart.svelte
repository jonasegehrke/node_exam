<script>
  import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle,
  } from "chart.js";

  Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
  );
  import { onMount } from "svelte";
  import { userData } from '../store/store';
  

  let ctx;

  const data = {
  labels: [
    'Fravær',
    'Resterende lektioner'
  ],
  datasets: [{
    label: 'Fraværs procent',
    data: [$userData.absenceLessons, $userData.totalLessons - $userData.absenceLessons],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)'
    ],
    hoverOffset: 4
  }]
};

  onMount(async () => {
    new Chart(ctx, {
      type: "doughnut",
      data: data
  }
  )});
</script>

<canvas id="myChart" width="100" height="100" bind:this={ctx} />


