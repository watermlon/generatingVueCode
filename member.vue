<template>
<div>
    <Card>
        <table-view :tableTitle='tableTitle'></table-view>
    </Card>
</div>
</template>
<script>
import tableView from '../components/table'
export default {
    components:{
        tableView
    },
  data() {
    return {
        tableTitle:[
            //@tableTitle@
        ]
    };
  },
  methods:{
      //@methods@
  }
};
</script>
<style scoped lang='less'>
</style>