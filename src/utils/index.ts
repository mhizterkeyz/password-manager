import { ChangeEvent } from "react";

type SetInputsFunc<T> = (val: T) => void;

export const noop = (..._args: any): any | Promise<any> => {};

export const random = (max: number, min = 0) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

export const pickRandomUniqueItems = <T>(items: T[], length: number): T[] => {
  const selected: T[] = [];
  const itemsCopy = [...items];
  while (length - selected.length) {
    const [item] = itemsCopy.splice(random(itemsCopy.length - 1), 1);
    selected.push(item);
  }

  return selected;
};

export const randomUppercase = (text: string, length: number): string => {
  const res = text.split("");
  const items = res.map((value, index) => ({
    value,
    index,
  }));
  while (length > 0) {
    const [luckyItem] = items.splice(random(items.length - 1), 1);
    res[luckyItem.index] = luckyItem.value.toUpperCase();
    length -= 1;
  }

  return res.join("");
};

export const generateStrongPassword = () => {
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "1234567890";
  const specialCharacters = "``!@#$%^&*()-=_+{}[]|\\':;\",<.>/?";
  const length = random(20, 10);
  const numbersLength = Math.floor(length / 3);
  const specialLength = numbersLength;
  const alphabetsLength = length % (numbersLength + specialLength);
  const selectedAlphabets = pickRandomUniqueItems(
    alphabets.split(""),
    alphabetsLength
  );
  const selectedNumbers = pickRandomUniqueItems(
    numbers.split(""),
    numbersLength
  );
  const selectedSpecialCharacters = pickRandomUniqueItems(
    specialCharacters.split(""),
    specialLength
  );
  const generated = `${randomUppercase(
    selectedAlphabets.join(""),
    alphabetsLength * 0.2
  )}${selectedNumbers.join("")}${selectedSpecialCharacters.join("")}`.split("");
  const password = pickRandomUniqueItems(generated, length);

  return password.join("");
};

export const copyToClipboard = (text: string) => {
  const input = document.createElement("input");
  input.value = text;
  document.body.append(input);
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  input.remove();
};

export const objectToHeaders = (
  object?: Record<string, string>
): Headers | undefined => {
  if (!object) return object;
  const headers = new Headers();

  Object.keys(object).forEach((key) => {
    headers.set(key, object[key]);
  });

  return headers;
};

export const handleLocalInputs = <T>(
  event: ChangeEvent<HTMLInputElement>,
  setInputs: SetInputsFunc<T>,
  inputs: T
) => {
  const target = event.target as HTMLInputElement;

  setInputs({ ...inputs, [target.name]: target.value });
};
