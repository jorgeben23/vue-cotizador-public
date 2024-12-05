<template>
  <div class="container">
    <swiper
      :modules="modules"
      :slides-per-view="totalSlide"
      :slides-per-group="1"
      :space-between="10"
      navigation
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="item in newListPackage" :key="item.IdPaquete">
        <Paquete @action-detail="showDetails" :item="item" />
      </swiper-slide>
    </swiper>

    <!-- START-- Popup detalle de analisis -->
    <div
      class="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
      v-if="showModalPackage"
    >
      <ModalDetail
        :content="resultDetailSelected"
        :loading="loadingDetail"
        :isPackage="true"
        @addActionPackage="addPackage"
      />
    </div>

    <!-- END-- -->

    <!-- START-- Loading results -->
    <Loading :loading="showLoading" />
    <!-- END-- -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Paquete from "../Paquete.vue";
import ModalDetail from "./ModalDetail.vue";
import axios from "axios";
import Loading from "../Loading.vue";
import { useStore } from "vuex";
import swal from "sweetalert";

const props = defineProps({
  list: Array,
});

const store = useStore();

let showModalPackage = ref(false);
let resultDetailSelected = ref({});
let loadingDetail = ref(false);
let totalSlide = ref(1.2);
const modules = ref([Navigation]);
let showLoading = ref(false);

onMounted(() => {
  const listPackages = JSON.parse(JSON.stringify(props.list));
  if (window.innerWidth > 600) {
    listPackages && listPackages.length < 4
      ? (totalSlide.value = listPackages.length)
      : (totalSlide.value = 4);
  }
});

const onSwiper = (swiper) => {
  // console.log(swiper);
};
const onSlideChange = () => {
  // console.log("slide change");
};

const showDetails = async (data) => {
  const item = JSON.parse(JSON.stringify(data));

  showModalPackage.value = true;
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

const addPackage = (item) => {
  const packageItem = JSON.parse(JSON.stringify(item));
  console.log(packageItem);
  let itemToAdd = {
    idAnalisis: packageItem["idPaquete"],
    Nombre: packageItem["nombre"],
    PrecioBase: packageItem["precioOferta"],
    precioReal: packageItem["precioReal"],
    arrayAnalisis: packageItem["arrayAnalisis"],
    descripcion: packageItem["descripcion"],
    fechaInicio: packageItem["fechaInicio"],
    fechaVencimiento: packageItem["fechaVencimiento"],
    condiciones: packageItem["condiciones"],
    isPackage: true,
  };
  store.dispatch("setListAnalysis", {
    action: "push",
    item: itemToAdd,
  });
  sessionStorage.setItem("__arr-add", JSON.stringify(listAnalisis.value));
  showLoading.value = true;
  setTimeout(() => {
    showLoading.value = false;
    showModalPackage.value = false;
    $("#exampleModalCenter").modal("hide");
    swal({
      title: "Bien!",
      text: "Paquete agregado con éxito.",
      icon: "success",
      button: "Confirmar",
    });
  }, 1000);
};

const newListPackage = computed(() => {
  const arrList = JSON.parse(JSON.stringify(props.list));
  return arrList.filter((e) => {
    if (e.publicado == 1 && new Date() <= new Date(e.fechaVencimiento)) {
      return e;
    }
  });
});

const listAnalisis = computed(() => {
  return JSON.parse(JSON.stringify(store.getters["getListAnalysis"]));
});
</script>

<style scoped></style>
