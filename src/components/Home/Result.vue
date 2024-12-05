<template>
  <div class="item-result">
    <div class="rounded item-result__detail">
      <p class="w-100 text-left item-result-name" id="result-name">
        {{ result["Nombre"] }}
      </p>


   
      <p v-if="result.PrecioBase == 0"
        class="text-left d-flex justify-content-start align-items-center item-result-price pl-2"
      >
        S/ {{ result["precioReal"] }}
      </p>
      <p v-else class="text-left d-flex justify-content-start align-items-center item-result-price pl-2">
        S/ {{ result["PrecioBase"] }}
      </p>


      <button
        @click.prevent="$emit('actionDetail', result)"
        class="text-center item-result_action-detail"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        Ver detalles
      </button>
    </div>
    <button
      class="item-result-add rounded"
      @click.prevent="$emit('actionAdd', result)"
      v-if="doAdd"
    >
      <i
        class="fa-solid fa-cart-shopping text-white"
        v-if="routeNow !== '/create-package'"
      ></i>
      <i class="fa-solid fa-plus text-white" v-else></i>
    </button>

    <button
      class="item-result-remove rounded"
      @click.prevent="$emit('actionDelete', index)"
      v-else
    >
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  result: Object,
  doAdd: Boolean,
  index: Number,
});

const route = useRoute();

const routeNow = computed(() => {
  return route.path;
});

const emit = defineEmits(["actionDetail", "actionAdd", "actionDelete"]);
</script>

<style scoped>
.item-result {
  margin: 5px 0;
  display: flex;
  font-weight: 400;
}

.item-result__detail {
  display: flex;
  align-items: stretch;
  justify-content: center;
  background-color: var(--green-secondary-color);
  border: 1px solid var(--green-secondary-color);
  width: 100%;
  margin: 0 2px 0 0;
  padding: 4px 0;
}

.item-result p {
  margin: 0;
  color: var(--green-primary-color);
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 700;
}

.item-result .item-result-name {
  color: var(--gray-primary-color);
  font-weight: 500;
  padding-left: 10px;
}

.item-result .item-result-price {
  width: 200px;
}

@media screen and (min-width: 361px) and (max-width: 600px) {
  .item-result .item-result-price {
    width: 120px;
  }
}

@media screen and (min-width: 320px) and (max-width: 360px) {
  .item-result .item-result-price {
    width: 40%;
  }
}

.item-result button {
  border: 0;
  outline: 0;
}

.item-result .item-result_action-detail {
  border: 0;
  font-size: 10px;
  color: var(--green-primary-color);
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
}

.item-result .item-result-add {
  background-color: var(--orange-primary-color);
  padding: 0 9px;
  cursor: pointer;
}

.item-result .item-result-remove {
  background-color: #ea151d;
  color: white;
  cursor: pointer;
}
</style>
