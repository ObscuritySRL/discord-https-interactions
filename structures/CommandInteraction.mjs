import BaseCommandInteraction from './BaseCommandInteraction';
import CommandInteractionOptionResolver from './CommandInteractionOptionResolver';

/**
 * Represents a command interaction.
 * @extends {BaseCommandInteraction}
 */
export default class CommandInteraction extends BaseCommandInteraction {
  constructor(client, data, reply) {
    super(client, data, reply);

    /**
     * The options resolve for the interaction
     * @name CommandInteraction#options
     * @readonly
     * @type {CommandInteractionOptionResolver}
     */
    Object.defineProperties(
      this,
      {
        options: {
          configurable: false,
          enumerable: true,
          value:
          new CommandInteractionOptionResolver(
            this.client,
            data.data.options?.map(
              (option) => this.transformOption(option, data.data.resolved),
            ) ?? [],
            this.transformResolved(data.data.resolved ?? { }),
          ),
        },
      },
    );
  }
}
