import { Constants } from 'discord.js';

import Interaction from './Interaction';
import Message from './Message';
import Webhook from './Webhook';

const { MessageComponentTypes } = Constants;

/**
 * Represents a message interaction
 * @abstract
 * @extends {Interaction}
 */
export default class MessageComponentInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

    Object.defineProperties(
      this,
      {
        /**
           * The type of component which was interacted with
           * @name MessageComponentInteraction#componentType
           * @readonly
           * @type {string}
           */
        componentType: {
          configurable: false,
          enumerable: true,
          value: MessageComponentInteraction.resolveType(data.data.component_type),
        },

        /**
         * The custom id of the component which was interacted with
         * @name MessageComponentInteraction#commandId
         * @readonly
         * @type {Snowflake}
         */
        customId: { configurable: false, enumerable: true, value: data.data.custom_id },

        /**
         * Whether the reply to this interaction has been deferred
         * @name MessageComponentInteraction#deferred
         * @type {boolean}
         */
        deferred: {
          configurable: false,
          enumerable: true,
          value: false,
          writable: true,
        },

        /**
         * Whether the reply to this interaction is ephemeral
         * @name MessageComponentInteraction#ephemeral
         * @type {boolean}
         */
        ephemeral: {
          configurable: false,
          enumerable: true,
          value: false,
          writable: true,
        },

        /**
         * The message to which the component was attached
         * @name MessageComponentInteraction#message
         * @readonly
         * @type {Message}
         */
        message: {
          configurable: false,
          enumerable: true,
          value: new Message(client, data.message, data.guild_id),
        },

        /**
         * Whether this interaction has already been replied to
         * @name MessageComponentInteraction#replied
         * @type {boolean}
         */
        replied: {
          configurable: false,
          enumerable: true,
          value: false,
          writable: true,
        },

        /**
         * The webhook for this interaction
         * @name MessageComponentInteraction#webhook
         * @readonly
         * @type {Webhook}
         */
        webhook: {
          configurable: false,
          enumerable: true,
          value: new Webhook(this.client, data.application_id, data.token),
        },
      },
    );
  }

  async followup(options) {
    await this.webhook.send(options);

    this.replied = true;

    return this;
  }

  static resolveType(type) {
    return typeof type !== 'string' ? MessageComponentTypes[type] : type;
  }
}
