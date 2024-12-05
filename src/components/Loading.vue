<template>
  <div class="loading-page" v-if="loading">
    <div class="table-item-mask">
      <div class="sp-delete sp-circle"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: Boolean,
  },
  setup(props, context) {
    return {};
  },
};
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  z-index: 100000000;
  text-align: center;
  font-size: 30px;
  font-family: sans-serif;
}

.table-item-mask {
  width: 100%;
  flex: 1 1 100%;
  height: 100%;
  z-index: 100;
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  top: 0;
}

.loading-page p {
  position: absolute;
  top: 56%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 15px;
  width: 260px;
  font-weight: bold;
}

.loading-page .sp-circle {
  border: 4px var(--green-primary-color) solid;
  border-top: 4px transparent solid;
  border-radius: 50%;
  -webkit-animation: spCircRot 0.6s infinite linear;
  animation: spCircRot 0.6s infinite linear;
}

.loading-page .sp-delete {
  width: 70px;
  height: 70px;
}

@-webkit-keyframes spCircRot {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}
@keyframes spCircRot {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
