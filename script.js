const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const assets = [];

let regulation = 1068;

const loadImageAssets = (url) => {
    let image = new Image();
    image.src = url;
    assets.push({image: image, width: image.naturalWidth, height: image.naturalHeight});
}

const certificateBackground = () => {
    let ratio = assets[0].width / assets[0].height;
    let newWidth = regulation * ratio;
    let newHeight = newWidth / ratio;

    canvas.width = newWidth;
    canvas.height = newHeight;

    context.drawImage(assets[0].image, 0, 0, newWidth, newHeight);
}

const setup = () => {
    loadImageAssets('https://png.pngtree.com/background/20210706/original/pngtree-certificate-background-design-picture-image_132223.jpg');

    certificateBackground();

}

document.getElementById('zoom').addEventListener('change', function() {
    canvas.setAttribute('style', 'transform:scale('+this.value+')');
});

setup();
