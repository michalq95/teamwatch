<template>
  Library
  <div v-for="(catalog, index) in library" :key="index">
    {{ catalog.name }}
    <div v-for="(video, index2) in catalog.playlist" :key="index2">
      {{ video.name }}
    </div>
  </div>
</template>
<script>
export default {
  name: "Library",
  data() {
    return {};
  },
  computed: {
    library() {
      return this.$store.getters.getLibrary;
    },
  },
};
</script>
<style lang="scss" scoped></style>
