<script>
  import Chart from "../../components/Chart.svelte";

</script>

<div class="container">
  <div class="chart-conatiner">
    <Chart />
  </div>
</div>

<style>
  .container {
    overflow: overlay;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chart-conatiner {
    width: 400px;
    height: 400px;
  }
</style>
