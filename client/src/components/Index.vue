<template>
  <div class="small">
    <!-- <line-chart v-if="loaded" :chartData="chartData"></line-chart> -->
    {{ msg }}
    <ul v-if="errors && errors.length">
      <li v-for="error of errors" :key="error.message">
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<script>
// import { HTTP } from '../http'
import LineChart from './charts/LineChart'

export default {
  name: 'Index',
  components: {
    LineChart
  },
  data () {
    return {
      msg: null
    }
  },
  mounted () {
    this.fetchChartData()
  },
  methods: {
    fetchChartData () {
      fetch('http://localhost:8081/')
        .then(({ data }) => {
          this.msg = data
        })
        .catch((e) => {
          this.errors.push(e)
        })
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.small {
  max-width: 600px;
  margin:  150px auto;
}
</style>
