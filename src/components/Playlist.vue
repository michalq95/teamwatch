<template>
  <div>
    <ul v-for="(clipLink, index) in playlist" v-bind:key="index">
      {{
        clipLink
      }}
    </ul>
  </div>
</template>
<script>
export default {
  name: "Playlist",
  computed: {
    playlist() {
      return this.$store.getters.getPlaylist;
    },
  },
};
</script>
<style lang="scss" scoped></style>
