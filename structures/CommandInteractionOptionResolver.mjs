/**
 * A resolver for command interaction options.
 */
export default class CommandInteractionOptions {
  constructor(client, options, resolved) { // eslint-disable-line no-unused-vars
    Object.defineProperties(
      this,
      {
        /**
         * The client that these command interaction options belong to
         * @name CommandInteraction#client
         * @readonly
         * @type {Client}
         */
        client: { configurable: false, enumerable: true, value: client },

        /**
         * If the command was a sub command
         * @name CommandInteraction#isSubCommand
         * @readonly
         * @type {Boolean}
         */
        isSubCommand: { configurable: false, enumerable: true, value: options[0]?.type === 'SUB_COMMAND' },

        /**
         * If the command was a sub command group
         * @name CommandInteraction#isSubCommandGroup
         * @readonly
         * @type {Boolean}
         */
        isSubCommandGroup: { configurable: false, enumerable: true, value: options[0]?.type === 'SUB_COMMAND_GROUP' },

        /**
         * The bottom-level options for the interaction. If there is a subcommand (or subcommand and
         * group), this is the options for the subcommand.
         * @name CommandInteraction#options
         * @readonly
         * @type {*[]}
         */
        options: {
          configurable: false,
          enumerable: true,
          value: options[0]?.type === 'SUB_COMMAND' || options[0]?.type === 'SUB_COMMAND_GROUP'
            ? options[0].options
            : options,
        },

        /**
         * The name of the sub command, if one exists
         * @name CommandInteraction#subCommandName
         * @readonly
         * @type {?string}
         */
        subCommandName: {
          configurable: false,
          enumerable: true,
          value: options[0]?.type === 'SUB_COMMAND' ? options[0]?.name : null,
        },

        /**
         * The name of the sub command group, if one exists
         * @name CommandInteraction#subCommandName
         * @readonly
         * @type {?string}
         */
        subCommandGroupName: {
          configurable: false,
          enumerable: true,
          value: options[0]?.type === 'SUB_COMMAND_GROUP' ? options[0]?.name : null,
        },
      },
    );

    // this.#resolved = Object.freeze(resolved);
  }

  // #resolved = null;

  get(name) {
    const option = this.options.find(({ name: optionName }) => optionName === name);

    return option ?? null;
  }

  getBoolean(name) {
    const option = this.get(name);

    return option?.type === 'BOOLEAN' ? option.value ?? null : null;
  }

  getChannel(name) {
    const option = this.get(name);

    return option?.type === 'CHANNEL' ? option.channel ?? null : null;
  }

  getInteger(name) {
    const option = this.get(name);

    return option?.type === 'INTEGER' ? option.value ?? null : null;
  }

  getMember(name) {
    const option = this.get(name);

    return option?.type === 'USER' ? option.member ?? null : null;
  }

  getMessage(name) {
    const option = this.get(name);

    return option?.type === 'MESSAGE' ? option.message ?? null : null;
  }

  getNumber(name) {
    const option = this.get(name);

    return option?.type === 'NUMBER' ? option.value ?? null : null;
  }

  getString(name) {
    const option = this.get(name);

    return option?.type === 'STRING' ? option.value ?? null : null;
  }

  getSubCommand() {
    return this.subCommandName;
  }

  getSubCommandGroup() {
    return this.subCommandGroupName;
  }

  getUser(name) {
    const option = this.get(name);

    return option?.type === 'USER' ? option.user ?? null : null;
  }
}
