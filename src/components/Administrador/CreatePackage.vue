<template>
  <div class="container my-4 container__create-package">
    <div class="container__form text-center">
      <h1>
        {{ routePath === "/edit-package" ? "EDITAR PAQUETE" : "CREAR PAQUETE" }}
      </h1>
      <input
        type="text"
        :class="[
          v$.nombre.$invalid && clickSend ? 'mb-0 input_invalid' : 'mb-4',
        ]"
        placeholder="Nombre de paquete*"
        v-model="state.nombre"
      />
      <p
        class="my-2 text-left alert_input"
        v-if="v$.nombre.$invalid && clickSend"
      >
        Campo requerido
      </p>

      <textarea
        rows="5"
        cols="10"
        v-model="state.description"
        :class="[
          v$.description.$invalid && clickSend ? 'mb-0 input_invalid' : 'mb-4',
        ]"
        placeholder="Descripción*"
      ></textarea>
      <p
        class="my-2 text-left alert_input"
        v-if="v$.description.$invalid && clickSend"
      >
        Campo requerido
      </p>

      <p class="text-div">Precios:</p>
      <div class="form-row mb-4 form__prices">
        <div class="col">
          <input
            type="text"
            placeholder="Precio oferta*"
            v-model="state.priceRegular"
            :class="[
              v$.priceRegular.$invalid && clickSend ? 'input_invalid' : '',
            ]"
          />
          <p
            class="my-2 text-left alert_input"
            v-if="
              v$.priceRegular.$invalid &&
              clickSend &&
              v$.priceRegular.$silentErrors[0].$message === 'Value is required'
            "
          >
            Campo requerido
          </p>

          <p
            class="my-2 text-left alert_input"
            v-if="
              v$.priceRegular.$invalid &&
              clickSend &&
              v$.priceRegular.$silentErrors[0].$message ===
                'Value must be numeric'
            "
          >
            Campo numérico
          </p>
        </div>
        <div class="col">
          <input
            type="text"
            placeholder="Precio real"
            v-model="state.priceTotal"
            disabled
          />
          <span class="msg_info"
            >*Se rellena automaticamente al agregar análisis</span
          >
        </div>
      </div>

      <div class="form-row mb-4 form__date text-left">
        <div class="col mt-1 mb-3">
          <label for="date-start">Fecha de inicio: *</label>
          <input
            type="date"
            id="date-start"
            class="form-control"
            v-model="state.dateStart"
            :class="[v$.dateStart.$invalid && clickSend ? 'input_invalid' : '']"
          />
          <p
            class="my-2 text-left alert_input"
            v-if="v$.dateStart.$invalid && clickSend"
          >
            Campo requerido
          </p>
        </div>
        <div class="col mt-1 mb-3">
          <label for="date-end">Fecha de vencimiento: *</label>
          <input
            type="date"
            id="date-end"
            class="form-control"
            v-model="state.dateEnd"
            :class="[v$.dateEnd.$invalid && clickSend ? 'input_invalid' : '']"
          />
          <p
            class="my-2 text-left alert_input"
            v-if="v$.dateEnd.$invalid && clickSend"
          >
            Campo requerido
          </p>
        </div>
      </div>

      <!-- Condiciones Pre Analíticas -->

      <div class="form-row mb-4">
        <div class="col mb-1">
          <textarea
            rows="5"
            cols="10"
            v-model="state.condiciones"
            :class="[
              v$.condiciones.$invalid && clickSend
                ? 'mb-0 input_invalid'
                : 'mb-4',
            ]"
            placeholder="Condiciones Pre - Analíticas*"
          ></textarea>
          <p
            class="my-2 text-left alert_input"
            v-if="v$.condiciones.$invalid && clickSend"
          >
            Campo requerido
          </p>
        </div>
      </div>

      <div class="form-row mb-4">
        <div class="col mb-1 section_logo">
          <label for="date-end" class="text-left w-100">Icono: *</label>
          <img
            :src="state.icono"
            :alt="state.nombre"
            v-if="routePath === '/edit-package' && state.icono"
            width="50"
            height="50"
          />
          <input
            type="file"
            name="icono"
            id="icono"
            accept="image/*"
            @change="editIcon($event)"
          />
        </div>
      </div>

      <div class="form__search-analysis">
        <div class="row">
          <div class="col-md search__analysis-input">
            <input
              type="text"
              placeholder="Buscar análisis para el paquete"
              v-model="textAnalisis"
              @keyup.enter="Busqueda"
            />
            <i
              class="fa-solid fa-magnifying-glass"
              @click.prevent="Busqueda"
            ></i>
          </div>
        </div>

        <div
          class="container__analysis-add"
          v-if="
            showListAnalysisAdd && arrAnalysisAdd && arrAnalysisAdd.length > 0
          "
        >
          <b>Análisis agregados al paquete:</b>
          <div class="analysis-add__list">
            <div
              class="item__analysis-add"
              v-for="(item, ix) in arrAnalysisAdd"
              :key="ix"
            >
              <p>{{ item.Nombre }}</p>
              <button class="delete__analysis" @click="deleteAnalysys(item)">
                &times;
              </button>
            </div>
          </div>
        </div>
      </div>

      <p class="error_msg mb-0 mt-4" v-if="msgError">
        <i class="fa-solid fa-circle-exclamation mr-2"></i>{{ msgError }}
      </p>

      <div class="d-flex align-items-center justify-content-center flex-column">
        <button
          class="btn mt-4 btn__go-list"
          @click.prevent="$router.push({ path: '/list-package' })"
        >
          VER PAQUETES
        </button>
        <button @click.prevent="sendData" class="btn btn__submit mt-2 mb-4">
          {{ routePath === "/edit-package" ? "EDITAR" : "CREAR" }}
        </button>
      </div>
    </div>

    <div v-if="showResults" class="container__results">
      <div class="row mt-4 section__head-results">
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
              <div
                class="results-empty d-flex flex-column align-items-center justify-content-center"
              >
                <i class="fa-solid fa-circle-exclamation"></i>
                No existen resultados para su búsqueda.
              </div>
            </template>
          </div>
        </div>
      </div>
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
        :isPackage="false"
      />
    </div>
    <!-- END-- -->
  </div>
</template>

<script setup>
import { ref, watch, reactive, computed, onMounted } from "vue";
import axios from "axios";
import Loading from "../Loading.vue";
import Result from "../Home/Result.vue";
import ModalDetail from "../Home/ModalDetail.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric } from "@vuelidate/validators";
import { useRoute, useRouter } from "vue-router";
import swal from "sweetalert";

const textAnalisis = ref("");
let showResults = ref(false);
let arrResults = ref([]);
let showLoading = ref(false);
let loadingDetail = ref(false);
let resultDetailSelected = ref({});
let clickSend = ref(false);
let arrAnalysisAdd = ref([]);
let showListAnalysisAdd = ref(false);
let arrAnalisis = ref([]);
let msgError = ref("");
let infoPackageEdit = ref("");

const router = useRouter();
const route = useRoute();

const state = reactive({
  nombre: "",
  priceRegular: "",
  priceTotal: "",
  dateStart: "",
  dateEnd: "",
  description: "",
  condiciones: "",
  icono: "",
  editIcon: 0,
});

const rules = {
  nombre: { required },
  priceRegular: { required, numeric },
  dateStart: { required },
  dateEnd: { required },
  description: { required },
  condiciones: { required },
};

const v$ = useVuelidate(rules, state);

onMounted(async () => {
  if (routePath.value === "/edit-package") {
    const pageWrapper = document.querySelector(".pageWrapper");
    if (pageWrapper) {
      pageWrapper.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
    const infoPackage = sessionStorage.getItem("__package")
      ? JSON.parse(sessionStorage.getItem("__package"))
      : false;

    if (!infoPackage) {
      router.push({
        path: "/list-package",
      });
      return;
    }

    
    console.log(infoPackage);

    infoPackageEdit.value = infoPackage;

    state.nombre = infoPackage["nombre"];
    state.description = infoPackage["descripcion"];
    state.priceRegular = infoPackage["precioOferta"];
    state.priceTotal = infoPackage["precioReal"];
    state.dateStart = infoPackage["fechaInicio"].substring(0, 10);
    state.dateEnd = infoPackage["fechaVencimiento"].substring(0, 10);
    state.condiciones = infoPackage["condiciones"];

    // --- validamos que la variable venga definida

    if (infoPackage["ruta_icono"] == null ) {

      
    } else {


      state.icono = infoPackage["ruta_icono"];
      state.editIcon = 0;
      const file = document.getElementById("icono");
      const splitFileName = state.icono.split("/");
      const nameFile = splitFileName[splitFileName.length - 1];
      const myFile = new File([""], nameFile, {
        type: "image/png",
        size: 100832,
        lastModified: new Date(),
      });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(myFile);
      file.files = dataTransfer.files;
        
    }
    
    const paramDetail = new FormData();

    paramDetail.append("funcion", "listAnalisisByPaquete");
    paramDetail.append("idPaquete", infoPackage.idPaquete);

    showLoading.value = true;
    const resp = await axios.post(
      "/api/api-cotizador-escalabs/app/api.php",
      paramDetail
    );


    console.log(resp.data)

    showLoading.value = false;

    let arrAnalysisForThisPackage = [];
    if (resp && resp.data && resp.data.length > 0) {
      showListAnalysisAdd.value = true;

      resp.data.forEach((e) => {
        arrAnalysisForThisPackage.push({
          Nombre: e.desc_analisis,
          IdAnalisis: e["idAnalisis"],
          PrecioBase: e["precio_analisis"],
        });
      });
      arrAnalysisAdd.value = arrAnalysisForThisPackage;
    }
  }
});

const editIcon = (e) => {
  state.editIcon = 1;
};

const Busqueda = async () => {
  if (window.innerWidth > 769) {
    const pageWrapper = document.querySelector(".pageWrapper");
    if (pageWrapper) {
      pageWrapper.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }
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
};

const addToCart = (data) => {
  const analysis = JSON.parse(JSON.stringify(data));
  // console.log(analysis);
  showListAnalysisAdd.value = true;
  arrAnalysisAdd.value.push(analysis);
  state.priceTotal = 0;
  arrAnalysisAdd.value.forEach((analysis) => {
      state.priceTotal += parseFloat(analysis.PrecioBase);
  });
};

const deleteAnalysys = (item) => {
  const analysis = JSON.parse(JSON.stringify(item));
  const itemsNoDelete = arrAnalysisAdd.value.filter(
    (e) => e.IdAnalisis !== analysis.IdAnalisis
  );
  arrAnalysisAdd.value = itemsNoDelete;
  state.priceTotal = 0;
  itemsNoDelete.forEach((analysis) => {
    state.priceTotal += analysis.PrecioBase;
  });
};

const sendData = async (e) => {
  e.preventDefault();
  const file = document.getElementById("icono");
  msgError.value = "";
  clickSend.value = true;
  v$["value"].$touch;
  if (v$["value"].$invalid) {
    setTimeout(() => {
      const pageWrapper = document.querySelector(".pageWrapper");
      if (pageWrapper) {
        pageWrapper.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    }, 1000);
    return;
  }

  if (parseFloat(state.priceRegular) > parseFloat(state.priceTotal)) {
    msgError.value = "El precio regular no puede ser mayor al precio total.";
    return;
  }

  const dateCreate = new Date(state.dateStart);
  const dateFinish = new Date(state.dateEnd);

  if (dateFinish <= dateCreate) {
    msgError.value = "Fecha de vencimiento debe ser mayor a fecha de inicio.";
    return;
  }

  if (file && !file.files[0]) {
    msgError.value = "Icono requerido";
    return;
  }

  if (arrAnalysisAdd.value && arrAnalysisAdd.value.length == 0) {
    msgError.value = "Debe agregar análisis al paquete";
    return;
  }

  console.log("Pasaaa..");
  let arrAnalisis = JSON.stringify(arrAnalysisAdd.value);

  const paramsCreate = new FormData();
  let msgAlert = "";
  if (routePath.value === "/edit-package") {
    paramsCreate.append("funcion", "updatePaquete");
    paramsCreate.append(
      "idPaquete",
      JSON.parse(JSON.stringify(infoPackageEdit.value)).idPaquete
    );
  } else {
    paramsCreate.append("funcion", "insertPaquete");
  }

  paramsCreate.append("nombre", state.nombre);
  paramsCreate.append("descripcion", state.description);
  paramsCreate.append("precioOferta", state.priceRegular);
  paramsCreate.append("precioReal", state.priceTotal);
  paramsCreate.append("fechaInicio", state.dateStart);
  paramsCreate.append("fechaVencimiento", state.dateEnd);
  paramsCreate.append("condiciones", state.condiciones);
  paramsCreate.append("arrayAnalisis", arrAnalisis);
  paramsCreate.append("icono", file.files[0]);
  paramsCreate.append("updateIcon", state.editIcon);

  showLoading.value = true;
  const respCreate = await axios.post(
    "/api/api-cotizador-escalabs/app/api.php",
    paramsCreate
  );
  showLoading.value = false;

  if (respCreate.data == 1) {
    msgAlert =
      routePath.value === "/edit-package"
        ? "Paquete modificado con éxito"
        : "Paquete creado con éxito";

    const pageWrapper = document.querySelector(".pageWrapper");
    if (pageWrapper) {
      pageWrapper.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
    swal({
      title: "Buen trabajo!",
      text: msgAlert,
      icon: "success",
      button: "Confirmar",
    });
    router.push({
      path: "/list-package",
    });
    return;
  }

  swal({
    title: "Ooops!",
    text: "Ocurrió un error. Vuelve a intentarlo!",
    icon: "error",
    button: "Ok",
  });
};

const routePath = computed(() => {
  return route.path;
});

watch(textAnalisis, (value) => {
  if (!value) {
    showResults.value = false;
  }
});
</script>

<style scoped>
.container__create-package {
  font-family: "Breuer", sans-serif;
  font-weight: 400;
}
h1 {
  color: var(--green-primary-color);
  font-family: "Breuer", sans-serif;
  font-weight: 700;
  font-size: 19px;
  margin-bottom: 15px;
}

.text-div {
  border-top: 1px solid #ccc;
  padding-top: 15px;
  text-align: left;
  font-weight: bold;
  font-size: 15px;
}

.form__prices {
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}
.form__date {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.form__date label {
  margin: 0 0 10px 0;
  font-weight: bold;
  font-size: 15px;
}

.btn__submit {
  border: 0;
  outline: 0;
  background-color: var(--green-primary-color);
  color: white;
  font-size: 18px;
  padding: 5px 10px;
  width: 200px;
  margin: auto;
  font-family: "Breuer", sans-serif;
  font-weight: 700;
  border-radius: 5px;
}

.btn__go-list {
  background-color: transparent;
  color: var(--green-primary-color);
  text-decoration: underline;
  cursor: pointer;
  font-family: "Breuer", sans-serif;
  font-weight: 500;
  font-size: 16px;
}

.btn__submit:focus {
  box-shadow: none !important;
}

.search__analysis-input {
  position: relative;
}

.search__analysis-input input {
  padding-right: 30px;
}

.search__analysis-input input::placeholder {
  font-family: "Breuer", sans-serif;
  font-size: 16px;
}

.search__analysis-input i {
  position: absolute;
  top: 11px;
  right: 27px;
  font-size: 18px;
}

.alert_input {
  color: #ea151d;
  font-size: 12px;
  font-weight: 500;
}

.msg_info {
  color: #ccc;
  font-style: italic;
  font-size: 11px;
  text-align: left;
}

.input_invalid {
  border: 2px solid #ea151d;
}

input,
textarea {
  transition: all 0.3s ease-in-out;
  font-family: "Breuer", sans-serif;
}

input::placeholder,
textarea::placeholder {
  font-family: "Breuer", sans-serif;
  font-size: 16px;
}

.container__analysis-add {
  display: flex;
  flex-direction: column;
  text-align: left;
  border: 2px solid var(--green-secondary-color);
  border-radius: 10px;
  margin: 15px 0 10px;
  padding: 8px;
  font-family: "Breuer", sans-serif;
  font-size: 15px;
}

.analysis-add__list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0 0;
  flex-wrap: wrap;
}

.analysis-add__list .item__analysis-add {
  display: flex;
  position: relative;
  width: 100px;
  margin: 5px;
  background-color: var(--green-secondary-color);
  padding: 3px;
  border-radius: 5px;
  flex: 100px;
  padding-right: 20px;
}

.analysis-add__list .item__analysis-add p {
  font-size: 12px;
  text-align: left;
  margin: 0;
}

.analysis-add__list .item__analysis-add button {
  border: 0;
  background: transparent;
  padding: 0;
  position: absolute;
  right: 5px;
  top: 0;
  font-family: "Breuer", sans-serif;
  font-weight: 700;
  font-size: 17px;
}

.desc-res {
  font-size: 14px;
  color: var(--gray-primary-color);
}

.name-res {
  font-size: 18px;
  color: var(--gray-primary-color);
  font-weight: bolder;
  text-transform: uppercase;
}

.results-empty {
  height: 40vh;
  text-align: center;
  color: var(--gray-primary-color);
  font-size: 17px;
}

.results-empty > i {
  margin: 0 5px 10px 0;
  font-size: 30px;
}

.delete__analysis {
  cursor: pointer;
}

.error_msg {
  color: #ea151d;
  font-weight: bold;
  font-size: 12px;
}

.section_logo label {
  margin: 0 0 10px 0;
  font-weight: bold;
  font-size: 15px;
}

.section_logo {
  text-align: left;
}

.section_logo img {
  background-color: var(--orange-primary-color);
  border-radius: 10px;
  margin: 10px 0;
}

@media screen and (min-width: 601px) {
  .btn__desktop {
    display: block;
  }

  .btn__mobile {
    display: none;
  }
}

@media screen and (min-width: 769px) {
  .container__create-package {
    width: 100%;
    margin: auto;
    display: flex;
    justify-content: space-between;
  }

  .container__form {
    width: 80%;
    margin: 0 auto;
  }

  .container__results {
    width: 80%;
    margin: 0 20px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 20px;
  }

  .section__head-results {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: white;
  }
}

@media screen and (min-width: 1024px) {
  .container__results {
    height: 100vh;
  }
}

@media screen and (max-width: 600px) {
  .container__results {
    height: 100%;
  }
  .btn__desktop {
    display: none;
  }

  .btn__mobile {
    display: block;
  }
}
</style>
