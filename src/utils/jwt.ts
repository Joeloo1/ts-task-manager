import JWT from "jsonwebtoken";
import config from "../Config/config.env";

const expires = config.JWT_EXPIRES_IN || "20d";
const options = {
  expiresIn: expires,
} as JWT.SignOptions;

export const signToken = (payload: Object): string => {
  return JWT.sign(payload, process.env.JWT_SECRET as string, options);
};
