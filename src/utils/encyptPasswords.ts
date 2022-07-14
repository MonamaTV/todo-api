import bcrypt from "bcrypt";

export const comparePasswords = async (
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  try {
    const compare = await bcrypt.compare(plainPassword, hashedPassword);
    return compare;
  } catch (error) {
    return false;
  }
};

export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    const SALT = await bcrypt.genSalt(10);
    const compare = await bcrypt.hash(plainPassword, SALT);
    return compare;
  } catch (error) {
    return "";
  }
};
