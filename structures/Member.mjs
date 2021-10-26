/* eslint-disable no-nested-ternary */

import { Permissions } from 'discord.js';

import User from './User';

/**
 * Represents a member of a guild on Discord.
 */
export default class Member {
  constructor(client, data, guildId) {
    Object.defineProperties(
      this,
      {
        /**
         * The guild member's avatar hash
         * @name Member#avatar
         * @readonly
         * @type {?string}
         */
        avatar: { enumerable: true, value: data.avatar },

        /**
         * A link to the members's avatar
         * @name Member#avatarURL
         * @readonly
         * @returns {?URL}
         */
        avatarURL: {
          enumerable: true,
          value: new URL(
            data.avatar
              ? `/guilds/${guildId}/users/${data.user.id}/avatars/${data.avatar}`
              : data.user.avatar
                ? `/avatars/${data.user.id}/${data.user.avatar}`
                : `/embed/avatars/${data.user.discriminator % 5}.png`,
            'https://cdn.discordapp.com',
          ).href,
        },

        /**
         * The client that initiated this member
         * @name Member#client
         * @readonly
         * @type {Client}
         */
        client: { enumerable: true, value: client },

        /**
         * Whether the member is deafened in voice channels
         * @name Member#deaf
         * @readonly
         * @type {?boolean}
         */
        deaf: { enumerable: true, value: data.deaf ?? null },

        /**
         * The nickname of this member, or their username if they don't have one
         * @name Member#displayName
         * @readonly
         * @type {?string}
         */
        displayName: { enumerable: true, value: data.nick ?? data.user.username },

        /**
         * The guild that the member belongs too
         * @name Member#guildId
         * @readonly
         * @type {?Snowflake}
         */
        guildId: { enumerable: true, value: guildId ?? null },

        /**
         * The member's id
         * @name Member#id
         * @readonly
         * @type {Snowflake}
         */
        id: { enumerable: true, value: data.user.id },

        /**
         * Whether this member has yet to pass the guild's membership gate
         * @name Member#isPending
         * @readonly
         * @type {boolean}
         */
        isPending: { enumerable: true, value: data.is_pending },

        /**
         * The timestamp the member joined the guild at
         * @name Member#joinedAt
         * @readonly
         * @type {?Date}
         */

        joinedAt: { enumerable: true, value: new Date(data.joined_at) },

        /**
         * The string representation of the member
         * @returns {string}
         */
        mention: { enumerable: true, value: `<@${data.nick ? '!' : ''}${data.user.id}>` },

        /**
         * Whether the member is muted in voice channels
         * @name Member#mute
         * @readonly
         * @type {?boolean}
         */
        mute: { enumerable: true, value: data.mute ?? null },

        /**
         * The nickname of this member, if they have one
         * @name Member#nickname
         * @readonly
         * @type {?string}
         */
        nickname: { enumerable: true, value: data.nick ?? null },

        /**
         * The permissions for this member
         * @name Member#permissions
         * @readonly
         * @type {bigint}
         */
        permissions: { enumerable: true, value: new Permissions(data.permissions).freeze() },

        /**
         * The timestamp of when the member used their Nitro boost on the guild, if it was used
         * @name Member#premiumSince
         * @readonly
         * @type {?Date}
         */
        premiumSince: {
          enumerable: true,
          value: data.premium_since ? new Date(data.premium_since) : null,
        },

        /**
         * The roles belonging to this member
         * @name Member#roles
         * @readonly
         * @type {Snowflake[]}
         */
        roles: { enumerable: true, value: data.roles },

        /**
         * The user that this member represents
         * @name Member#user
         * @readonly
         * @type {User}
         */
        user: { enumerable: true, value: new User(client, data.user) },
      },
    );
  }

  toString() {
    return this.mention;
  }
}
