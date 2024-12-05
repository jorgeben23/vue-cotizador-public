<template>
  <div
    class="container d-flex justify-content-center flex-column py-4 container__list-package"
  >
    <button class="rounded btn__create-package" @click="goCreate">
      Crear paquete
    </button>

    <div
      class="section__list-packages"
      :style="[listPackage && listPackage.length < 3 ? { height: '70vh' } : '']"
    >
      <div class="list-packages__search">
        <input
          type="text"
          placeholder="Buscar paquete"
          v-model="analysisSearch"
          @keyup.enter="listPackages"
        />
        <i class="fa-solid fa-magnifying-glass" @click="listPackages"></i>
      </div>

      <div
        class="list-packages"
        v-if="!showLoadPackage && listPackage && listPackage.length > 0"
      >
        <Package
          v-for="(item, ix) in listPackage"
          :key="ix"
          :item="item"
          :index="ix"
          @action-detail="showDetailData"
          @action-delete="deleteItem"
          @action-publicate="updatePublicate"
          @action-edit="editItem"
        />
      </div>

      <div class="list-load" v-else-if="showLoadPackage">
        <Load />
        <p>Cargando paquetes...</p>
      </div>

      <div
        class="d-flex align-items-center justify-content-center flex-column list-empty"
        v-else-if="!showLoadPackage && listPackage.length == 0"
      >
        <i class="fa-regular fa-face-sad-tear mr-1 mb-4"></i> No existen
        paquetes.
      </div>
    </div>

    <!-- START-- Popup detalle de analisis -->
    <div
      class="modal fade"
      id="modalDetail"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalDetailTitle"
      aria-hidden="true"
    >
      <ModalDetail
        :content="resultDetailSelected"
        :loading="loadingDetail"
        :isPackage="true"
      />
    </div>
    <!-- END-- -->

    <!-- START-- Popup eliminar analisis -->
    <div
      class="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content text-center py-4 px-3">
          <button
            type="button"
            class="close close-delete"
            data-dismiss="modal"
            aria-label="Close"
            id="modalDelete"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <p class="text-delete">¿Seguro que desea eliminar este paquete?</p>
          <div class="d-flex align-items-center justify-content-center">
            <button
              class="btn-primary rounded mx-2 py-2 px-4"
              @click="deleteAnalysis"
            >
              CONFIRMAR
            </button>
            <button
              class="btn-danger rounded mx-2 py-2 px-4"
              data-dismiss="modal"
            >
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- END-- -->

    <!-- START-- Loading results -->
    <Loading :loading="showLoading" />
    <!-- END-- -->
  </div>
</template>

<script setup>
import Package from "./Package.vue";
import ModalDetail from "../Home/ModalDetail.vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Load from "../Icons/Load.vue";
import Loading from "../Loading.vue";

let loadingDetail = ref(false);
let resultDetailSelected = ref({});
let listPackage = ref([]);
let showLoadPackage = ref(false);
let analysisSearch = ref("");
let idPaqueteToDelete = ref(-1);
let showLoading = ref(false);

const route = useRouter();

const goCreate = () => {
  route.push({
    path: "/create-package",
  });
};

onMounted(() => {
  listPackages();
});

const listPackages = async () => {
  const paramListPackage = new FormData();

  paramListPackage.append("funcion", "listPaquetes");
  paramListPackage.append("nombre", analysisSearch.value);
  showLoadPackage.value = true;
  const resp = await axios.post(
    "/api/api-cotizador-escalabs/app/api.php",
    paramListPackage
  );
  showLoadPackage.value = false;
  const pageWrapper = document.querySelector(".pageWrapper");
  if (pageWrapper) {
    pageWrapper.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
  sessionStorage.removeItem("alert");
  listPackage.value = [];
  if (resp.data && resp.data.length > 0) {
    listPackage.value = resp.data;
    return;
  }
};

const showDetailData = async (data) => {
  const item = JSON.parse(JSON.stringify(data));
  loadingDetail.value = false;
  resultDetailSelected.value["idPaquete"] = item.idPaquete;
  resultDetailSelected.value["nombre"] = item.nombre;
  resultDetailSelected.value["descripcion"] = item.descripcion;
  resultDetailSelected.value["precioOferta"] = item.precioOferta;
  resultDetailSelected.value["precioReal"] = item.precioReal;
  resultDetailSelected.value["fechaInicio"] = item.fechaInicio.substring(0, 10);
  resultDetailSelected.value["fechaVencimiento"] =
    item.fechaVencimiento.substring(0, 10);
  resultDetailSelected.value["condiciones"] = item.condiciones;

  const idPaquete = item["idPaquete"];

  const paramDetailPackage = new FormData();

  paramDetailPackage.append("funcion", "listAnalisisByPaquete");
  paramDetailPackage.append("idPaquete", idPaquete);
  loadingDetail.value = true;
  const resp = await axios.post(
    "/api/api-cotizador-escalabs/app/api.php",
    paramDetailPackage
  );
  loadingDetail.value = false;
  if (resp && resp.data && resp.data.length > 0) {
    resultDetailSelected.value["arrayAnalisis"] = resp.data;
    return;
  }

  resultDetailSelected.value["arrayAnalisis"] = [];
};

const deleteItem = (data) => {
  const item = JSON.parse(JSON.stringify(data));
  idPaqueteToDelete.value = item["idPaquete"];
};

const deleteAnalysis = async () => {
  const paramsDelete = new FormData();

  paramsDelete.append("funcion", "DeletePaquete");
  paramsDelete.append("idPaquete", idPaqueteToDelete.value);
  const buttonClose = document.getElementById("modalDelete");
  showLoading.value = true;

  const resp = await axios.post(
    "/api/api-cotizador-escalabs/app/api.php",
    paramsDelete
  );

  showLoading.value = false;
  if (resp.data == 1) {
    buttonClose.click();
    swal({
      title: "Buen trabajo!",
      text: "Paquete eliminado con éxito",
      icon: "success",
      button: "Confirmar",
    });
    listPackages();
    const pageWrapper = document.querySelector(".pageWrapper");
    if (pageWrapper) {
      pageWrapper.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }
};

const updatePublicate = async (data) => {
  const item = JSON.parse(JSON.stringify(data));

  const idPaquete = item["idPaquete"];

  const paramsPublicate = new FormData();

  paramsPublicate.append("funcion", "updatePaquetePublicado");
  paramsPublicate.append("idPaquete", idPaquete);

  showLoading.value = true;

  const resp = await axios.post(
    "/api/api-cotizador-escalabs/app/api.php",
    paramsPublicate
  );

  showLoading.value = false;
  if (resp.data == 1) {
    swal({
      title: "Buen trabajo!",
      text: "Paquete publicado con éxito",
      icon: "success",
      button: "Confirmar",
    });
    listPackages();
  }
};

const editItem = (data) => {
  const item = JSON.parse(JSON.stringify(data));
  sessionStorage.setItem("__package", JSON.stringify(item));
  route.push({
    path: "/edit-package",
  });
};

watch(analysisSearch, (value) => {
  if (!value) {
    listPackages();
  }
});
</script>

<style scoped>
.container__list-package {
  font-family: "Breuer", sans-serif;
  font-weight: 400;
}
.btn__create-package {
  background-color: var(--orange-primary-color);
  color: white;
  font-size: 18px;
  padding: 0.5rem 1rem;
  width: 80%;
  margin: auto;
  cursor: pointer;
  border: 0;
  font-family: "Breuer", sans-serif;
  font-weight: 700;
}

.section__list-packages .list-packages__search {
  position: relative;
}

.section__list-packages .list-packages__search > input {
  margin: 20px 0;
  padding-right: 30px;
  outline: 0;
  font-family: "Breuer", sans-serif;
  font-size: 16px;
  font-weight: 400;
}

.section__list-packages .list-packages__search > input:focus {
  border: 1px solid var(--green-primary-color);
}

.section__list-packages .list-packages__search > i {
  position: absolute;
  right: 10px;
  top: 30px;
  font-size: 18px;
}

.close-delete {
  position: absolute;
  right: 10px;
  top: 5px;
}

.modal-content .text-delete {
  font-size: 16px;
}

.list-load {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 75vh;
}

.list-empty {
  font-size: 16px;
  color: var(--gray-primary-color);
  margin-top: 30px;
}

.list-empty i {
  font-size: 90px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
@media (min-width: 1025px) {
  .container__list-package {
    width: 50%;
    margin: auto;
    text-align: left;
  }

  .container__list-package .btn__create-package {
    width: 250px;
  }

  .container__list-package .list-packages__search {
    width: 400px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .container__list-package {
    width: 80%;
    margin: auto;
    text-align: left;
  }

  .container__list-package .list-packages__search,
  .container__list-package .btn__create-package {
    width: 300px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .container__list-package {
    width: 90%;
    margin: auto;
    text-align: left;
  }

  .container__list-package .btn__create-package {
    width: 250px;
  }

  .container__list-package .list-packages__search {
    width: 50%;
  }
}
</style>
