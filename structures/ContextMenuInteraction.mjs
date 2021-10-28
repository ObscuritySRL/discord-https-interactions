import { Constants } from 'discord.js';

import BaseCommandInteraction from './BaseCommandInteraction';
import CommandInteractionOptionResolver from './CommandInteractionOptionResolver';

const { ApplicationCommandTypes, ApplicationCommandOptionTypes } = Constants;

/**
 * Represents a context menu interaction.
 * @extends {BaseCommandInteraction}
 */
export default class ContextMenuInteraction extends BaseCommandInteraction {
  constructor(client, data) {
    super(client, data);

    Object.defineProperties(
      this,
      {
        /**
         * The target of the interaction, parsed into options
         * @type {CommandInteractionOptionResolver}
         */
        options: {
          enumerable: true,
          value: new CommandInteractionOptionResolver(
            this.client,
            this.#resolveContextMenuOptions(data.data),
            this.transformResolved(data.data.resolved),
          ),
        },

        /**
         * The id of the target of the interaction
         * @name CommandInteraction#targetId
         * @readonly
         * @type {Snowflake}
         */
        targetId: { enumerable: true, value: data.data.target_id },

        /**
         * The type of the target of the interaction; either USER or MESSAGE
         * @name CommandInteraction#targetType
         * @readonly
         * @type {ApplicationCommandType}
         */
        targetType: { enumerable: true, value: ApplicationCommandTypes[data.data.type] },
      },
    );
  }

  /**
   * Resolves and transforms options received from the API for a context menu interaction.
   *
   * TODO: Create message structure
   *
   * @param {APIApplicationCommandInteractionData} data The interaction data
   * @returns {CommandInteractionOption[]}
   * @private
   */
  #resolveContextMenuOptions(data) {
    const { target_id, resolved } = data; // eslint-disable-line camelcase

    const result = [];

    const user = resolved.users?.[target_id];

    if (user) {
      result.push(
        this.transformOption(
          {
            name: 'user',
            type: ApplicationCommandOptionTypes.USER,
            value: target_id,
          },
          resolved,
        ),
      );
    }

    return result;
  }
}
