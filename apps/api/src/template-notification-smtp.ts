import { connect as tlsConnect, type TLSSocket } from "node:tls";
import { connect as netConnect, type Socket } from "node:net";
import type { Duplex } from "node:stream";

export type SmtpSendOptions = {
  host: string;
  port: number;
  secure?: boolean;
  from: string;
  to: string;
  subject: string;
  body: string;
  user?: string | null;
  pass?: string | null;
};

function readResponse(socket: Duplex): Promise<string> {
  return new Promise((resolve, reject) => {
    const onData = (chunk: Buffer) => {
      cleanup();
      resolve(chunk.toString("utf8"));
    };
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };
    socket.once("data", onData);
    socket.once("error", onError);
  });
}

async function sendLine(socket: Duplex, line: string) {
  socket.write(`${line}\r\n`);
  const resp = await readResponse(socket);
  const code = Number(resp.slice(0, 3));
  if (Number.isNaN(code) || code >= 400) {
    throw new Error(`smtp_error:${resp.trim()}`);
  }
  return resp;
}

async function upgradeStartTls(socket: Duplex, host: string) {
  await sendLine(socket, "STARTTLS");
  const upgraded = await new Promise<TLSSocket>((resolve, reject) => {
    const tlsSocket = tlsConnect({ socket, servername: host, rejectUnauthorized: false }, () => resolve(tlsSocket));
    tlsSocket.once("error", reject);
  });
  await sendLine(upgraded, `EHLO ${host}`);
  return upgraded;
}

export async function sendSmtpMessage(options: SmtpSendOptions): Promise<{ ok: boolean; error?: string }> {
  const { host, port, from, to, subject, body } = options;
  const secure = options.secure ?? port === 465;

  try {
    const socket = await new Promise<Duplex>((resolve, reject) => {
      if (secure) {
        const s = tlsConnect({ host, port, servername: host, rejectUnauthorized: false }, () => resolve(s));
        s.once("error", reject);
        return;
      }
      const s = netConnect({ host, port }, () => resolve(s as Socket));
      s.once("error", reject);
    });

    await readResponse(socket);
    await sendLine(socket, `EHLO ${host}`);

    let active = socket;
    if (!secure && port !== 25) {
      active = await upgradeStartTls(socket, host);
    }

    if (options.user && options.pass) {
      await sendLine(active, "AUTH LOGIN");
      await sendLine(active, Buffer.from(options.user).toString("base64"));
      await sendLine(active, Buffer.from(options.pass).toString("base64"));
    }

    await sendLine(active, `MAIL FROM:<${from}>`);
    await sendLine(active, `RCPT TO:<${to}>`);
    await sendLine(active, "DATA");
    active.write(
      `From: ${from}\r\nTo: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}\r\n.\r\n`,
    );
    await readResponse(active);
    await sendLine(active, "QUIT");
    active.end();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
