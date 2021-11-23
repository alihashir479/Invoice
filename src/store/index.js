import { createStore } from 'vuex'
import db from '../firebase/firebaseInit.js'
export default createStore({
  state: {
    invoiceModal: false,
    returnModal:false,
    invoiceData:[],
    currentInvoice:null,
    editInvoice:null
  },
  mutations: {
    toggleInvoice(state){
      state.invoiceModal = !state.invoiceModal
    },
    toggleModal(state){
      state.returnModal = !state.returnModal
    },
    push_invoice_data(state,payload){
      state.invoiceData.push(payload)
    },
    currentInvoiceArray(state,payload){
    state.currentInvoice = state.invoiceData.filter(invoice=>{
    return invoice.invoiceId == payload
    })
  },
  deleteCurrentInvoice(state,payload){
    state.invoiceData.filter(invoice=>invoice.docId!==payload)
  },
    toggleEditInvoice(state){
      state.editInvoice = !state.editInvoice
    }
  },
  actions: {
async get_invoice_data({commit,state}){
  const database = db.collection('invoices')
  const results = await database.get()
  results.forEach(doc=>{
    if(!state.invoiceData.some(invoice=> invoice.docId== doc.id)){
      const data = {
        docId: doc.id,
        invoiceId: doc.data().invoiceId,
        billerStreetAddress: doc.data().billerStreetAddress,
        billerCity: doc.data().billerCity,
        billerZipCode: doc.data().billerZipCode,
        billerCountry: doc.data().billerCountry,
        clientName: doc.data().clientName,
        clientEmail: doc.data().clientEmail,
        clientStreetAddress: doc.data().clientStreetAddress,
        clientCity: doc.data().clientCity,
        clientZipCode: doc.data().clientZipCode,
        clientCountry: doc.data().clientCountry,
        invoiceDateUnix: doc.data().invoiceDateUnix,
        invoiceDate: doc.data().invoiceDate,
        paymentTerms: doc.data().paymentTerms,
        paymentDueDateUnix: doc.data().paymentDueDateUnix,
        paymentDueDate: doc.data().paymentDueDate,
        productDescription: doc.data().productDescription,
        invoicePending: doc.data().invoicePending,
        invoiceDraft: doc.data().invoiceDraft,
        invoiceItemList: doc.data().invoiceItemList,
        invoiceTotal: doc.data().invoiceTotal,
      }
      commit('push_invoice_data',data)
    }
    
  })
},
async updateInvoice({commit,dispatch},{docId,routeId}){
  commit('deleteCurrentInvoice',docId)
  await dispatch('get_invoice_data')
  commit('toggleInvoice')
  commit('toggleEditInvoice')
  commit('currentInvoiceArray',routeId)
},
async deleteInvoice({commit},docId){
  const doc = db.collection('invoices').doc(docId)
  await doc.delete()
  commit('deleteCurrentInvoice')
  }
  },
  modules: {
  }
})
