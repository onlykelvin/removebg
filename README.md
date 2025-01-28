# RemoveBG - Free Background Removal Tool

A modern, fast, and free web application that removes backgrounds from images directly in your browser. No signup required, no server processing - everything happens client-side for maximum privacy and speed.

![RemoveBG Screenshot](https://images.unsplash.com/photo-1635002964051-738233b04c64?q=80&w=1200&auto=format)

## Features

- 🖼️ Instant background removal from images
- 🔒 100% client-side processing - your images never leave your browser
- 📱 Responsive design that works on desktop and mobile
- 🎯 Drag and drop interface
- ⚡ Process multiple images simultaneously
- 💾 Download individual images or all at once
- 🎨 Supports JPG, PNG, and WebP formats

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- [@imgly/background-removal](https://github.com/imgly/background-removal) for ML-powered background removal
- React Dropzone for file handling
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/removebg.git
   cd removebg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Usage

1. Visit the application in your browser
2. Drag and drop images onto the upload area or click to select files
3. Wait for the background removal process to complete
4. Download individual processed images or use the "Download All" button

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [@imgly/background-removal](https://github.com/imgly/background-removal) for the amazing background removal technology
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for the beautiful icons
- [React Dropzone](https://react-dropzone.js.org/) for the file upload functionality