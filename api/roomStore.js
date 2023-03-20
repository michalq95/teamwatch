let rooms = [];

function getRoomByName(name) {
  return rooms.find((room) => room.name == name);
}

function createOrJoinRoom(name) {
  let room = getRoomByName(name);
  if (!room) {
    room = {
      name: name,
      playlist: [
        { name: "Muppets", link: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { name: "Barbie", link: "https://www.youtube.com/watch?v=qundeyQtsQU" },
        {
          name: "Suce",
          link: "https://www.youtube.com/watch?v=NF5Co7GXvCY",
        },
      ],
      currentVideo: {
        name: "Muppets",
        link: "https://www.youtube.com/embed/tgbNymZ7vqY",
        // index: 0,
      },
      // nextVideoIndex: 1,
      currentIndex: 0,
    };
    rooms.push(room);
  }
  return room;
}

function addVideo({ roomName, videoLink }) {
  let room = getRoomByName(roomName);
  room.playlist.push(videoLink);
  return room;
}

module.exports = {
  getRoomByName,
  createOrJoinRoom,
  addVideo,
};
