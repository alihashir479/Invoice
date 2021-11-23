<template>
<div>
   <router-link class="invoice flex"  :to="{name: 'Invoice', params:{invoiceId: invoice.invoiceId}}">
     <div class="left flex">
         <span class="tracking-number">{{invoice.invoiceId}}</span>
         <span class="due-date">{{invoice.paymentDueDate}}</span>
         <span class="person">{{invoice.clientName}}</span>
     </div>
     <div class="right flex">
         <span class="price-total">${{invoice.invoiceTotal}}</span>
         <div class="status-button flex"
         :class="{paid:invoice.invoicePaid,draft:invoice.invoiceDraft,pending:invoice.invoicePending}"
         >
          <span v-if="invoice.invoicePaid">Paid</span>
          <span v-if="invoice.invoicePending">Draft</span>
          <span v-if="invoice.invoiceDraft">Pending</span>
         </div>
         <div class="icon">
             <img src="@/assets/icon-arrow-right.svg">
         </div>
     </div>
   </router-link>
</div>
</template>
<script>
export default {
    name: 'invoice',
    props: ['invoice']
}
</script>
<style lang="scss">
.invoice{
    background-color: #1e2139;
    color: #fff;
    padding: 28px 32px;
    border-radius: 20px;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    text-decoration: none;
    .left{
        flex-basis: 60%;
        gap: 16px;
        align-items: center;
        span{
            flex: 1;
        }
        .tracking-number{
                text-transform: uppercase;
            }
    }
    span{
        font-size: 13px;
    }
    .right{
        gap: 16px;
        flex-basis: 40%;
        align-items: center;
        .price-total{
            flex: 1;
            font-size: 16px;
            font-weight: 600;
        }
    }
}
</style>