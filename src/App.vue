<script setup>
import HeaderVue from "./dashboard/Header.vue";
import FooterVue from "./dashboard/Footer.vue";
</script>

<template>
  <div class="pageWrapper">
    <!--Top Header-->
    <HeaderVue />
    <!--End Header-->

    <!--Top Body-->
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <!--End Body-->

    <!--Top Footer-->
    <FooterVue />
    <!--End Footer-->
  </div>
</template>

<style>
.col-navbar {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.pageWrapper {
  height: 100vh;
  overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in;
  opacity: 1;
}

.fade-enter,
.fade-leave,
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
