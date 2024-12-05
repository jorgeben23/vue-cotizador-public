<template>
  <div class="container__header sticky-top">
    <!--Header-->
    <div class="header-wrap d-flex barra">
      <div class="container">
        <div class="row align-items-center">
          <!--Desktop Logo-->
          <div class="logo col-md-2 col-lg-2 d-none d-lg-block">
            <router-link to="/">
              <img
                src="./../assets/images/escalabs.png"
                class="logo"
                alt="Belle Multipurpose Html Template"
                title="Belle Multipurpose Html Template"
              />
            </router-link>
          </div>
          <!--End Desktop Logo-->
          <div class="col-2 col-sm-3 col-md-3 col-lg-8">
            <div class="d-block d-lg-none">
              <!-- <button
                type="button"
                class="btn--link site-header__menu js-mobile-nav-toggle mobile-nav--open"
              >
                <i class="icon anm anm-times-l text-white"></i>
                <i class="anm anm-bars-r text-white"></i>
              </button> -->
            </div>

            <!--Desktop Menu-->
            <nav class="grid__item" id="AccessibleNav">
              <!-- for mobile -->
              <ul
                id="siteNav"
                class="site-nav medium center hidearrow opciones"
              >
                <!-- <li class="lvl1 parent megamenu">
                  <router-link to="/" class="item">INICIO</router-link>
                </li> -->
              </ul>
            </nav>
          </div>
          <!--Mobile Logo-->
          <div
            class="col-6 col-sm-6 col-md-6 col-lg-2 d-block d-lg-none mobile-logo"
          >
            <router-link to="/">
              <img
                src="./../assets/images/escalabs.png"
                alt="Belle Multipurpose Html Template"
                title="Belle Multipurpose Html Template"
              />
            </router-link>
          </div>
          <!--Mobile Logo-->
          <div
            class="col-4 col-sm-3 col-md-3 col-lg-2 pr-4"
            v-if="
              routePath !== '/create-package' &&
              routePath !== '/list-package' &&
              routePath !== '/edit-package'
            "
          >
            <div class="site-cart" @click="goCart">
              <i class="icon anm anm-bag-l carrito"></i>
              <span
                id="CartCount"
                class="site-header__cart-count"
                data-cart-render="item_count"
                >{{ countCart }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!--Mobile Menu-->
      <div class="mobile-nav-wrapper" role="navigation">
        <div class="closemobileMenu">
          <i class="icon anm anm-times-l pull-right" id="closeSidebar"></i>
          Cerrar Menu
        </div>
        <ul id="MobileNav" class="mobile-nav">
          <li class="lvl1 parent megamenu">
            <router-link to="/" class="item" @click="closeSidebar"
              >INICIO</router-link
            >
          </li>
        </ul>
      </div>
      <!--End Mobile Menu-->
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import Inicio from './../components/Inicio.vue';

const valorTextAnalisis = ref("");



const store = useStore();
const router = useRouter();
const route = useRoute();

const countCart = computed(() => {
  const listAnalysis = JSON.parse(
    JSON.stringify(store.getters["getListAnalysis"])
  );
  return listAnalysis.length;
});

const routePath = computed(() => {
  return route.path;
});

const closeSidebar = () => {
  const buttonClose = document.querySelector("#closeSidebar");
  buttonClose.click();
};

const goCart = () => {
  router.push({
    path: "/cart",
  });
};

const goToHome = () => {

  

  router.push({
    path: "/",
  });
}




</script>

<style scoped>
.item {
  font-family: "Breuer";
  font-weight: 700 !important;
  font-size: 16px !important;
}

.closemobileMenu {
  font-family: "Breuer";
  font-size: 13px !important;
  font-weight: 400;
}

.site-cart span {
  font-family: "Breuer";
  font-weight: 500 !important;
}
.barra {
  background: var(--green-primary-color) !important;
}

.logo {
  width: 100%;
}

.carrito {
  font-size: 26px !important;
  color: #ffff !important;
  cursor: pointer;
}

#CartCount {
  font-size: 10px !important;
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 425px) {
  .logo {
    width: 85%;
  }

  .item {
    color: #000 !important;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .logo {
    width: 65%;
  }

  .item {
    color: #000 !important;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .logo {
    width: 80%;
  }

  .item {
    color: #fff !important;
  }
}

/*  Este es el estilo para verificar en que link estamos */
.vue-school-active-link {
  color: var(--orange-primary-color) !important;
  font-weight: bolder;
  border: 0;
  outline: 0;
}

.mobile-logo {
  padding: 10px 15px;
  text-align: left !important;
  margin-left: -15%;
  margin-right: 15%;
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
  .mobile-logo img {
    width: 150px;
  }
}
</style>
