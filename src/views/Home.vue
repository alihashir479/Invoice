<template>
<div class="home container">
<div class="header flex">
  <div class="left flex flex-column">
  <h1>Invoices</h1>
  <span>There are 4 total invoices</span>
  </div>
  <div class="right flex">
 <div @click="toggleFilterMenu" class="flex filter" ref="filter">
   <span>Filter by status</span>
   <img src="@/assets/icon-arrow-down.svg">
   <ul v-show="filter" class="filter-menu">
    <li>Draft</li>
    <li>Paid</li>
    <li>Pending</li>
    <li>Clear Filter</li>
   </ul>
 </div>
 <div @click="newInvoice" class="button flex">
 <div class="inner-button flex">
   <img src="@/assets/icon-plus.svg">
 </div>
 <span>New invoice</span>
 </div>
  </div>
</div>
<div v-if="invoiceData.length > 0">
  <Invoice  v-for="(invoice,index) in invoiceData" :invoice="invoice" :key="index"/>
</div>
<div v-else class="empty flex flex-column">
  <img src="@/assets/illustration-empty.svg">
  <p>There is nothing here</p>
  <p>Create a invoice then invoices will show here</p>
</div>
</div>
</template>

<script>
import Invoice from '../components/invoice.vue'
export default {
  components:{
    Invoice
  },
  name: 'Home',
data(){
  return{
    filter: true
  }
}
,
methods:{
  newInvoice(){
    this.$store.commit('toggleInvoice')
    console.log(this.$store.state.invoiceModal)
  },
  toggleFilterMenu(){
    this.filter = !this.filter
  }
},
computed:{
  invoiceData(){
    return this.$store.state.invoiceData
  }
}
}
</script>
<style lang="scss" scoped>
.home{
  .empty{
    margin-top: 160px;
    justify-items: center;
    align-items: center;
    img{
      width: 214px;
      height: 200px;
    }
    p{
      text-align: center;
      margin-top: 20px;
    }
  }
  color: #fff;
  .header{
    margin-bottom: 65px;
    .left , .right{
      flex: 1;
    }
    .right{
      justify-content: flex-end;
      align-items: center;
      .button , .filter{
        align-items: center;
        span{
          font-size: 12px;
        }
      }
      .filter{
        cursor: pointer;
        position: relative;
        margin-right: 40px;
        span , img{
          pointer-events: none;
        }
        img{
          width: 9px;
          height: 5px;
          margin-left: 12px;
        }
        .filter-menu{
          position: absolute;
          width: 120px;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          li{
            padding: 10px 20px;
            cursor: pointer;
            font-size: 12px;
            &:hover{
              color: #1e2139;
              background-color: #fff;
            }
          }
          .button{
            padding: 8px 10px;
            background-color: #7c5dfa;
            border-radius: 5px;
            .inner-button{
              justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #fff;
    padding: 8px;
    margin-right: 8px;
    img{
      width: 10px;
      height: 10px;
    }
            }
            
          }
        }
      }
    }
  }
}
</style>