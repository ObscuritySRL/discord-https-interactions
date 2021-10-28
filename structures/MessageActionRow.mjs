import { Constants } from 'discord.js';

const { MessageComponentTypes } = Constants;

/**
 * Represents an action row component
 */
export default class InteractionActionRow {
  constructor(...components) {
    Object.defineProperties(
      this,
      {
        /**
         * The components in this action row
         * @type {MessageActionRowComponent[]}
         */
        components: {
          enumerable: true,
          value: components?.flat(Infinity) ?? [],
          writable: true,
        },
      },
    );
  }

  /**
   * Adds components to the action row
   * @param {...MessageActionRowComponent[]} components - The components to add
   * @returns {MessageActionRow}
   */
  addComponents(...components) {
    this.components.push(...components.flat(Infinity));

    return this;
  }

  /**
   * Sets the components of the action row
   * @param {...MessageActionRowComponent} components - The components to set
   * @returns {MessageActionRow}
   */
  setComponents(...components) {
    this.spliceComponents(0, this.components.length, components);

    return this;
  }

  /**
   * Removes, replaces, and inserts components in the action row
   * @param {number} index - The index to start at
   * @param {number} deleteCount - The number of components to remove
   * @param {...MessageActionRowComponent[]} [components] - The replacing components
   * @returns {MessageActionRow}
   */
  spliceComponents(index, deleteCount, ...components) {
    this.components.splice(index, deleteCount, ...components.flat(Infinity));

    return this;
  }

  /**
   * Transforms the action row to a plain object
   * @returns {APIMessageComponent} The raw data of this action row
   */
  toJSON() {
    return {
      components: this.components.map((component) => component.toJSON()),
      type: MessageComponentTypes.ACTION_ROW,
    };
  }
}
