<template>
  <input type="text" v-model="roomName" />
  <input type="button" value="Join/Create room" @click="navigateToRoom" />
</template>
<script>
export default {
  data() {
    return {
      roomName: "room",
    };
  },
  methods: {
    navigateToRoom() {
      this.$router.push({ name: "room", params: { roomid: this.roomName } });
    },
  },
};
</script>
