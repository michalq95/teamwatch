let rooms = [];

function getRoomByName(name) {
  return rooms.find((room) => room.name == name);
}

function createOrJoinRoom(name) {
  let room = getRoomByName(name);
  console.log(name);
  if (!room) {
    room = {
      name: name,
      playlist: [
        { name: "Muppets", link: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { name: "FLoat", link: "https://www.youtube.com/watch?v=REvMpqy9G0c" },
        {
          name: "Immo",
          link: "https://www.youtube.com/watch?v=ofyxXczVWKk",
        },
      ],
      currentIndex: 0,
    };
    rooms.push(room);
  }
  console.log(room);
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
