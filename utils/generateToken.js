import jwt from 'jsonwebtoken';

const generateToken = (id, secret, time) => {
  return jwt.sign({ id }, secret, { expiresIn: time });
};

export default generateToken;
