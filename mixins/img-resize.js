import { readAndCompressImage } from 'browser-image-resizer';

const config = {
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200
};

export const ImageResizeMixin = {
  methods: {
    async resizeImage(file) {
      if (process.client)
        return await readAndCompressImage(file, config);
      return undefined;
    }
  }
}