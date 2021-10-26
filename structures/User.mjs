/**
 * Import third-party modules
 */

import { UserFlags } from 'discord.js';

export default class User {
  constructor(client, data) {
    Object.defineProperties(
      this,
      {
        /**
         * The user's avatar hash
         * @name User#avatar
         * @readonly
         * @type {?string}
         */
        avatar: { enumerable: true, value: data.avatar ?? null },

        /**
         * A link to the user's avatar
         * @name Member#avatarURL
         * @readonly
         * @returns {?URL}
         */
        avatarURL: {
          enumerable: true,
          value: new URL(
            data.avatar
              ? `/avatars/${data.id}/${data.avatar}`
              : `/embed/avatars/${data.discriminator % 5}.png`,
            'https://cdn.discordapp.com',
          ).href,
        },

        /**
         * Whether the user belongs to an OAuth2 application
         * @name User#bot
         * @readonly
         * @type {?boolean}
         */
        bot: { enumerable: true, value: data.bot ?? null },

        /**
         * The client that initiated this user
         * @name User#client
         * @readonly
         * @type {Client}
         */
        client: { enumerable: true, value: client },

        /**
         * The user's 4-digit discord-tag
         * @name User#discriminator
         * @readonly
         * @type {number}
         */
        discriminator: { enumerable: true, value: data.discriminator },

        /**
         * The user's id
         * @name User#id
         * @readonly
         * @type {Snowflake}
         */
        id: { enumerable: true, value: data.id },

        /**
         * The string representation of the user
         * @returns {string}
         */
        mention: { enumerable: true, value: `<@${data.id}>` },

        /**
         * The public flags on a user's account
         * @name User#publicFlags
         * @readonly
         * @type {?bigint}
         */
        publicFlags: {
          enumerable: true,
          value: 'public_flags' in data ? new UserFlags(data.public_flags) : null,
        },

        /**
         * The Discord "tag" (e.g. `Stev#6666`) for this user
         * @name User#tag
         * @readonly
         * @type {?string}
         */
        tag: { enumerable: true, value: `${data.username}#${data.discriminator}` },

        /**
         * The user's username, not unique across the platform
         * @name User#username
         * @readonly
         * @type {string}
         */
        username: { enumerable: true, value: data.username },
      },
    );
  }

  /**
   * When concatenated with a string, this automatically returns the user's mention instead of the
   * User object.
   * @returns {string}
   */

  toString() {
    return this.mention;
  }
}
