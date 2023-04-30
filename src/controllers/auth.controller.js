import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";

import { sendMail } from "../utils/mailer.js";
import client from "../utils/redis.js";
import redisReplace from "../utils/redis-escape.js";

export async function signup(req, res) {
  try {
    const { email, name } = req.body;

    const userId = uuidV4();

    const result = await client.json.set(`user:${userId}`, "$", {
      email,
      name,
    });

    if (result !== "OK") {
      return res.status(400).json({
        success: false,
        message: "Sorry but we were not able to create your account. Try it on later!",
      });
    }

    const newUser = await client.json.get(`user:${userId}`, "$");

    res.status(201).json({
      success: true,
      message: "We have created your account successfully. Log in on your new account!",
      data: newUser,
    });
  } catch (error) {
    console.log("Something failed: %s", error.message);
    res.sendStatus(500);
  }
}

export async function login(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Try to enter again your email and make sure that you are providing a valid email",
      });
    }

    const escapedEmail = redisReplace(email);

    const searchResults = await client.ft.search("idx:users", `@email:{${escapedEmail}}`, { limit: 1 });

    if (searchResults.total == 0) {
      return res.status(401).json({
        success: false,
        message: "Try to enter again your email and make sure that you are providing a valid email",
      });
    }

    const user = searchResults.documents[0].value;

    const token = jwt.sign(user, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    await sendMail({
      receiver: user.email,
      subject: "Login link",
      text: `You have requested a log in, click on the following link to access your account: http://app-domain/auth/${token}`,
    });

    res.status(200).json({
      success: true,
      message: "Check your inbox and complete your log in request!",
    });
  } catch (error) {
    console.log("Something failed: %s", error);
    res.sendStatus(500);
  }
}

export async function verify(req, res) {
  try {
    const { token } = req.query;

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "We cannot retrieve you information. Try to log in again.",
      });
    }

    res.status(200).json({
      success: true,
      data: decodedToken,
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. You must login again",
      });
    }
    console.log("Something failed: %s", error.message);
    res.sendStatus(500);
  }
}
