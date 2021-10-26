import { Collection } from '@discordjs/collection';
import { Constants } from 'discord.js';

import Interaction from './Interaction';
import Member from './Member';
import User from './User';
import Webhook from './Webhook';

const { ApplicationCommandOptionTypes, InteractionResponseTypes } = Constants;

/**
 * Represents a command interaction
 * @abstract
 * @extends {Interaction}
 */
export default class BaseCommandInteraction extends Interaction {
  constructor(client, data, reply) {
    super(client, data);

    Object.defineProperties(
      this,
      {
        /**
         * The invoked application command's id
         * @name BaseCommandInteraction#commandId
         * @readonly
         * @type {Snowflake}
         */
        commandId: { enumerable: true, value: data.data.id },

        /**
         * The invoked application command's name
         * @name BaseCommandInteraction#commandName
         * @readonly
         * @type {string}
         */
        commandName: { enumerable: true, value: data.data.name },

        /**
         * Whether the reply to this interaction has been deferred
         * @name BaseCommandInteraction#deferred
         * @type {boolean}
         */
        deferred: { enumerable: true, value: false, writable: true },

        /**
         * Whether the reply to this interaction is ephemeral
         * @name BaseCommandInteraction#ephemeral
         * @type {boolean}
         */
        ephemeral: { enumerable: true, value: false, writable: true },

        /**
         * Whether this interaction has already been replied to
         * @name BaseCommandInteraction#replied
         * @type {boolean}
         */
        replied: { enumerable: true, value: false, writable: true },

        /**
         * The webhook for this interaction
         * @name BaseCommandInteraction#webhook
         * @readonly
         * @type {Webhook}
         */
        webhook: {
          enumerable: true,
          value: new Webhook(this.client, data.application_id, data.token),
        },
      },
    );

    /**
     * The FastifyReply for this interaction
     * @name BaseCommandInteraction#reply
     * @private
     * @readonly
     * @type {FastifyReply}
     */
    this.#reply = reply;
  }

    /**
     * The FastifyReply for this interaction
     * @name BaseCommandInteraction#reply
     * @private
     * @readonly
     * @type {FastifyReply}
     */
    #reply = null;

    /**
     * Defer the response
     * TODO: Add option for ephemeral
     * @returns {undefined}
     */
    async defer() {
      if (this.#reply.sent) throw new Error('Reply already sent.');

      this.#reply.code(200).send({
        type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      });

      this.deferred = true;
    }

    /**
     * Send a follow-up message to this interaction
     * @param {*} options The options for the reply
     * @returns {Promise<Message>}
     */
    async followup(options) {
      if (!this.#reply.sent) { throw new Error('Reply not sent.'); }

      const message = await this.webhook.send(options);

      this.replied = true;

      return message;
    }

    transformOption(option, resolved) {
      const result = {
        name: option.name,
        type: ApplicationCommandOptionTypes[option.type],
      };

      if ('options' in option) {
        // eslint-disable-next-line no-shadow
        result.options = option.options.map((option) => this.transformOption(this.client, option));
      }

      if ('value' in option) { result.value = option.value; }

      if (resolved) {
        // const channel = resolved.channels?.[option.value];

        // if (channel) { result.channel = new Channel(client, channel); }

        const member = resolved.members?.[option.value];

        if (member) {
          result.member = new Member(
            this.client,
            { ...member, user: resolved.users[option.value] },
          );
        }

        // const role = resolved.roles?.[option.value];

        // if (role) { result.role = new Role(client, role); }

        const user = resolved.users?.[option.value];

        if (user) { result.user = new User(this.client, user); }
      }

      return result;
    }

    transformResolved(resolved) {
      // TODO: Add channels, messages, and roles
      const { members, users } = resolved;

      const result = { };

      if (members) {
        result.members = new Collection(
          Object.entries(members).map(
            ([id, member]) => [id, new Member(this.client, { ...member, user: users[id] })],
          ),
        );
      }

      if (users) {
        result.users = new Collection(
          Object.entries(users).map(
            ([id, user]) => [id, new User(this.client, user)],
          ),
        );
      }

      return result;
    }
}
