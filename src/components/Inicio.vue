<template>
  <div class="container__search">
    <div class="row row-title">
      <div class="col-md col-title">
        <div class="alert alert-success text-center" role="alert">
          <h3>
            <span class="titulo">Cotizador de análisis</span>
          </h3>
        </div>
      </div>
    </div>

    <div class="container body__main">
      <div class="row body_main-input-search">
        <div class="col-md">
          <input
            type="text"
            class="form-control input_search"
            placeholder="Escribe el análisis que deseas realizarte"
            v-model="textAnalisis"
            @keyup.enter="Busqueda"
          />
        </div>
      </div>

      <div class="row mt-4 body_main-button">
        <div class="col-md text-center">
          <button class="w-50 button-buscar" @click="Busqueda">
            <i class="fa-solid fa-magnifying-glass mr-1"></i> BUSCAR
          </button>
        </div>
      </div>

      <!-- START-- Sección de paquetes -->
      <div class="container_packages row mt-5" v-if="!showResults">
        <transition name="fade" appear>
          <div
            class="container__list-analysis-add"
            v-if="listAnalisis && listAnalisis.length > 0"
          >
            <div class="list-analysis-add__section">
              <transition name="fade" appear>
                <div v-if="showMsgSuccess">
                  <i class="fa-regular fa-circle-check"></i>
                  <p class="text-first">
                    Se agregó su <br />
                    análisis con éxito
                  </p>
                </div>
              </transition>
              <p>Lista de análisis agregados:</p>
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
              <button @click="goCart" class="list-analysis-add__button">
                FINALIZAR COMPRA
              </button>
            </div>
          </div>
        </transition>

        <div class="col-md section__list-packages">
          <h3 class="text-white p-2 rounded">PAQUETES DE SALUD</h3>
          <div class="section_carousel mt-5 mb-4">
            <CarouselPackage
              :list="listPackage"
              v-if="
                listPackage && listPackage.length > 0 && !showLoadingPackage
              "
            />
            <div class="carousel__loading" v-else-if="showLoadingPackage">
              <Load />
              <p>Cargando paquetes...</p>
            </div>
            <div
              class="d-flex align-items-center justify-content-center flex-column list-empty"
              v-else-if="!showLoadingPackage && listPackage.length == 0"
            >
              <i class="fa-regular fa-face-sad-tear mr-1 mb-4"></i> No existen
              paquetes.
            </div>
          </div>
          <img
            src="@/assets/images/home.webp"
            alt="Home2"
            style="height: auto; display: block; width: 100%"
          />
        </div>
      </div>
      <!-- END-- -->

      <!-- START-- Sección de listado de resultados -->
      <div class="container__results" v-if="showResults">
        <div class="row mt-4">
          <div class="col-md">
            <p class="desc-res m-0">Resultados para el análisis de :</p>
            <p class="name-res">{{ textAnalisis }}</p>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-md">
            <div class="section__results mb-4">
              <div
                v-if="arrResults && arrResults.length > 0"
                :style="[
                  arrResults && arrResults.length < 7 ? { height: '50vh' } : '',
                ]"
              >
                <span class="span-add"> Agregar </span>
                <Result
                  v-for="result in arrResults"
                  :key="result.idAnalisis"
                  :result="result"
                  :doAdd="true"
                  @actionDetail="actionDetail"
                  @actionAdd="addToCart"
                />
              </div>

              <template v-else>
                <div class="results-empty d-flex flex-column">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  No existen resultados para su búsqueda.
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <!-- END -- -->
    </div>

    <!-- START-- Loading results -->
    <Loading :loading="showLoading" />
    <!-- END-- -->

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
        :isPackage="setIsPackage"
      />
    </div>
    <!-- END-- -->
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import Result from "./Home/Result.vue";
import Loading from "./Loading.vue";
import ModalDetail from "./Home/ModalDetail.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import CarouselPackage from "./Home/CarouselPackage.vue";
import Load from "../components/Icons/Load.vue";

const textAnalisis = ref("");
let showResults = ref(false);
let arrResults = ref([]);
let showLoading = ref(false);
let loadingDetail = ref(false);
let resultDetailSelected = ref({});
let listPackage = ref([]);
let showLoadingPackage = ref(false);
let setIsPackage = ref(false);

const store = useStore();
const router = useRouter();

onMounted(() => {
  store.dispatch("setInitialCart");

  loadPackage();
});

const loadPackage = async () => {
  const paramListPackage = new FormData();

  paramListPackage.append("funcion", "listPaquetes");
  paramListPackage.append("nombre", "");
  showLoadingPackage.value = true;
  const resp = await axios.post(
    "/api/api-cotizador-escalabs/app/api.php",
    paramListPackage
  );
  showLoadingPackage.value = false;
  listPackage.value = [];
  if (resp.data && resp.data.length > 0) {
    listPackage.value = resp.data.filter((e) => e.publicado == 1);
    return;
  }
};

const Busqueda = async () => {
  // --- formamos JSON
  const parametroBusqueda = new FormData();
  parametroBusqueda.append("funcion", "listar");
  parametroBusqueda.append("analisis", textAnalisis.value);
  // --- para detalle analisis

  const parametroDetalle = new FormData();
  parametroDetalle.append("funcion", "detalle");
  parametroDetalle.append("idAnalisis", 30);

  showLoading.value = true;
  const respResults = await axios.post(
    "/api/api-cotizador-escalabs/app/api.php",
    parametroBusqueda
  );


  showLoading.value = false;
  showResults.value = true;

  if (respResults && respResults.data && respResults.data.length == 0) {
    arrResults.value = [];
    return;
  }
  arrResults.value = respResults.data;

};

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

    console.log(respDetailSelected);

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
    isPaqueteHome: true,
  };

    console.log(analysisSelected)


};

const addToCart = (data) => {
  const itemsCart = sessionStorage.getItem("__arr-add")
    ? JSON.parse(sessionStorage.getItem("__arr-add"))
    : null;

  showLoading.value = true;
  setTimeout(() => {
    textAnalisis.value = "";
    showLoading.value = false;
    showResults.value = false;
    store.commit("setShowMsgSuccess");
  }, 1000);
  if (!itemsCart) {
    store.dispatch("setListAnalysis", {
      action: "set",
      item: [],
    });
    return;
  }
  store.dispatch("setListAnalysis", {
    action: "set",
    item: itemsCart,
  });
  const analysisAdd = JSON.parse(JSON.stringify(data));
  analysisAdd["isPackage"] = false;
  store.dispatch("setListAnalysis", {
    action: "push",
    item: analysisAdd,
  });
  sessionStorage.setItem("__arr-add", JSON.stringify(listAnalisis.value));
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

const goCart = () => {
  router.push({ path: "/cart" });
};

const listAnalisis = computed(() => {
  return JSON.parse(JSON.stringify(store.getters["getListAnalysis"]));
});

const showMsgSuccess = computed(() => {
  return JSON.parse(JSON.stringify(store.getters["getShowMsgSuccess"]));
});

watch(textAnalisis, (value) => {
  if (!value) {
    showResults.value = false;
  }
});
</script>

<style scoped>
.container__search {
  font-family: "Breuer";
}
.button-buscar {
  background: var(--green-primary-color);
  color: #fff;
  font-size: 14px !important;
  font-weight: bolder;
  padding: 0.9%;
  border-radius: 5px;
  cursor: pointer;
}

.desc-res {
  color: var(--gray-primary-color);
  font-size: 16px;
}

.name-res {
  font-size: 18px;
  color: var(--gray-primary-color);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 19px;
}

.top {
  margin-top: 0;
}

.titulo {
  font-weight: bolder;
  text-align: center;
  font-family: "Breuer", sans-serif;
  font-weight: 500;
  font-size: 25px;
}

.row-title,
.col-title {
  margin: 0;
  padding: 0;
}

.alert-success {
  background-color: var(--green-secondary-color);
  border: 1px solid var(--green-secondary-color);
  padding: 15px 0;
}

.alert-success h3 {
  margin: 0;
  text-transform: none;
  text-align: center;
  padding: 0 10px;
  font-size: 20px;
  color: var(--green-primary-color);
}

.input_search {
  font-size: 15px;
  background-color: var(--green-secondary-color);
  border: 1px solid var(--green-secondary-color);
  color: var(--gray-primary-color);
  font-family: "Breuer", sans-serif;
  font-weight: 400;
}

.input_search:focus {
  border: 0 !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

.input_search::placeholder {
  color: var(--gray-primary-color);
  font-family: "Breuer", sans-serif;
  font-weight: 400;
}

.body_main-button button {
  font-family: "Breuer", sans-serif;
  font-weight: 700;
}

.container_packages {
  text-align: center;
  font-family: "Breuer";
  font-weight: 400;
}

.section__list-packages {
  width: 100%;
}

.container_packages .container__list-analysis-add {
  width: 100%;
}

.container__list-analysis-add .list-analysis-add__section {
  max-width: 600px;
  margin: 2rem auto;
  border: 2px solid var(--green-secondary-color);
  border-radius: 10px;
  padding: 1rem;
}

.container_packages .container__list-analysis-add p {
  font-size: 16px;
  text-align: left;
  font-weight: 400;
}

.container_packages .container__list-analysis-add .list-analysis-add__button {
  background-color: var(--green-primary-color);
  color: white;
  border: 0;
  outline: 0;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 17px;
  width: 50%;
  margin: 0.7rem auto;
  font-family: "Breuer", sans-serif;
  font-weight: 700;
  font-size: 18px;
}

.container__list-analysis-add .fa-circle-check {
  color: var(--orange-primary-color);
  font-size: 95px;
  margin-bottom: 10px;
}

.container__list-analysis-add .text-first {
  font-weight: 700 !important;
  color: var(--green-primary-color);
  text-align: center !important;
}

.container_packages h3 {
  background-color: var(--orange-primary-color);
  width: 70%;
  margin: auto;
  font-family: "Breuer";
  font-weight: 700;
  font-size: 20px;
}

.container_packages > .col-md {
  padding: 0;
}

.container_packages .section_carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: auto;
}

.results-empty {
  height: 60vh;
  text-align: center;
  color: var(--gray-primary-color);
  font-family: "Breuer";
  font-weight: 500;
  font-size: 20px;
}

.results-empty > i {
  margin: 0 5px 10px 0;
  font-size: 30px;
}

.section__results .span-add {
  position: absolute;
  top: -12px;
  right: 14px;
  font-size: 9px;
  text-transform: uppercase;
  color: var(--green-primary-color);
  font-weight: 700;
}

.carousel__loading {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: 400;
  font-size: 18px;
}

.list-empty {
  font-size: 16px;
  color: var(--gray-primary-color);
  margin-top: 30px;
  font-weight: 500;
  font-size: 19px;
}

.list-empty i {
  font-size: 90px;
}

.container__results {
  width: 100%;
}

@media screen and (min-width: 769px) {
  .body__main {
    width: 70%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  .body_main-input-search {
    width: 400px;
  }

  .body_main-input-search input {
    border-radius: 0.3rem 0 0 0.3rem;
  }

  .body_main-button {
    margin-top: 0 !important;
  }
  .body_main-button button {
    width: 180px !important;
    padding: 9px 0;
    border-radius: 0 0.3rem 0.3rem 0;
  }

  .container_packages {
    width: 100%;
  }

  .container_packages h3 {
    width: 250px;
  }
}

@media screen and (max-width: 480px) {
  .container_packages .container__list-analysis-add .list-analysis-add__section,
  .container_packages .container__list-analysis-add .list-analysis-add__button {
    width: 90%;
  }
  .container_packages
    .container__list-analysis-add
    .list-analysis-add__section {
    margin: 0 auto 3rem;
  }
  .alert-success h3 {
    text-align: center !important;
  }
}
</style>
