<template>
  <input type="text" v-model="roomName" />
  <input type="button" value="Join/Create room" @click="navigateToRoom" />
</template>
<script>
export default {
  data() {
    return {
      roomName: "room",
      registerData: {},
    };
  },
  methods: {
    navigateToRoom() {
      this.$router.push({ name: "room", params: { roomid: this.roomName } });
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>
