import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  // Get the image name from the query parameter
  const { imageName } = req.query;

  // Define the directory where your images are stored
  const imageDirectory = path.join(process.cwd(), '/data/menu-items');
  console.log("imageDirectory:", imageDirectory);

  // Construct the full path to the image
  const imagePath = path.join(imageDirectory, imageName);
  console.log("imagePath:", imagePath);

  // Check if the file exists
  if (fs.existsSync(imagePath)) {
    // Determine the image file extension
    const ext = path.extname(imagePath).toLowerCase();

    // Set the correct Content-Type header based on the image extension
    let contentType = 'image/jpeg'; // Default to jpeg if unknown
    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.bmp':
        contentType = 'image/bmp';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      default:
        contentType = 'image/jpeg'; // Default to jpeg if it's .jpg or another format
        break;
    }

    // Read the image file and serve it
    const image = fs.readFileSync(imagePath);
    console.log("image:", image);

    // Set the Content-Type based on the detected image format
    res.setHeader('Content-Type', contentType);
    res.send(image);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
}
