// game loop
while (true) {
  let highestMountainIndex = -1;
  let maxHeight = -1;
  for (let i = 0; i < 8; i++) {
      const mountainHeight: number = parseInt(readline());
      if (mountainHeight > maxHeight) {
          maxHeight = mountainHeight;
          highestMountainIndex = i;
      }
  }
  console.log(highestMountainIndex);
}
