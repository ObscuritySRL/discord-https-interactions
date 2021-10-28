/* eslint-disable no-unused-vars */
import { basename } from 'path';

/**
 * Represents an attachment, from a message, in a message
 */
export default class MessageAttachment {
  /**
   * @param {APIAttachment} [data] - Attachment data
   */
  constructor(data = {}) {
    Object.defineProperties(
      this,
      {
        /**
         * The file for this attachment
         * @type {?Buffer}
         */
        attachment: { enumerable: true, value: data.attachment ?? null, writable: true },

        /**
         * This media type of this attachment
         * @type {?string}
         */
        contentType: { enumerable: true, value: 'content_type' in data ? data.content_type : null },

        /**
         * Whether this attachment is ephemeral
         * @type {boolean}
         */
        ephemeral: { enumerable: true, value: 'ephemeral' in data ? data.ephemeral ?? false : false },

        /**
         * The filename of this attachment
         * @type {?string}
         */
        filename: { enumerable: true, value: data.filename ?? null, writable: true },

        /**
         * The height of this attachment (if an image or video)
         * @type {?number}
         */
        height: { enumerable: true, value: 'height' in data ? data.height : null },

        /**
         * The proxy URL to this attachment
         * @type {?string}
         */
        proxyURL: { enumerable: true, value: 'proxy_url' in data ? data.proxy_url : null },

        /**
         * The size of this attachment in bytes
         * @type {?number}
         */
        size: { enumerable: true, value: 'size' in data ? data.size : null },

        /**
         * The URL to this attachment
         * @type {?string}
         */
        url: { enumerable: true, value: 'url' in data ? data.url : null },

        /**
         * The width of this attachment (if an image or video)
         * @type {?number}
         */
        width: { enumerable: true, value: 'width' in data ? data.width : null },
      },
    );
  }

  /**
   * Sets the attachment
   * @param {?Buffer} attachment - The file to attach
   * @returns {MessageFile} This attachment
   */
  setAttachment(attachment) {
    this.attachment = attachment;

    return this;
  }

  /**
   * Sets the filename of this attachment
   * @param {?string} filename - The filename
   * @returns {MessageFile} This attachment
   */
  setFilename(filename) {
    this.filename = filename;

    return this;
  }

  /**
   * Sets whether this attachment is a spoiler
   * @param {boolean} [spoiler=true] Whether the attachment should be marked as a spoiler
   * @returns {MessageAttachment} This attachment
   */
  setSpoiler(spoiler = true) {
    if (spoiler === this.isSpoiler) {
      return this;
    }

    if (!spoiler) {
      this.filename = this.filename?.replace(/^(SPOILER_)+/i, '');
    } else {
      this.filename = `SPOILER_${this.filename}`;
    }

    return this;
  }

  /**
   * Whether or not this attachment has been marked as a spoiler
   * @type {boolean}
   * @readonly
   */
  get isSpoiler() {
    return /^SPOILER_/i.test(this.filename);
  }
}
