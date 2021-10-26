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
          configurable: false,
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
        targetId: { configurable: false, enumerable: true, value: data.data.target_id },

        /**
         * The type of the target of the interaction; either USER or MESSAGE
         * @name CommandInteraction#targetType
         * @readonly
         * @type {ApplicationCommandType}
         */
        targetType: {
          configurable: false,
          enumerable: true,
          value: ApplicationCommandTypes[data.data.type],
        },
      },
    );
  }

  /**
   * Resolves and transforms options received from the API for a context menu interaction.
   *
   * TODO: Create message type
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

    // if( resolved.messages?.[ target_id ] )
    //     result.push( {
    //         name: 'message',
    //         value: target_id,
    //         message:
    // this.channel?.messages._add(resolved.messages[target_id]) ?? resolved.messages[target_id],
    //         type: 'MESSAGE',
    //     } );

    return result;
  }
}
