/* eslint-disable no-unused-vars */

import { basename } from 'path';

/**
 * Represents an attachment in a message
 */
export default class MessageAttachment {
  /**
   * @param {BufferResolvable|Stream} attachment The file
   * @param {string} [name=null] The name of the file, if any
   * @param {APIAttachment} [data] Extra data
   */
  constructor(attachment, name = null, data = {}) {
    Object.defineProperties(
      this,
      {
        /**
         * The file for this attachment
         * @type {BufferResolvable|Stream}
         */
        attachment: {
          enumerable: true,
          value: attachment,
          writable: true,
        },

        /**
         * This media type of this attachment
         * @type {?string}
         */
        contentType: {
          enumerable: true,
          value: 'content_type' in data ? data.content_type : null,
          writable: true,
        },

        /**
         * Whether this attachment is ephemeral
         * @type {boolean}
         */
        ephemeral: {
          enumerable: true,
          value: 'ephemeral' in data ? data.ephemeral ?? false : false,
          writable: true,
        },

        /**
         * The height of this attachment (if an image or video)
         * @type {?number}
         */
        height: {
          enumerable: true,
          value: 'height' in data ? data.height : null,
          writable: true,
        },

        /**
         * The name of this attachment
         * @type {?string}
         */
        name: {
          enumerable: true,
          value: name,
          writable: true,
        },

        /**
         * The proxy URL to this attachment
         * @type {?string}
         */
        proxyURL: {
          enumerable: true,
          value: 'proxy_url' in data ? data.proxy_url : null,
          writable: true,
        },

        /**
         * The size of this attachment in bytes
         * @type {?number}
         */
        size: {
          enumerable: true,
          value: 'size' in data ? data.size : null,
          writable: true,
        },

        /**
         * The URL to this attachment
         * @type {?string}
         */
        url: {
          enumerable: true,
          value: 'url' in data ? data.url : null,
          writable: true,
        },

        /**
         * The width of this attachment (if an image or video)
         * @type {?number}
         */
        width: {
          enumerable: true,
          value: 'width' in data ? data.width : null,
          writable: true,
        },
      },
    );
  }

  /**
   * Sets the file of this attachment.
   * @param {BufferResolvable|Stream} attachment - The file
   * @param {string} [name=null] - The name of the file, if any
   * @returns {MessageAttachment} This attachment
   */
  setFile(attachment, name = null) {
    this.attachment = attachment;
    this.name = name;

    return this;
  }

  /**
   * Sets the name of this attachment
   * @param {string} name - The name of the file
   * @returns {MessageAttachment} This attachment
   */
  setName(name) {
    this.name = name;

    return this;
  }

  /**
   * Sets whether this attachment is a spoiler
   * @param {boolean} [spoiler=true] - Whether the attachment should be marked as a spoiler
   * @returns {MessageAttachment} This attachment
   */
  setSpoiler(spoiler = true) {
    if (spoiler === this.isSpoiler) { return this; }

    if (!spoiler) {
      this.name = this.name.replace(/^(SPOILER_)+/i, '');
    } else {
      this.name = `SPOILER_${this.name ?? ''}`;
    }

    return this;
  }

  /**
   * Whether or not this attachment has been marked as a spoiler
   * @name MessageAttachment#isSpoiler
   * @type {boolean}
   * @readonly
   */
  get isSpoiler() {
    return basename(this.url ?? this.name ?? '').split(/[#?]/)[0].startsWith('SPOILER_');
  }
}

/**
 * @external APIAttachment
 * @see {@link https://discord.com/developers/docs/resources/channel#attachment-object}
 */
