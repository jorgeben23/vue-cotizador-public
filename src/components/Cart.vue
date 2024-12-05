<template>
  <!-- START-- Sección de información carrito -->
  <div class="container container__cart">
    <template v-if="!showMsgSendWhatsapp">
      <div
        class="row mt-5 section__list-analysis"
        :style="[
          listAnalisis && listAnalisis.length < 5 ? { height: '80vh' } : '',
        ]"
        v-if="listAnalisis && listAnalisis.length > 0"
      >
        <div class="col-md d-flex justify-content-center flex-column">
          <i class="fa-regular fa-circle-check"></i>
          <p>Todo listo, ahora puede finalizar su compra</p>

          <div class="list-analysis">
            <p>Lista de análisis solicitados:</p>
            <transition-group name="list" tag="div">
              <Result
                v-for="(result, ix) in listAnalisis"
                :key="result['idAnalisis']"
                :result="result"
                :doAdd="false"
                @actionDetail="actionDetail"
                @actionDelete="deleteAnalysis"
                :index="ix"
              />
            </transition-group>
            <span
              class="rounded list_analysis-total"
              :style="stylesSectionTotal"
              >TOTAL: S/ {{ totalCart }}</span
            >
            <button class="px-3 py-1 mb-3 still_add" @click="goHome">
              SEGUIR AGREGANDO
            </button>
            <button class="px-3 py-1 mb-4" @click="sendWhatsapp">
              <i class="fa-brands fa-whatsapp"></i>
              FINALIZAR COMPRA
            </button>
          </div>
        </div>
        <!-- START-- Popup detalle de analisis -->
        <div
          class="modal fade"
          id="exampleModalCenter"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <ModalDetail
            :content="resultDetailSelected"
            :loading="loadingDetail"
            :is-package="setIsPackage"
          />
        </div>
        <!-- END-- -->
      </div>

      <div
        class="row d-flex align-items-center justify-content-center flex-column section__list-empty"
        v-else
      >
        <i class="fa-regular fa-face-sad-tear mr-1 mb-4"></i> Tu carrito está
        vacío.
        <router-link to="/" class="mt-2">Buscar análisis</router-link>
      </div>
    </template>

    <!-- START-- Sección mensaje lista enviada a whatsapp -->
    <transition name="fade" appear>
      <div
        class="row d-flex align-items-center justify-content-center flex-column px-2 text-center section__list-send"
        v-if="showMsgSendWhatsapp"
      >
        <i class="fa-regular fa-face-smile mb-3"></i> Tu lista de análisis fue
        enviado con éxito.
        <router-link to="/" class="mt-2">Nueva Cotización</router-link>
      </div>
    </transition>
    <!-- END-- -->
  </div>
  <!-- END-- -->
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import ModalDetail from "./Home/ModalDetail.vue";
import Result from "./Home/Result.vue";
import { useRouter } from "vue-router";

const store = useStore();
const route = useRouter();

let loadingDetail = ref(false);
let resultDetailSelected = ref({});
let stylesSectionTotal = ref(0);
let showMsgSendWhatsapp = ref(false);
let setIsPackage = ref(false);

onMounted(() => {
  store.dispatch("setInitialCart");

  setTimeout(() => {
    if (listAnalisis.value && listAnalisis.value.length > 0) {
      const left =
        document.querySelectorAll("#result-name")[0].clientWidth / 1.5;
      stylesSectionTotal.value = {
        left: left + "px",
        opacity: 1,
      };
    }
  }, 100);
});

const actionDetail = async (data) => {
  const analysisSelected = JSON.parse(JSON.stringify(data));
  if (!analysisSelected.isPackage) {
    setIsPackage.value = false;
    const parametroBusqueda = new FormData();
    parametroBusqueda.append("funcion", "detalle");
    parametroBusqueda.append("idAnalisis", analysisSelected["IdAnalisis"]);
    loadingDetail.value = true;
    const respDetailSelected = await axios.post(
      "/api/api-cotizador-escalabs/app/api.php",
      parametroBusqueda
    );
    loadingDetail.value = false;

    resultDetailSelected.value = respDetailSelected.data;
    return;
  }

  setIsPackage.value = true;
  resultDetailSelected.value = {
    idPaquete: analysisSelected["idAnalisis"],
    nombre: analysisSelected["Nombre"],
    descripcion: analysisSelected["descripcion"],
    fechaInicio: analysisSelected["fechaInicio"],
    fechaVencimiento: analysisSelected["fechaVencimiento"],
    precioOferta: analysisSelected["PrecioBase"],
    precioReal: analysisSelected["precioReal"],
    arrayAnalisis: analysisSelected["arrayAnalisis"],
    condiciones: analysisSelected["condiciones"],
  };
};

const deleteAnalysis = (data) => {
  const arrAnalysis = JSON.parse(
    JSON.stringify(store.getters["getListAnalysis"])
  );
  const newListAnalysis = arrAnalysis.filter((e, ix) => data != ix);
  console.log(newListAnalysis);

  store.dispatch("setListAnalysis", {
    action: "set",
    item: newListAnalysis,
  });
  store.dispatch("setPriceTotal");
  sessionStorage.setItem("__arr-add", JSON.stringify(newListAnalysis));
};

const sendWhatsapp = () => {
  let text = "";
  let textListAnalysis = "";
  const listAllAnalysis = listAnalisis.value;

  for (let index = 0; index < listAllAnalysis.length; index++) {
    const analysis = listAllAnalysis[index];
    textListAnalysis += `💚${analysis["Nombre"]} ➡️ s/.${analysis["PrecioBase"]}.00%0A`;
  }

  text = `https://api.whatsapp.com/send?phone=51960945908&text=👋¡Hola Escalabs! %0A%0ACoticé por su web y deseo adquirir los siguientes análisis: %0A%0A${textListAnalysis}%0A*👩‍⚕️Total*: s/.${totalCart.value}.00%0A%0A ¡Gracias!`;
  showMsgSendWhatsapp.value = true;
  sessionStorage.setItem("__arr-add", []);
  store.dispatch("setListAnalysis", {
    action: "set",
    item: [],
  });
  store.dispatch("setPriceTotal");
  window.open(text, "_blank");
};

const goHome = () => {
  route.push({
    path: "/",
  });
};

const listAnalisis = computed(() => {
  return JSON.parse(JSON.stringify(store.getters["getListAnalysis"]));
});

const totalCart = computed(() => {
  return store.getters["getPriceTotalCart"];
});
</script>

<style scoped>
.container__cart {
  width: 550px;
  margin: auto;
  font-family: "Breuer";
}
.section__list-analysis {
  text-align: center;
  border-radius: 10px;
  border: 3px solid var(--green-secondary-color);
  margin-bottom: 30px;
}

.section__list-analysis p {
  color: var(--green-primary-color);
  font-weight: 700;
  font-size: 17px;
}

.section__list-analysis .fa-circle-check {
  color: var(--orange-primary-color);
  font-size: 95px;
  margin-bottom: 10px;
}

.section__list-analysis .list-analysis {
  position: relative;
}

.section__list-analysis .list-analysis p {
  font-weight: normal;
  color: var(--gray-primary-color);
  font-size: 15px;
  text-align: left;
}

.section__list-analysis .list-analysis button {
  background-color: var(--green-primary-color);
  color: white;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  border: 0;
  outline: 0;
  cursor: pointer;
  font-family: "Breuer", sans-serif;
  font-size: 19px;
}

.section__list-analysis .list-analysis button.still_add {
  color: var(--green-primary-color);
  text-decoration: underline;
  cursor: pointer;
  font-size: 17px;
  margin-top: 75px;
  background-color: transparent;
  width: 100%;
}

.section__list-analysis .list-analysis button > i {
  font-size: 19px;
}

.section__list-analysis .list-analysis .list_analysis-total {
  background-color: var(--orange-primary-color);
  color: white;
  position: absolute;
  bottom: 8.5rem;
  padding: 7px 10px;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  font-size: 16px;
}

.section__list-empty,
.section__list-send {
  height: 85vh;
  font-size: 16px;
  color: var(--gray-primary-color);
}

.section__list-empty i,
.section__list-send i {
  font-size: 90px;
}

.section__list-empty a,
.section__list-send a {
  color: var(--green-primary-color);
  text-decoration: underline;
}

@media (min-width: 320px) and (max-width: 480px) {
  .container__cart {
    width: 95%;
  }

  .section__list-analysis .list-analysis .list_analysis-total {
    bottom: 9rem;
  }
}
</style>
