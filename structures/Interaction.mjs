import { Constants } from 'discord.js';

import Member from './Member';
import User from './User';

const { InteractionTypes } = Constants;

/**
 * Represents an interaction
 */
export default class Interaction {
  constructor(client, data) {
    Object.defineProperties(
      this,
      {
        /**
         * The application's id
         * @name Interaction#applicationId
         * @readonly
         * @type {Snowflake}
         */
        applicationId: { numerable: true, value: data.application_id },

        /**
         * The id of the channel this interaction was sent in
         * @name Interaction#channelId
         * @readonly
         * @type {?Snowflake}
         */
        channelId: { enumerable: true, value: data.channel_id ?? null },

        /**
         * The client that this auth manager belongs to
         * @name Interaction#client
         * @readonly
         * @type {Client}
         */
        client: { enumerable: true, value: client },

        /**
         * The id of the guild this interaction was sent in
         * @name Interaction#guildId
         * @readonly
         * @type {?Snowflake}
         */
        guildId: { enumerable: true, value: data.guild_id ?? null },

        /**
         * The interaction's id
         * @name Interaction#id
         * @readonly
         * @type {Snowflake}
         */
        id: { enumerable: true, value: data.id ?? null },

        /**
         * Indicates whether this interaction is received from a guild
         * @method isInGuild
         * @readonly
         * @returns {boolean}
         */
        isInGuild: { enumerable: true, value: Boolean(this.guildId && this.member) },

        /**
         * If this interaction was sent in a guild, the member which sent it
         * @name Interaction#member
         * @readonly
         * @type {?Member}
         */
        member: {
          enumerable: true,
          value: data.member ? new Member(client, data.member, data.guild_id) : null,
        },

        /**
         * The interaction's token
         * @name Interaction#token
         * @readonly
         * @type {string}
         */
        token: { enumerable: true, value: data.token },

        /**
         * The type of interaction
         * @name Interaction#type
         * @readonly
         * @type {InteractionType}
         */
        type: { enumerable: true, value: InteractionTypes[data.type] },

        /**
         * The user which sent this interaction
         * @name Interaction#user
         * @readonly
         * @type {User}
         */
        user: { enumerable: true, value: new User(client, data.member?.user ?? data.user) },

        /**
         * The interaction version
         * @name Interaction#version
         * @readonly
         * @type {number}
         */
        version: { enumerable: true, value: data.version },
      },
    );
  }
}
