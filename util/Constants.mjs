function createEnum(keys) { // eslint-disable-line no-unused-vars
  return [...keys.entries()].reduce(
    (object, [index, key]) => (key !== null
      ? { ...object, [index]: key, [key]: index }
      : object),
    {},
  );
}
