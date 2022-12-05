/**
 *
 * @version     1.0
 * @sourcecode  https://github.com/cncldeveloper/certificate-maker
 * @author      Md. Chanchal Biswas
 * @copyright   Copyright (c) 2022. (https://chanchal.net)
 * @licence     MIT License
 * @since       Version 1.0
 *
 *
 * This class design for academic certificate generate.
 *
 * It is designed for a specific certificate and has
 * certain methods and properties required for that.
 *
 * All properties used in methods here create an object
 * and are shown in the example certificate.
 *
 */
class Certificate {
    #canvas;
    #context;
    #coverImage;
    #images = [];

    /**
     * Constructor parameters are passed to the canvas element
     * and initialized internal properties are invoked.
     *
     * @param canvas
     */
    constructor(canvas) {
        this.#canvas = canvas;
        this.#context = this.#canvas.getContext('2d');
        this.#canvas.style.scale = '0.9';
    }

    /**
     * Set Certificate Cover Image
     *
     * @param url
     */
    setCoverImage(url) {
        let image = new Image();
        image.src = url;
        this.#coverImage = image;
    }

    /**
     * Set Zoom Scale
     * This method can change zoom (In/Out)
     * Zoom (In/Out) value range between 0.1 to 1.0
     *
     * @param value
     */
    setZoom(value) {
        if (value >= 0.1 && value <= 1) {
            this.#canvas.style.scale = value;
        }
    }

    /**
     * This method converts a specified length and height
     * and returns the specified length and height.
     * The return value in the field depends on the quality.
     *
     * This method will help to increase and decrease the size of the image.
     *
     * @param originalWidth
     * @param originalHeight
     * @param quality
     * @returns {{width: number, height: number}}
     */
    getRectRatio(originalWidth, originalHeight, quality) {
        quality = (quality >= 1 && quality <= 100)? originalHeight / Math.abs(quality - 6): originalHeight;

        let ratio = originalWidth / originalHeight;
        let newWidth = quality * ratio;
        let newHeight = newWidth / ratio;

        return {width: newWidth, height: newHeight};
    }

    /**
     * This method divides the canvas into 5 units along
     * the length and 5 units along the width and returns
     * the coordinate value of the specified location.
     *
     * The limit of x is -5 to 5
     * The limit of y is -5 to 5
     *
     * But the output x and y values can be anything.
     *
     * @param x
     * @param y
     * @returns {{x: number, y: number}}
     */
    getRelativePosition(x, y) {
        x = (x >= -5 && x <= 5)? x: 0.1;
        y = (y >= -5 && y <= 5)? y: 0.1;

        return {
            x: (this.#canvas.width / 5) * x,
            y: (this.#canvas.height / 5) * y,
        };
    }

    /**
     * This method set the coordinates value (x,y) and quality
     * (width and height can increase or decrease) of the cover image.
     *
     * @param x
     * @param y
     * @param quality
     */
    setCoverImageProperties(x = 0, y = 0, quality = 0) {
        let size = this.getRectRatio(this.#coverImage.naturalWidth, this.#coverImage.naturalHeight, quality);
        this.#canvas.width = size.width;
        this.#canvas.height = size.height;
        this.#context.drawImage(this.#coverImage, x, y, size.width, size.height);
    }

    /**
     * This method returns the latest width and height values of the cover image.
     *
     * @returns {{x, y}}
     */
    getCoverImageResolution() {
        return {
            x: this.#canvas.width,
            y: this.#canvas.height,
        }
    }

    /**
     * This method helps to display an image inside the canvas.
     *
     * @param image
     * @param x
     * @param y
     * @param quality
     */
    setImage(image, x = 0, y = 0, quality = 0) {
        let size = this.getRectRatio(image.naturalWidth, image.naturalHeight, quality);
        let position = this.getRelativePosition(x, y);
        this.#context.drawImage(image, position.x, position.y, size.width, size.height);
    }

    /**
     * This method helps display text inside the canvas.
     * Here are various properties as method parameters.
     *
     * @param properties
     */
    setText(properties) {
        let i = 0;
        let position = this.getRelativePosition(properties.x, properties.y);

        Object.keys(properties).forEach(key => {
            if (key === 'properties') {
                Object.keys(Object.values(properties)[i]).forEach(property => {
                    this.#context[property] = Object.values(properties)[i][property];
                });
            }
            i++;
        })

        this.#context.fillText(properties.text, (this.#canvas.width - (-position.x)) / 2, position.y);
    }

    /**
     * This method helps display paragraph text inside the canvas.
     * Here are various properties as method parameters.
     *
     * @param properties
     */
    setTextParagraph(properties) {
        let position = this.getRelativePosition(properties.x, properties.y);
        let tempLineHeight = 0;
        let lines;
        let i = 0;

        Object.keys(properties).forEach(key => {
            if (key === 'properties') {
                Object.keys(Object.values(properties)[i]).forEach(property => {
                    this.#context[property] = Object.values(properties)[i][property];
                });
            }
            i++;
        })

        lines = properties.text.match(/[^\r\n]+/g);
        lines = (lines === null)? 0: lines;

        for (i = 0; i < lines.length; i++) {
            properties.x = (this.#canvas.width - (-position.x)) / 2;
            this.#context.fillText(lines[i], properties.x, position.y + tempLineHeight);
            tempLineHeight = tempLineHeight + 35 + parseInt(properties.lineHeight);
        }
    }

    /**
     * This method create an image element that is used for a specific task.
     * and pushed each image element in an array.
     *
     * @param url
     */
    setRoleImage(url) {
        let image = new Image();
        image.src = url;
        this.#images.push(image);
    }

    /**
     * This method update an existing image and this image exists in an array.
     * In this case the index of the one to be changed should be given.
     *
     * @param url
     * @param index
     */
    setRoleImageUpdate(url, index) {
        let image = new Image();
        image.src = url;
        this.#images[index] = image;
    }

    /**
     * This method changes the position (x,y) and
     * quality(width,height) of an image inside the canvas.
     *
     * @param properties
     * @param index
     */
    setRoleImageProperties(properties, index) {
        this.setImage(this.#images[index], properties.x, properties.y, properties.quality);
    }

    /**
     * This method helps to display a text inside the
     * canvas and change it's position and some design.
     *
     * Here are various properties as method parameters.
     *
     * @param properties
     */
    setRole(properties) {
        Object.keys(properties).forEach((key1, index1) => {
            Object.keys(properties[key1]).forEach(key2 => {
                if (key2 === 'signature') {
                    this.setImage(this.#images[index1], properties[key1][key2].x, properties[key1][key2].y, properties[key1][key2].quality);
                }

                if (key2 === 'role') {
                    this.setText({
                        text: properties[key1][key2].text,
                        x: properties[key1][key2].x,
                        y: properties[key1][key2].y,
                        properties: properties[key1][key2].properties
                    });
                }
            })
        })
    }

    /**
     * Clear rectangle
     */
    clearContext() {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }
}