<template></template>
<script>
import socket from "../socket";

export default {
  name: "Chat",
  data() {
    return {};
  },
  mounted() {
    socket.on("users", (users) => {});
  },
};
</script>
<style lang="scss" scoped></style>
