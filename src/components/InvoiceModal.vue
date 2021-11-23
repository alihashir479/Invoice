<template>
<div @click="checkClick" ref="invoiceWrap" class="flex flex-column invoice-wrap">
<form @submit.prevent="submitForm" class="invoice-content">
  <Loading v-show="loading" />
  <h1 v-if="!editState">New Invoice</h1>
  <h1 v-else>Edit Invoice</h1>
  <!-- Bill from -->
  <div class="flex bill-from flex-column">
  <h4>Bill from</h4>
  <div class="input flex flex-column">
  <label for="billerStreetAddress">Street Address</label>
  <input type="text" required id="billerStreetAddress" v-model="billerStreetAddress">
  </div>
  <div class="location-details flex">
    <div class="input flex flex-column">
  <label for="billerCity">City</label>
  <input type="text" required id="billerCity" v-model="billerCity">
  </div>
  <div class="input flex flex-column">
  <label for="billerZipCode">Zip code</label>
  <input type="text" required id="billerZipCode" v-model="billerZipCode">
  </div>
  <div class="input flex flex-column">
  <label for="billerCountry">Country</label>
  <input type="text" required id="billerCountry" v-model="billerCountry">
  </div>
  </div>
  </div>
  <!-- Bill to -->
  <div class="bill-to flex flex-column">
    <h4>Bill to</h4>
    <div class="input flex flex-column">
  <label for="clientName">Client Name</label>
  <input type="text" required id="clientName" v-model="clientName">
  </div>
  <div class="input flex flex-column">
  <label for="clientEmail">Client Email</label>
  <input type="text" required id="clientEmail" v-model="clientEmail">
  </div>
  <div class="input flex flex-column">
  <label for="clientStreetAddress">Client Street Adress</label>
  <input type="text" required id="clientStreetAddress" v-model="clientStreetAddress">
  </div>
   <div class="location-details flex">
    <div class="input flex flex-column">
  <label for="clientCity">City</label>
  <input type="text" required id="clientCity" v-model="clientCity">
  </div>
  <div class="input flex flex-column">
  <label for="clientZipCode">Zip code</label>
  <input type="text" required id="clientZipCode" v-model="clientZipCode">
  </div>
  <div class="input flex flex-column">
  <label for="clientCountry">Country</label>
  <input type="text" required id="clientCountry" v-model="clientCountry">
  </div>
  </div>
  </div>
  <!-- Invoice work details -->
  <div class="invoice-work flex flex-column">
    <div class="payment flex">
      <div class="input flex flex-column">
  <label for="invoiceDate">Invoice Date</label>
  <input type="text" disabled id="invoiceDate" v-model="invoiceDate">
  </div>
  <div class="input flex flex-column">
  <label for="paymentDueDate">Payment due date</label>
  <input type="text" disabled  id="paymentDueDate" v-model="paymentDueDate">
  </div>
    </div>
     <div class="input flex flex-column">
  <label for="paymentTerms">Payment Terms</label>
  <select required id="paymentTerms" v-model="paymentTerms">
  <option value="30">Net 30 days</option>
  <option value="60">Net 60 days</option>
  </select>
  </div>
 <div class="input flex flex-column">
  <label for="productDescription">Product Description</label>
  <input type="text" required id="productDescription" v-model="productDescription">
  </div>
  <div class="work-items">
    <h3>Work Items</h3>
    <table class="item-list">
    <tr class="table-heading flex">
      <th class="item-name">Item name</th>
      <th class="qty">Qty</th>
      <th class="price">Price</th>
      <th class="total">Total</th>
    </tr>
    <tr class="table-items flex" v-for="(item,index) in invoiceItemList" :key="index">
    <td class="item-name"><input type="text" v-model="item.itemName"></td>
    <td class="qty"><input type="text" v-model="item.qty"></td>
    <td class="price"><input type="text" v-model="item.price"></td>
    <td class="total flex">${{item.total = item.qty * item.price }}</td>
    <img @click="deleteListItem(item.id)" src="@/assets/icon-delete.svg">
    </tr>
    </table>
    <div @click="addNewInvoiceItem" class="flex button">
      <img src="@/assets/icon-plus.svg">
      Add new item
      </div> 
  </div>
  </div>

  <!-- Save and exit -->
  <div class="save flex">
<div class="left">
  <button type="button" class="red" @click="closeInvoice">Cancel</button>
</div>
<div class="right flex">
  <button type="submit" v-if="!editState" class="dark-purple" @click="saveDraft">Save Draft</button>
  <button type="submit" v-if="!editState" class="purple" @click="publishInvoice">Create Invoice</button>
  <button type="submit" v-if="editState"  class="purple">Update Invoice</button>
</div>
  </div>
</form>
</div>
</template>

<script>
import Loading from '../components/Loading.vue'
import {uid} from 'uid'
import db from '../firebase/firebaseInit.js'
export default {
components:{
Loading
},
name: 'InvoiceModal',
data(){
    return{
      options : {  year: 'numeric', month: 'short', day: 'numeric' },
      docId:null,
      loading:null,
      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
      editState:null
    }
}
,
created(){
 this.editState = this.checkEditMode()
 if(this.editState){
    this.currentInvoice = this.$store.state.currentInvoice[0]
     this.docId = this.currentInvoice.docId,
      this.billerStreetAddress = this.currentInvoice.billerStreetAddress,
      this.billerCity= this.currentInvoice.billerCity,
      this.billerZipCode= this.currentInvoice.billerZipCode,
      this.billerCountry= this.currentInvoice.billerCountry,
      this.clientName= this.currentInvoice.clientName,
      this.clientEmail= this.currentInvoice.clientEmail,
      this.clientStreetAddress= this.currentInvoice.clientStreetAddress,
      this.clientCity= this.currentInvoice.clientCity,
      this.clientZipCode= this.currentInvoice.clientZipCode,
      this.clientCountry= this.currentInvoice.clientCountry,
      this.invoiceDateUnix= this.currentInvoice.invoiceDateUnix,
      this.invoiceDate= this.currentInvoice.invoiceDate,
      this.paymentTerms= this.currentInvoice.paymentTerms,
      this.paymentDueDateUnix= this.currentInvoice.paymentDueDateUnix,
      this.paymentDueDate= this.currentInvoice.paymentDueDate,
      this.productDescription= this.currentInvoice.productDescription,
      this.invoicePending= this.currentInvoice.invoicePending,
      this.invoiceDraft= this.currentInvoice.invoiceDraft,
      this.invoiceItemList= this.currentInvoice.invoiceItemList,
      this.invoiceTotal = this.currentInvoice.invoiceTotal
 }
if(!this.editState){
this.invoiceDateUnix = Date.now()
this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleString('en-us',this.options)
}
}
,
watch:{
paymentTerms(){
      const futureDate = new Date();
      this.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.paymentTerms));
      this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString("en-us", this.dateOptions);
}
}
,
methods:{
  checkClick(e){
  if(e.target == this.$refs.invoiceWrap){
   this.$store.commit('toggleModal')
  }
  },
 closeInvoice(){
   this.$store.commit('toggleInvoice')
   if(this.editState){
     this.$store.commit('toggleEditInvoice')
   }
 }
 ,
 checkEditMode(){
   return this.$store.state.editInvoice
 },
 addNewInvoiceItem(){
   this.invoiceItemList.push(
     {
   id : uid(),
   itemName: '',
   qty: '',
   price: 0,
   total: 0
     }
   )
 },
 deleteListItem(id){
   this.invoiceItemList = this.invoiceItemList.filter((item) => item.id!==id)
 }
 ,
 publishInvoice(){
this.invoicePending = true
 }
 ,
 saveDraft(){
   this.saveDraft = true
 }
 ,
 calculateTotal(){
  this.invoiceTotal = 0
  this.invoiceItemList.forEach((item)=> {
  this.invoiceTotal+=item.total
})
 },
 async uploadInvoice(){
if(this.invoiceItemList.length <= 0){
  alert('Please add items')
  return
}
this.loading = true
this.calculateTotal()
const database = db.collection('invoices').doc()
await database.set({
  invoiceId: uid(6),
   billerStreetAddress: this.billerStreetAddress,
      billerCity: this.billerCity,
      billerZipCode: this.billerZipCode,
      billerCountry: this.billerCountry,
      clientName: this.clientName,
      clientEmail: this.clientEmail,
      clientStreetAddress: this.clientStreetAddress,
      clientCity: this.clientCity,
      clientZipCode: this.clientZipCode,
      clientCountry: this.clientCountry,
      invoiceDateUnix: this.invoiceDateUnix,
      invoiceDate: this.invoiceDate,
      paymentTerms: this.paymentTerms,
      paymentDueDateUnix: this.paymentDueDateUnix,
      paymentDueDate: this.paymentDueDate,
      productDescription: this.productDescription,
      invoicePending: this.invoicePending,
      invoiceDraft: this.invoiceDraft,
      invoiceItemList: this.invoiceItemList,
      invoiceTotal: this.invoiceTotal,
      invoicePaid: null
});
this.loading = false
this.$store.commit('toggleInvoice')
 }
 ,
  async updateInvoice(){
if(this.invoiceItemList.length <= 0){
  alert('Please add items')
  return
}
this.loading = true
this.calculateTotal()
const database = db.collection('invoices').doc(this.docId)
await database.update({
      billerStreetAddress: this.billerStreetAddress,
      billerCity: this.billerCity,
      billerZipCode: this.billerZipCode,
      billerCountry: this.billerCountry,
      clientName: this.clientName,
      clientEmail: this.clientEmail,
      clientStreetAddress: this.clientStreetAddress,
      clientCity: this.clientCity,
      clientZipCode: this.clientZipCode,
      clientCountry: this.clientCountry,
      invoiceDateUnix: this.invoiceDateUnix,
      invoiceDate: this.invoiceDate,
      paymentTerms: this.paymentTerms,
      paymentDueDateUnix: this.paymentDueDateUnix,
      paymentDueDate: this.paymentDueDate,
      productDescription: this.productDescription,
      invoiceItemList: this.invoiceItemList,
});
this.loading = false
const data = {
docId: this.docId,
routeId: this.$route.params.invoiceId
}
this.$store.dispatch('updateInvoice',data)
 },
 submitForm(){
   if(this.editState){
     this.updateInvoice()
     return
   }
   this.uploadInvoice()
 }
}
}
</script>

<style lang="scss" scoped>
.invoice-wrap{
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media(min-width:900px){
    left: 90px;
  }
  .invoice-content{
    max-width: 700px;
    width: 100%;
    position: relative;
    padding: 56px;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0,0,0,0.2) , 0px 4px 2px -1px rgba(0,0,0,0.6);
    h1{
      margin-bottom: 40px;
      color: #fff;
    }
    h3{
      font-size: 18px;
      margin-bottom: 16px;
      color: #777f98;
    }
    h4{
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }
  }
  .input{
    margin-bottom: 24px;
  }
  label{
    font-size: 12px;
    margin-bottom: 6px;
  }
  input,select{
    width: 100%;
    background-color: #1e2139;
    padding: 12px 4px;
    color: #fff;
    border: none;
    border-radius: 4px;
    &:focus{
      outline: none;
    }
  }
  .bill-to, .bill-from{
    margin-bottom: 48px;
  }
  .location-details{
    gap: 16px;
    div{
      flex: 1;
    }
  }
  .invoice-work{
    .payment{
    gap: 24px;
    div{
      flex: 1;
    }
    }
    .work-items{
      .item-list{
        width: 100%;
        .table-heading,
        .table-items{
          gap: 16px;
          font-size: 24px;
          .item-name{
            flex-basis: 50%;
          }
          .qty{
            flex-basis: 10%;
          }
          .price{
            flex-basis: 20%;
          }
          .total{
            flex-basis: 20%;
            align-self: center;
          }
        }
        .table-heading{
          margin-bottom: 16px;
          th{
            text-align: left;
          }
        }
        .table-items{
          position: relative;
          margin-bottom: 24px;
          img{
            position: absolute;
            top: 15px;
            right: 0;
            width: 12px;
            height: 16px;
          }
        }
      }
      .button{
        color: #fff;
        background-color: #252925;
        width: 100%;
        justify-content: center;
        align-items: center;
        img{
          margin-right: 4px;
        }
      }
    }
  }
  .save{
    margin-top: 60px;
    div{
      flex: 1;
    }
    .right{
      justify-content: flex-end;
    }
  }
}
</style>