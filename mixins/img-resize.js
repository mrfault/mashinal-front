const config = {
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200
};

export const ImageResizeMixin = {
  methods: {
    getResizedImage(file) {
      return new Promise((resolve) => {
        try {
          let img = document.createElement('img');
          let canvas = document.createElement('canvas');
          let reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
              let ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);

              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > config.maxWidth) {
                  height *= config.maxWidth / width;
                  width = config.maxWidth;
                }
              } else {
                if (height > config.maxHeight) {
                  width *= config.maxHeight / height;
                  height = config.maxHeight;
                }
              }

              canvas.width = width;
              canvas.height = height;

              ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob((blob) => {
                blob.lastModifiedDate = new Date();
                blob.name = file.name;
                resolve(blob);
              }, 'image/jpeg', config.quality);
            }
          }
          reader.readAsDataURL(file);
        } catch (err) {
          console.error(err);
          resolve(file);
        }
      });
    }
  }
}