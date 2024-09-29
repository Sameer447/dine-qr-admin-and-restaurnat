import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  const { imageName } = req.query;


  if (!imageName) {
    return res.status(400).json({ error: 'Image name is required' });
  }


  const imageDirectory = path.join(process.cwd(), 'data/');

  const imagePath = path.join(imageDirectory, imageName);

  if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
    const ext = path.extname(imagePath).toLowerCase();

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

    const image = fs.readFileSync(imagePath);
    res.setHeader('Content-Type', contentType);
    res.send(image);
  } else {
    res.status(404).json({ error: 'Image not found or invalid image path' });
  }
}
