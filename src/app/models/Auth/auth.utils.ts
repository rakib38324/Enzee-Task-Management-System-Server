/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken';

export type TJwtPayload = {
  name: string;
  email: string;
  _id: string;
};

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const VerifyToken = (token: string, secret: string) => {
  //====> verify token
  return jwt.verify(token, secret) as JwtPayload;
};
