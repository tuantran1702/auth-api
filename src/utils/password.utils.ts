import * as bcrypt from 'bcrypt';

export async function hashPassword(textPassword: string) {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(textPassword, salt);
  return hash;
}

export async function comparePassword(hash: string, password: string) {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}
