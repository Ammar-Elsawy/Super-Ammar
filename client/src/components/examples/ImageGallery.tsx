import { ImageGallery } from '../ImageGallery';
import { ThemeProvider } from '@/contexts/ThemeContext';
import image1 from '@assets/generated_images/Abu_Simbel_temple_photography_a28bb924.png';
import image2 from '@assets/generated_images/Luxury_hotel_suite_pyramids_view_8419a8ff.png';
import image3 from '@assets/generated_images/Sphinx_and_pyramids_sunrise_6b359dbf.png';

export default function ImageGalleryExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background max-w-4xl mx-auto">
        <ImageGallery
          images={[image1, image2, image3]}
          alt="Luxury Egyptian Experience"
        />
      </div>
    </ThemeProvider>
  );
}
