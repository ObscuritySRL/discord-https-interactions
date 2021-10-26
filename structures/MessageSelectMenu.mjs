import { Constants } from 'discord.js';

const { MessageComponentTypes } = Constants;

/**
 * Represents a select menu message component
 * @see {@link https://discord.com/developers/docs/interactions/message-components#select-menu-object}
 */
export default class MessageSelectMenu {
  constructor(data = {}) {
    Object.defineProperties(
      this,
      {
        /**
         * Text that appears on the button, max 80 characters
         * @name MessageSelectMenu#customId
         * @public
         * @type {?string}
         */
        customId: {
          enumerable: true,
          value: data.custom_id ?? data.customId ?? null,
          writeable: true,
        },

        /**
         * Whether the select menu is disabled
         * @name MessageSelectMenu#disabled
         * @public
         * @type {boolean}
         */
        disabled: { enumerable: true, value: data.disabled ?? false, writeable: true },

        /**
         * The maximum number of selections allowed
         * @type {?number}
         */
        maxValues: {
          enumerable: true,
          value: data.max_values ?? data.maxValues ?? null,
          writeable: true,
        },

        /**
         * The minimum number of selections required
         * @type {?number}
         */
        minValues: {
          enumerable: true,
          value: data.min_values ?? data.minValues ?? null,
          writeable: true,
        },

        /**
         * Options for the select menu
         * @type {MessageSelectOption[]}
         */
        options: {
          enumerable: true,
          value: MessageSelectMenu.#normalizeOptions(data.options ?? []),

          writeable: true,
        },

        /**
         * The style of this button
         * @name MessageSelectMenu#style
         * @public
         * @type {?MessageSelectMenuStyle}
         */
        placeholder: {
          enumerable: true,
          value: data.placeholder ?? null,
          writeable: true,
        },
      },
    );
  }

  /**
   * Normalizes option input and resolves strings and emojis.
   * @param {MessageSelectOptionData} option - The select menu option to normalize
   * @private
   * @returns {MessageSelectOption}
   */
  static #normalizeOption(option) {
    const {
      description, emoji, label, value,
    } = option;

    // emoji = emoji ? Util.resolvePartialEmoji(emoji) : null;

    return {
      default: option.default ?? false, description, emoji, label, value,
    };
  }

  /* eslint-disable max-len */
  /**
   * Normalizes option input and resolves strings and emojis.
   * @param {...MessageSelectOptionData|MessageSelectOptionData[]} options - The select menu options to normalize
   * @private
   * @returns {MessageSelectOption[]}
   */
  /* eslint-enable max-len */
  static #normalizeOptions(...options) {
    return options.flat(Infinity).map((option) => this.#normalizeOption(option));
  }

  /**
   * Adds options to the select menu.
   * @param {...MessageSelectOptionData|MessageSelectOptionData[]} options - The options to add
   * @returns {MessageSelectMenu}
   */
  addOptions(...options) {
    this.options.push(...MessageSelectMenu.#normalizeOptions(options));

    return this;
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
   * @public
   * @returns {MessageButton}
   */
  setDisabled(disabled = true) {
    this.disabled = Boolean(disabled);

    return this;
  }

  /**
   * Sets the maximum number of selections allowed for this select menu
   * @param {number} maxValues - Number of selections to be allowed
   * @public
   * @returns {MessageSelectMenu}
   */
  setMaxValues(maxValues) {
    this.maxValues = maxValues;

    return this;
  }

  /**
   * Sets the minimum number of selections required for this select menu
   * @param {number} minValues - Number of selections to be required
   * @public
   * @returns {MessageSelectMenu}
   */
  setMinValues(minValues) {
    this.minValues = minValues;

    return this;
  }

  /**
   * Sets the options of the select menu.
   * @param {...MessageSelectOptionData|MessageSelectOptionData[]} options - The options to set
   * @returns {MessageSelectMenu}
   */
  setOptions(...options) {
    this.spliceOptions(0, this.options.length, options);

    return this;
  }

  /**
   * Sets the placeholder of this select menu
   * @param {string} placeholder - Custom placeholder text to display when nothing is selected
   * @returns {MessageSelectMenu}
   */
  setPlaceholder(placeholder) {
    this.placeholder = placeholder;

    return this;
  }

  /* eslint-disable max-len */
  /**
   * Removes, replaces, and inserts options in the select menu.
   * @param {number} index - The index to start at
   * @param {number} deleteCount - The number of options to remove
   * @param {...MessageSelectOptionData|MessageSelectOptionData[]} [options] - The replacing option objects
   * @returns {MessageSelectMenu}
   */
  /* eslint-enable max-len */
  spliceOptions(index, deleteCount, ...options) {
    this.options.splice(index, deleteCount, ...MessageSelectMenu.#normalizeOptions(...options));

    return this;
  }

  /**
   * Transforms the select menu to a plain object
   * @public
   * @returns {object} The raw data of this select menu
   */
  toJSON() {
    return {
      custom_id: this.customId,
      disabled: this.disabled,
      placeholder: this.placeholder,
      min_values: this.minValues,
      max_values: this.maxValues ?? (this.minValues ? this.options.length : undefined),
      options: this.options,
      type: typeof this.type === 'string' ? MessageComponentTypes[this.type] : this.type,
    };
  }
}
