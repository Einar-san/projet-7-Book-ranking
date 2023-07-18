const sharp = require("sharp");
const path = require("path");


async function resizeSave (imageBuffer) {


    const resizedImageBuffer = await sharp(imageBuffer)
        .resize(460, 600, {fit: 'cover', position: 'center'})
        .extend({background: {r: 255, g: 255, b: 255, alpha: 1}, top: 0, bottom: 0})
        .toBuffer();
    // Generate a unique filename for the resized image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const resizedImageFilename = `${uniqueSuffix}.jpg`;

    // Define the path to store the resized image
    const resizedImagePath = path.join(__dirname, '../bookCollection', resizedImageFilename);

    // Image url
    const imageUrl = `http://localhost:4000/bookCollection/${resizedImageFilename}`
    // Save the resized image to the specified path
    await sharp(resizedImageBuffer).toFile(resizedImagePath);

    return imageUrl

}

module.exports = resizeSave;