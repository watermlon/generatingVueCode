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
        tableTitle:[{"title":"1","key":"userId"},{"title":"2","key":"account"},{"title":"3","key":"name"},{"title":"4","key":"password"},{"title":"5","key":"roleId"},{"title":"6","key":"userStatus"},{"title":"7","key":"createTime"},{"title":"8","key":"roleName"}]
        
    };
  },
  methods:{
      //@methods@
  }
};
</script>
<style scoped lang='less'>
</style>