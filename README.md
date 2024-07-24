Here's a README file that provides detailed information about a React JS project which incorporates HTML5 Canvas for drawing on a photo, masking it using the drawing, and saving both the mask and the masked image. This project uses three different canvases accessible through specific URLs.

---

# Canvas Photo Masking Tool

This project demonstrates a powerful web application built using React JS and HTML5 Canvas. It allows users to draw on a photo, create a mask from the drawing, and save both the original mask and the masked image. The application is designed to be intuitive and accessible through different endpoints within the website.

## Features

- **Photo Drawing**: Allows users to freely draw on a loaded photo using a variety of brush sizes and colors.
  Brush and eraser sample:
![Screenshot 2024-07-24 171710](https://github.com/user-attachments/assets/c600a303-9741-4577-8a37-637da9f0812c)

- **Mask Creation**: Automatically generates a mask based on user drawings.
  ![canvas-drawing (24)](https://github.com/user-attachments/assets/6a97475c-2e7f-4f4a-9a41-11e98aa33b3d)

- **Save Functionality**: Users can save both the mask and the final masked image.
  ![masked (31)](https://github.com/user-attachments/assets/2302a1ac-3e65-407b-9b14-eb2f9dd85e84)

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/canvas-photo-masking.git
   ```
2. Navigate to the project directory:
   ```bash
   cd canvas-photo-masking
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```

## Usage

The application is accessible via the following URLs, each serving a different purpose:

- **Home Canvas**: `http://localhost:3000/`
  
- **Test Canvas**: `http://localhost:3000/test/`
  - [BEST CANVAS}
  
- **React Canvas**: `http://localhost:3000/react/`

### Drawing on the Photo

1. **Select a Photo**: Upload or select a photo from the gallery.
2. **Choose Brush Settings**: Adjust the size and color of the brush.
3. **Draw on the Photo**: Use the mouse or touch to draw on the photo.
4. **Create a Mask**: The application automatically creates a mask based on your drawing.

### Saving the Images

- **Save Mask**: Click on the 'Save Mask' button to download the mask image.
- **Save Masked Image**: Click on the 'Save Masked Image' button to download the image with the mask applied.

## Technologies

- **React JS**: Frontend library for building the user interface.
- **HTML5 Canvas**: Used for drawing, masking, and image manipulation.
- **CSS**: For styling the application.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests with any enhancements, bug fixes, or improvements you have made.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README provides an overview, setup instructions, usage details, and additional information for effectively running and understanding the capabilities of the Canvas Photo Masking Tool.
