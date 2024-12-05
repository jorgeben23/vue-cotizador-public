<template>
  <div class="container__package rounded">
    <button @click="active = !active">
      <i class="fa-solid fa-chevron-down" :class="{ 'rotate-i': active }"></i>
      {{ item.nombre }}
    </button>
    <slide-up-down v-model="active" :duration="500" class="package__detail">
      <p class="detail__status">
        <b>Estado:</b> &nbsp; &nbsp; &nbsp;<span
          :class="[item.publicado == 0 ? 'no-active' : 'active']"
          >{{ item.publicado == 0 ? "No publicado" : "Publicado" }}</span
        >
        <i class="fa-solid fa-check" v-if="item.publicado == 1"></i>
        <i class="fa-solid fa-circle-exclamation" v-else></i>
      </p>

      <div class="detail__flex">
        <p class="detail__content" v-if="item.fechaInicio">
          <b>Fecha de inicio:</b> &nbsp; &nbsp;
          <span>{{ item.fechaInicio.substring(0, 10) }}</span>
        </p>

        <p class="detail__content" v-if="item.fechaVencimiento">
          <b>Fecha de vencimiento:</b> &nbsp; &nbsp;<span>{{
            item.fechaVencimiento.substring(0, 10)
          }}</span>
        </p>
      </div>

      <p v-if="dateNow > parseFechaVencimiento" class="alert__caducate">
        <i class="fa-solid fa-bell"></i>
        <b>Paquete caducado</b>
      </p>

      <div class="package__actions">
        <button
          class="btn-detail btn-info"
          data-toggle="modal"
          data-target="#modalDetail"
          @click="$emit('actionDetail', item)"
        >
          Ver detalle
        </button>
        <button class="btn-edit btn-primary" @click="$emit('actionEdit', item)">
          Editar
        </button>
        <button
          class="btn-delete btn-danger"
          data-toggle="modal"
          data-target="#exampleModalCenter"
          @click="$emit('actionDelete', item)"
        >
          Eliminar
        </button>
        <button
          class="btn-publicate btn-success"
          @click="$emit('actionPublicate', item)"
          v-if="item.publicado == 0"
          :disabled="dateNow > parseFechaVencimiento"
        >
          Publicar
        </button>
      </div>
    </slide-up-down>
  </div>
</template>

<script setup>
import SlideUpDown from "vue3-slide-up-down";
import { ref } from "@vue/reactivity";
import { computed } from "vue";

let active = ref(true);

const props = defineProps({
  item: Object,
  index: Number,
});

const emit = defineEmits([
  "actionDetail",
  "actionDelete",
  "actionPublicate",
  "actionEdit",
]);

const dateNow = computed(() => {
  return new Date().toLocaleDateString();
});

const parseFechaVencimiento = computed(() => {
  if (props.item) {
    return new Date(props.item.fechaVencimiento).toLocaleDateString();
  }
});
</script>

<style scoped>
i {
  transition: transform 0.3s ease-in;
}

.rotate-i {
  transform: rotate(180deg);
  transition: transform 0.3s ease-out;
}
.container__package {
  margin: 0 0 10px 0;
  border: 1px solid var(--green-secondary-color);
  background: var(--green-secondary-color);
  font-family: "Breuer", sans-serif;
  font-weight: 400;
}
.container__package button {
  border: 0;
  outline: 0;
  color: var(--green-primary-color);
  font-weight: bold;
  font-size: 18px;
  width: 100%;
  text-align: left;
  padding: 0.6rem;
  cursor: pointer;
  font-family: "Breuer", sans-serif;
  font-weight: 700;
}

.container__package .package__detail {
  padding: 0 0.6rem;
  font-size: 16px;
}

.container__package .detail__flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail__flex p {
  margin: 0 0 20px;
}

:is(.detail__status, .detail__content) b {
  font-weight: 500;
}
.package__detail .detail__status,
.package__detail .detail__content {
  display: flex;
  align-items: center;
}

.package__detail .detail__status .fa-check,
.package__detail .detail__status .fa-circle-exclamation {
  color: var(--green-primary-color);
  font-weight: bold;
  margin-left: 3px;
}

.package__detail .detail__status .fa-circle-exclamation {
  color: var(--orange-primary-color);
}

.package__detail .detail__status span.active {
  color: var(--green-primary-color);
  font-weight: 500;
}

.package__detail .detail__status span.no-active {
  color: var(--orange-primary-color);
  font-weight: 500;
}

.package__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.package__actions button {
  font-size: 16px;
  font-weight: normal;
  padding: 5px 0;
  text-align: center;
  margin: 0 5px 10px;
  cursor: pointer;
  outline: 0;
  border-radius: 5px;
  font-weight: 700;
  color: white;
  border: 0;
}

.alert__caducate {
  color: #ea151d;
  font-weight: 500;
  font-size: 12px;
  border: 1px solid #ea151d;
  border-radius: 5px;
  padding: 5px 0;
}

.alert__caducate i {
  padding: 0 5px;
}

.btn-publicate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media screen and (min-width: 1024px) {
  .container__package {
    padding: 0 20px;
  }
}

@media screen and (max-width: 600px) {
  .container__package .detail__flex {
    flex-direction: column;
    align-items: flex-start;
  }

  .container__package .package__detail {
    font-size: 14px;
  }

  .container__package .detail__flex p {
    margin-bottom: 10px;
  }

  .package__actions button {
    font-size: 14px;
  }
}
</style>
