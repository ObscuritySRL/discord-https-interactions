import { Util } from 'discord.js';

/**
 * Represents an embed in a message (image/video preview, rich embed, etc.)
 * TODO: Create proper type definitions
 */
export default class MessageEmbed {
  constructor(data = {}) {
    Object.defineProperties(
      this,
      {
        /**
         * The author of this embed (if there is one)
         * @type {?MessageEmbedAuthor}
         */
        author: {
          enumerable: true,
          value: 'image' in data
            ? {
              name: data.author.name ?? null,
              iconURL: data.author.icon_url ?? data.author.iconURL ?? null,
              proxyIconURL: data.author.proxy_icon_url ?? data.author.proxyIconURL ?? null,
              url: data.author.url ?? null,
            }
            : null,
          writable: true,
        },

        /**
         * The description of this embed
         * @name MessageEmbed#description
         * @type {?number}
         */
        color: { enumerable: true, value: 'color' in data ? Util.resolveColor(data.color) : null, writable: true },

        /**
         * The description of this embed
         * @name MessageEmbed#description
         * @type {?string}
         */
        description: { enumerable: true, value: data.description ?? null, writable: true },

        /**
         * The footer of this embed
         * @type {?MessageEmbedFooter}
         */
        footer: {
          enumerable: true,
          value: 'footer' in data
            ? {
              iconURL: data.footer.icon_url ?? data.footer.iconURL ?? null,
              proxyIconURL: data.footer.proxy_icon_url ?? data.footer.proxyIconURL ?? null,
              text: data.footer.text,
            }
            : null,
          writable: true,
        },

        /**
         * The fields of this embed
         * @type {EmbedField[]}
         */
        fields: {
          enumerable: true,
          value: MessageEmbed.#normalizeFields(data.fields ?? []),
          writable: true,
        },

        /**
         * The image of this embed (if there is one)
         * @type {?MessageEmbedImage}
         */
        image: {
          enumerable: true,
          value: 'image' in data
            ? {
              height: data.image.height ?? null,
              proxyURL: data.image.proxy_url ?? data.image.proxyURL ?? null,
              url: data.image.url ?? null,
              width: data.image.width ?? null,
            }
            : null,
          writable: true,
        },

        /**
         * The provider of this embed (if there is one)
         * @type {?MessageEmbedProvider}
         */

        provider: {
          enumerable: true,
          value: 'provider' in data
            ? {
              name: data.provider.name,
              url: data.provider.url,
            }
            : null,
          writable: true,
        },

        /**
         * The timestamp of this embed
         * @type {?Date}
         */
        timestamp: { enumerable: true, value: 'timestamp' in data ? new Date(data.timestamp) : null, writable: true },

        /**
         * The thumbnail of this embed (if there is one)
         * @type {?MessageEmbedThumbnail}
         */
        thumbnail: {
          enumerable: true,
          value: 'thumbnail' in data
            ? {
              height: data.thumbnail.height ?? null,
              proxyURL: data.thumbnail.proxy_url ?? data.thumbnail.proxyURL ?? null,
              url: data.thumbnail.url ?? null,
              width: data.thumbnail.width ?? null,
            }
            : null,
          writable: true,
        },

        /**
         * The title of this embed
         * @name MessageEmbed#title
         * @type {?string}
         */
        title: { enumerable: true, value: data.title ?? null, writable: true },

        /**
         * The URL of this embed
         * @name MessageEmbed#url
         * @type {?string}
         */
        url: { enumerable: true, value: data.url ?? null, writable: true },

        /**
         * The video of this embed (if there is one)
         * @type {?MessageEmbedVideo}
         */
        video: {
          enumerable: true,
          value: 'video' in data
            ? {
              height: data.video.height ?? null,
              proxyURL: data.video.proxy_url ?? data.video.proxyURL ?? null,
              url: data.video.url ?? null,
              width: data.video.width ?? null,
            }
            : null,
          writable: true,
        },

      },
    );
  }

  /**
   * Normalizes field input
   * @param  {...EmbedFieldData|EmbedFieldData[]} fields - Fields to normalize
   * @returns {EmbedField[]}
   */
  static #normalizeFields(...fields) {
    return fields.flat(Infinity).map(
      (field) => ({ inline: Boolean(field.inline), name: field.name, value: field.value }),
    );
  }

  /**
   * Adds fields to the embed (max 25)
   * @param {...EmbedFieldData|EmbedFieldData[]} fields - The fields to add
   * @returns {MessageEmbed}
   */
  addFields(...fields) {
    this.fields.push(...MessageEmbed.#normalizeFields(fields));

    return this;
  }

  /**
   * Removes, replaces, and inserts fields in the embed (max 25)
   * @param {number} index - The index to start at
   * @param {number} deleteCount - The number of fields to remove
   * @param {...EmbedFieldData|EmbedFieldData[]} [fields] - The replacing field objects
   * @returns {MessageEmbed}
   */
  spliceFields(index, deleteCount, ...fields) {
    this.fields.splice(index, deleteCount, ...MessageEmbed.#normalizeFields(...fields));

    return this;
  }

  /**
   * Sets the author of this embed
   * @param {string} name - The name of the author
   * @param {string} [iconURL] - The icon URL of the author
   * @param {string} [url] - The URL of the author
   * @returns {MessageEmbed}
   */
  setAuthor(name, iconURL, url) {
    this.author = { name, iconURL, url };

    return this;
  }

  /**
   * Sets the color of this embed
   * @param {ColorResolvable} color - The color of the embed
   * @returns {MessageEmbed}
   */
  setColor(color) {
    this.color = Util.resolveColor(color);

    return this;
  }

  /**
   * Sets the description of this embed
   * @param {string|null} description - The description
   * @returns {MessageEmbed}
   */
  setDescription(description) {
    this.description = description ?? null;

    return this;
  }

  /**
   * Sets the footer of this embed
   * @param {string|null} text - The text of the footer
   * @param {string|null} [iconURL] - The icon URL of the footer
   * @returns {MessageEmbed}
   */
  setFooter(text, iconURL) {
    this.footer = { iconURL, text };

    return this;
  }

  /**
   * Sets the image of this embed
   * @param {string|null} url - The URL of the image
   * @returns {MessageEmbed}
   */
  setImage(url) {
    this.image = { url };

    return this;
  }

  /**
   * Sets the thumbnail of this embed
   * @param {string|null} url - The URL of the thumbnail
   * @returns {MessageEmbed}
   */
  setThumbnail(url) {
    this.thumbnail = { url };

    return this;
  }

  /**
   * Sets the timestamp of this embed
   * @param {Date|number|null} timestamp - The timestamp or date.
   * If `null` then the timestamp will be unset (i.e. when editing an existing {@link MessageEmbed})
   * @returns {MessageEmbed}
   */
  setTimestamp(timestamp) {
    this.timestamp = new Date(timestamp);

    return this;
  }

  /**
   * Sets the title of this embed.
   * @param {string} title The title
   * @returns {MessageEmbed}
   */
  setTitle(title) {
    this.title = title;

    return this;
  }

  /**
   * Sets the URL of this embed.
   * @param {string} url The URL
   * @returns {MessageEmbed}
   */
  setURL(url) {
    this.url = url;

    return this;
  }

  /**
   * Transforms the embed to a plain object.
   * @returns {APIEmbed} The raw data of this embed
   */
  toJSON() {
    return {
      author: this.author && {
        icon_url: this.author.iconURL,
        name: this.author.name,
        url: this.author.url,
      },
      color: this.color,
      description: this.description,
      fields: this.fields,
      footer: this.footer && {
        icon_url: this.footer.iconURL,
        text: this.footer.text,
      },
      image: this.image,
      thumbnail: this.thumbnail,
      title: this.title,
      timestamp: this.timestamp,
      type: 'rich',
      url: this.url,
    };
  }
}
