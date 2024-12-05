<template>
  <div
    class="container_item-package d-flex align-items-center justify-content-center flex-column"
  >
    <div class="icon_package" v-if="item.ruta_icono">
      <img :src="item.ruta_icono" :alt="item.nombre" width="50" height="50" />
    </div>
    <p class="package__name">{{ item.nombre }}</p>


    <!-- <p>{{ item.precioOferta }}</p>  -->

    <p class="package__description" >{{ item.descripcion }}</p>

    <div v-if="item.precioOferta == 0"
      class="item-package__prices d-flex align-items-center justify-content-center mb-2"
    >
      <!-- <p class="mx-1 my-0">S/ {{ item.precioOferta }}</p> -->
      <p class="mx-1 my-0">S/ {{ item.precioReal }}</p>
    </div>

    <div v-else>

      <div 
      class="item-package__prices d-flex align-items-center justify-content-center mb-2"
    >
      <p class="mx-1 my-0">S/ {{ item.precioOferta }}</p>
      <p class="mx-1 my-0">S/ {{ item.precioReal }}</p>
    </div>

    <p class="package__name">Oferta</p>

    </div>


    <span v-if="item.fechaVencimiento"
      >Vigencia hasta: {{ item.fechaVencimiento.substring(0, 10) }}</span
    >

    <button
      class="item-package__button my-3 text-white rounded"
      data-toggle="modal"
      data-target="#exampleModalCenter"
      @click="$emit('actionDetail', item)"
    >
      VER PAQUETE
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  item: Object,
});
const emit = defineEmits(["actionDetail"]);

const dateNow = computed(() => {
  return new Date().toLocaleDateString();
});

const parseFechaVencimiento = computed(() => {
  if (props.item) {
    return new Date(props.item.fechaVencimiento).toLocaleDateString();
  }
});
</script>

<style>
.container_item-package {
  border: 1px solid var(--green-secondary-color);
  border-radius: 10px;
  padding: 0.5rem 0.6rem;
  background-color: var(--green-secondary-color);
  height: 100%;
}

.icon_package {
  width: 70px;
  height: 70px;
  background-color: var(--orange-primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_item-package .package__name {
  font-size: 18px;
  margin: 0.5rem;
  color: var(--green-primary-color);
  font-weight: 700;
  flex: 1;
}

.container_item-package .package__description {
  font-size: 15px;
  margin: 0.5rem;
  color: #555;
  font-weight: 400;
  font-style: italic;
  text-align: justify;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.container_item-package .item-package__prices p {
  font-size: 18px;
  font-weight: 500;
  color: var(--green-primary-color);
}

.container_item-package .item-package__prices > p:nth-child(2) {
  text-decoration: line-through;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
}

.container_item-package span {
  font-size: 14px;
  color: #949494;
  text-align: left;
  font-weight: 400;
}

.item-package__button {
  background-color: var(--green-primary-color);
  border: 0;
  outline: 0;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Breuer";
  font-weight: 700;
}
</style>
