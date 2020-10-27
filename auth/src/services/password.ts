import { scrypt, randomBytes } from "crypto"
import { promisify } from "util"

const scruptAsync = promisify(scrypt)

export class Password {
  static async tohash(password: string) {
    const salt = randomBytes(8).toString("hex")
    const buff = (await scruptAsync(password, salt, 64)) as Buffer

    return `${buff.toString("hex")}.${salt}`
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buff = (await scruptAsync(suppliedPassword, salt, 64)) as Buffer
    return buff.toString('hex') === hashedPassword;
  }
}
