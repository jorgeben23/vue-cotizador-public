<template>
  <div
    class="alert__container alert alert-dismissible fade show"
    :class="[status == 1 ? 'alert-success' : 'alert-danger']"
    role="alert"
  >
    <p>
      {{ text }}
    </p>
    <button
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
      id="closeAlert"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  status: Number,
  text: String,
});
</script>

<style scoped>
p {
  margin: 0;
  font-weight: 500;
}

.alert-success p {
  color: var(--green-primary-color);
}

.alert-danger p {
  color: #ea151d;
}
</style>
