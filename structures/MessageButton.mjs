import { Constants } from 'discord.js';

const { MessageButtonStyles, MessageComponentTypes } = Constants;

/**
 * Represents a button message component
 * @see {@link https://discord.com/developers/docs/interactions/message-components#button-object}
 */
export default class MessageButton {
  constructor(data = {}) {
    Object.defineProperties(
      this,
      {
        /**
         * Text that appears on the button, max 80 characters
         * @name MessageButton#customId
         * @public
         * @type {?string}
         */
        customId: {
          enumerable: true,
          value: data.custom_id ?? data.customId ?? null,
          writable: true,
        },

        /**
         * Whether the button is disabled
         * @name MessageButton#disabled
         * @public
         * @type {boolean}
         */
        disabled: { enumerable: true, value: data.disabled ?? false, writable: true },

        /**
         * Emoji for this button
         * TODO: Create Emoji structure/type
         * @name MessageButton#emoji
         * @public
         * @type {?Emoji}
         */
        emoji: { enumerable: true, value: data.emoji ?? null, writable: true },

        /**
         * The text to be displayed on this button
         * @name MessageButton#label
         * @public
         * @type {?string}
         */
        label: { enumerable: true, value: data.label ?? null, writable: true },

        /**
         * The style of this button
         * @name MessageButton#style
         * @public
         * @type {?MessageButtonStyle}
         */
        style: {
          enumerable: true,
          value: data.style ? MessageButton.#resolveStyle(data.style) : null,
          writable: true,
        },

        /**
         * A url for link-style buttons
         * @name MessageButton#url
         * @public
         * @type {?string}
         */
        url: { enumerable: true, value: data.url ?? null, writable: true },
      },
    );
  }

  /**
   * Resolves the style of a button
   * @param {MessageButtonStyleResolvable} style - The style to resolve
   * @private
   * @returns {MessageButtonStyle}
   */
  static #resolveStyle(style) {
    return typeof style === 'string' ? style : MessageButtonStyles[style];
  }

  /**
   * Sets the custom id for this button
   * @param {string} customId - A unique string to be sent in the interaction when clicked
   * @returns {MessageButton}
   */
  setCustomId(customId) {
    this.customId = customId;

    return this;
  }

  /**
   * Sets the interactive status of the button
   * @param {boolean} [disabled=true] - Whether this button should be disabled
   * @returns {MessageButton}
   */
  setDisabled(disabled = true) {
    this.disabled = Boolean(disabled);

    return this;
  }

  /**
   * Set the emoji of this button
   * @param {EmojiIdentifierResolvable} emoji - The emoji to be displayed on this button
   * @returns {MessageButton}
   */
  setEmoji(emoji) {
    this.emoji = emoji;

    return this;
  }

  /**
   * Sets the label of this button
   * @param {string} label - The text to be displayed on this button
   * @returns {MessageButton}
   */
  setLabel(label) {
    this.label = label;

    return this;
  }

  /**
   * Sets the style of this button
   * @param {MessageButtonStyleResolvable} style - The style of this button
   * @returns {MessageButton}
   */
  setStyle(style) {
    this.style = MessageButton.#resolveStyle(style);

    return this;
  }

  /**
   * Sets the URL of this button
   * @param {string} url - The URL of this button
   * @returns {MessageButton}
   */
  setURL(url) {
    this.url = url;

    return this;
  }

  /**
   * Transforms the button to a plain object
   * @returns {object} The raw data of this button
   */
  toJSON() {
    return {
      custom_id: this.customId,
      disabled: this.disabled,
      emoji: this.emoji,
      label: this.label,
      style: MessageButtonStyles[this.style],
      type: MessageComponentTypes.BUTTON,
      url: this.url,
    };
  }
}
