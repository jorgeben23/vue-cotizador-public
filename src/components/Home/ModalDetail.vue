<template>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <button
        type="button"
        class="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true">CERRAR</span>
      </button>
      <template v-if="!loading">
        <div class="modal-header">
          <h5>{{ content.nombre }}</h5>
        </div>
        <div class="modal-body" v-if="!isPackage">
          <p v-if="content.muestra">
            <b> Tipo de muestra: </b>
            <br />
            <span style="font-weight: normal; font-size: 15px">{{
              content.muestra
            }}</span>
          </p>
          <p v-if="content.volumen">
            <b> Volúmen mínimo requerido: </b>
            <br />
            <span style="font-weight: normal; font-size: 15px">{{
              content.volumen
            }}</span>
          </p>
          <p v-if="content.conservacion">
            <b> Tipo de envase: </b>
            <br />
            <span style="font-weight: normal; font-size: 15px">
              {{ content.conservacion }}
            </span>
          </p>
          <p v-if="content.tiempoProceso">
            <b> Días de proceso: </b>
            <br />
            <span style="font-weight: normal; font-size: 15px">
              {{ content.tiempoProceso }}
            </span>
          </p>
          <p v-if="content.condiciones">
            <b> Condiciones pre-analíticas: </b>
            <br />
            <span style="font-weight: normal; font-size: 15px">
              {{ content.condiciones }}
            </span>
          </p>
        </div>

        <div class="modal-body modal__package" v-else>
          <span class="texto-desc">{{ content.descripcion }}</span>

          <p class="title__prices">Precios:</p>
          <div class="modal__package-flex flex-two">
            <p v-if="content.precioOferta">
              Precio oferta:
              <span style="font-weight: normal; font-size: 14px"
                >S/ {{ content.precioOferta }}</span
              >
            </p>
            <p v-if="content.precioReal">
              Precio real:
              <span style="font-weight: normal; font-size: 14px"
                >S/ {{ content.precioReal }}</span
              >
            </p>
          </div>

          <div class="modal__package-list">
            <b>Detalle del paquete:</b>
            <ol>
              <li
                v-for="analisis in content.arrayAnalisis"
                :key="analisis['idPaqueteAnalisis']"
              >
                {{ analisis["desc_analisis"] }} -
                <span>S/ {{ analisis["precio_analisis"] }}</span>
              </li>
            </ol>
          </div>

          <div
            class="modal__package-list mt-2 content_conditions"
            v-if="content['condiciones']"
          >
            <b>Condiciones pre-analíticas:</b>
            <p>
              {{ content["condiciones"] }}
            </p>
          </div>

          <div class="modal__package-flex flex-one">
            <b>Vigencia:</b>
            <p v-if="content.fechaInicio">
              <b>Fecha de inicio: </b>
              <span style="font-weight: normal; font-size: 14px">{{
                content.fechaInicio
              }}</span>
            </p>
            <p v-if="content.fechaVencimiento">
              <b> Fecha de vencimiento: </b>
              <span style="font-weight: normal; font-size: 14px">{{
                content.fechaVencimiento
              }}</span>
            </p>
          </div>
        </div>
        <button
          class="rounded my-2 button_add-package"
          v-if="
            isPackage &&
            routePath !== '/cart' &&
            routePath !== '/list-package' &&
            !content['isPaqueteHome']
          "
          @click="addPackage(content)"
        >
          AGREGAR PAQUETE
        </button>
      </template>

      <template v-else>
        <div class="d-flex justify-content-center align-items-center">
          <Load />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import Load from "../Icons/Load.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  content: Object,
  loading: Boolean,
  isPackage: Boolean,
});

const route = useRoute();

const emit = defineEmits(["close", "addActionPackage"]);

const addPackage = (item) => {
  emit("addActionPackage", item);
};

const closePopup = () => {
  emit("close");
};

const routePath = computed(() => {
  return route.path;
});
</script>

<style scoped>
.close {
  padding: 0 10px;
  position: absolute;
  right: 5px;
  top: 5px;
  font-family: "Breuer";
  font-size: 16px;
}

.close > span {
  font-size: 13px;
}

.modal-content {
  border-radius: 1rem;
  padding: 2rem 1rem;
  font-family: "Breuer";
  font-weight: 400;
}

.modal-header {
  border: 0;
  border-radius: 0;
}

.modal-header h5 {
  color: var(--gray-primary-color);
  font-weight: 700;
  font-size: 20px;
  font-family: "Breuer";
}
.modal-body p {
  text-align: justify;
  color: #424242;
}

.modal-body {
  height: 50vh;
  overflow-y: auto;
}
.modal-body b {
  color: var(--gray-primary-color);
  font-weight: 500;
  font-size: 15px;
}
.button_add-package {
  background-color: var(--green-primary-color);
  color: white;
  width: 70%;
  margin: auto;
  padding: 0.4rem;
  font-weight: bold;
  cursor: pointer;
  font-family: "Breuer", sans-serif;
  font-size: 16px;
}

.modal__package {
  padding: 10px;
}

.modal__package span {
  text-align: left !important;
  font-size: 16px;
}

.modal__package-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.flex-one {
  border-bottom: 1px solid var(--green-secondary-color);
  border-top: 1px solid var(--green-secondary-color);
  padding: 5px 0;
  margin-bottom: 5px;
}

.flex-one p {
  padding: 10px 0;
}

.flex-one b {
  color: var(--gray-primary-color);
  font-weight: 700;
  font-size: 15px;
}
.modal__package-flex p {
  margin: 0;
  width: 100%;
  /* color: #555; */
}

.title__prices {
  color: var(--gray-primary-color) !important;
  font-weight: 700 !important;
  padding: 20px 0 0;
  font-size: 15px;
  border-top: 1px solid var(--green-secondary-color);
  margin-top: 10px;
}

.flex-two {
  margin-top: 10px;
  border-bottom: 1px solid var(--green-secondary-color);
}

.flex-two p {
  margin: 5px 0 15px;
  font-size: 14px;
}

.modal__package-list {
  text-align: left;
  color: var(--gray-primary-color);
}

.modal__package-list ol {
  padding: 0 25px;
}

.modal__package-list ol li {
  padding: 10px 0;
  color: #424242;
  font-size: 14px;
}

.modal__package-list ol li span {
  font-size: 14px;
}

.content_conditions {
  font-size: 14px;
  border-top: 1px solid var(--green-secondary-color);
  padding: 10px 0;
}

@media screen and (max-width: 600px) {
  .modal__package {
    padding: 0;
  }

  .modal__package-flex {
    margin: 10px;
  }

  .modal__package-flex.flex-one {
    flex-direction: column;
  }

  .modal__package-flex.flex-two {
    margin-top: 5px;
  }
  .modal__package-flex p {
    padding: 5px 0;
  }

  .title__prices {
    margin-top: 5px;
  }

  .texto-desc {
    text-align: left !important;
    margin-left: -55% !important;
  }
}
</style>
