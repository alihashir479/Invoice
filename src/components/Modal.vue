<template>
  <div class="modal flex">
      <div class="modal-content">
          <p>Are you sure you want to cancel it?. Your changes will not be saved.</p>
          <div class="actions flex">
              <button @click="closeModal" class="purple">Return</button>
              <button @click="closeInvoice" class="red">Close</button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
name: 'Modal',
data(){
    return{
    editState:null
    }
},
created(){
this.editState = this.$store.state.editInvoice
},
methods:{
    closeModal(){
        this.$store.commit('toggleModal')
    },
    closeInvoice(){
        this.$store.commit('toggleInvoice')
        this.$store.commit('toggleModal') 
        if(this.editState){
            this.$store.commit('toggleEditInvoice')
        }
    }
}
}
</script>

<style lang="scss" scoped>
.modal{
    z-index: 100;
    position: fixed;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    .modal-content{
        border-radius: 20px;
        padding: 48px 32px;
        max-width: 450px;
        background-color: #252945;
        color: #fff;
        .actions{
            margin-top: 24px;
            button{
                flex: 1;
            }
        }
    }
}
</style>