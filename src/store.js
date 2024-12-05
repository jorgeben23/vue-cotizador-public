import { createStore } from "vuex";
const store = createStore({
  state: {
    listAnalysis: [],
    priceTotal: 0,
    showMsgSuccess: false,
  },
  mutations: {
    setListAnalysis: (state, payload) => {
      console.log(payload);
      if (payload.action === "push") {
        console.log("aqui pusheamos...");
        state.listAnalysis.push(payload.item);
        return;
      }
      state.listAnalysis = payload.item;
    },
    setPriceTotal: (state, payload) => {
      state.priceTotal = payload;
    },
    setShowMsgSuccess: (state) => {
      state.showMsgSuccess = true;

      setTimeout(() => {
        state.showMsgSuccess = false;
      }, 5000);
    },
  },
  actions: {
    setListAnalysis: ({ commit }, payload) => {
      commit("setListAnalysis", payload);
    },
    setPriceTotal: ({ commit, getters }, payload) => {
      const listAnalysis = getters.getListAnalysis;
      let priceTotalCart = 0;
      if (listAnalysis && listAnalysis.length == 0) {
        commit("setPriceTotal", 0);
        return;
      }

      listAnalysis.forEach((analisis) => {

        if (analisis.isPackage) {
          
          if (analisis.PrecioBase == 0) {
            priceTotalCart += parseFloat(analisis.precioReal);
          } else {
            priceTotalCart += parseFloat(analisis.PrecioBase);
          }
        
        }else {
          priceTotalCart += parseFloat(analisis.PrecioBase);
        }

      });
      commit("setPriceTotal", priceTotalCart);
    },

    setInitialCart: ({ commit, dispatch }, payload) => {
      const itemsCart = sessionStorage.getItem("__arr-add")
        ? JSON.parse(sessionStorage.getItem("__arr-add"))
        : null;

      if (!itemsCart) {
        sessionStorage.setItem("__arr-add", JSON.stringify([]));
        return false;
      }
      commit("setListAnalysis", {
        action: "set",
        item: itemsCart,
      });

      dispatch("setPriceTotal");
    },
  },
  getters: {
    getListAnalysis(state) {
      return state.listAnalysis;
    },
    getPriceTotalCart(state) {
      return state.priceTotal;
    },
    getShowMsgSuccess(state) {
      return state.showMsgSuccess;
    },
  },
});

export default store;
