import { Constants } from 'discord.js';

import Fastify from 'fastify';
import FastifyRawBody from 'fastify-raw-body';
import TweetNaCl from 'tweetnacl';

import ButtonInteraction from '../structures/ButtonInteraction';
import CommandInteraction from '../structures/CommandInteraction';
import ContextMenuInteraction from '../structures/ContextMenuInteraction';

const {
  ApplicationCommandTypes, InteractionResponseTypes, InteractionTypes, MessageComponentTypes,
} = Constants;

export default class FastifyManager {
  constructor(client, data) {
    Object.defineProperties(
      this,
      {
        /**
         * The client that this fastify manager belongs to
         * @name FastifyManager#client
         * @readonly
         * @type {Client}
         */
        client: { enumerable: true, value: client },

        /**
         * The fastify instance
         * @name FastifyManager#fastify
         * @readonly
         * @type {FastifyInstance}
         */
        fastify: {
          enumerable: true,
          value:
            Fastify({ ignoreTrailingSlash: true, publicKey: Buffer.from(data.publicKey, 'hex') })
              .register(FastifyRawBody)
              .addHook('preHandler', FastifyManager.#verifyRequest)
              .addHook('preHandler', FastifyManager.#replyToPing)
              .post('*', FastifyManager.#handleRequest),
        },

        /**
         * The host to use for requests
         * @name FastifyManager#host
         * @readonly
         * @type {string}
         */
        host: { enumerable: true, value: data.host },

        /**
         * The port number to use for requests
         * @name FastifyManager#port
         * @readonly
         * @type {number}
         */
        port: { enumerable: true, value: data.port },

        /**
         * The public key to use for verification
         * @name FastifyManager#publicKey
         * @readonly
         * @type {string}
         */
        publicKey: { enumerable: true, value: data.publicKey },
      },
    );

    Object.defineProperties(
      this.fastify,
      {
        client: { enumerable: true, value: client },
        publicKey: { enumerable: true, value: data.publicKey },
      },
    );
  }

  /**
   * Handle requests
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   * @returns
   */
  static #handleRequest(request, reply) {
    switch (request.body.type) {
      case InteractionTypes.APPLICATION_COMMAND:
        switch (request.body.data.type) {
          case ApplicationCommandTypes.CHAT_INPUT:
            this.client.emit('commandInteraction', new CommandInteraction(this.client, request.body, reply));
            break;
          case ApplicationCommandTypes.MESSAGE:
          case ApplicationCommandTypes.USER:
            this.client.emit('contextMenuInteraction', new ContextMenuInteraction(this.client, request.body, reply));
            break;
          default:
        }
        break;
      case InteractionTypes.MESSAGE_COMPONENT:
        switch (request.body.data.component_type) {
          case MessageComponentTypes.BUTTON:
            this.client.emit('buttonInteraction', new ButtonInteraction(this.client, request.body, reply));
            break;
          case MessageComponentTypes.SELECT_MENU:
            // TODO: Create SelectMenuInteraction structure
            break;
          default:
        }
        break;
      default:
    }
  }

  /**
   * Reply to Discord ping messages
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   * @param {Function} done
   * @returns
   */
  static #replyToPing(request, reply, done) {
    if (request.body.type === InteractionTypes.PING) {
      return reply.code(200).send({ type: InteractionResponseTypes.PONG });
    }

    return done();
  }

  /**
   * Verify requests
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   * @param {Function} done
   * @returns
   */
  static #verifyRequest(request, reply, done) {
    const isVerified = TweetNaCl.sign.detached.verify(
      Buffer.from(`${request.headers['x-signature-timestamp']}${request.rawBody}`),
      Buffer.from(request.headers['x-signature-ed25519'], 'hex'),
      Buffer.from(this.publicKey, 'hex'),
    );

    if (!isVerified) { return reply.code(401).send('invalid request signature'); }

    return done();
  }

  /**
   * Start listening for requests
   * @public
   * @returns {undefined}
   */

  async start() {
    try {
      await this.fastify.listen({ backlog: 511, host: this.host, port: this.port });
    } catch (error) {
      this.client.emit('fastifyManagerError', error);

      throw error;
    }
  }
}
