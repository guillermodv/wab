const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const NOAUDIOANSWER =
  "No puedo escuchar audios en este momento, mensaje autogenerado.";
const REJECTCALLS = true;

const client = new Client();

client.on("qr", (qr) => {
  console.log("scan on your WhatsApp.");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

client.on("message", (msg) => {
  console.log("MESSAGE RECEIVED", msg.body);
  const { waveform } = msg._data;
  if (waveform) {
    try {
      msg.reply(NOAUDIOANSWER);
    } catch (error) {
      console.log("Error trying to response message.");
    }
  }
});

client.on("call", async (call) => {
  if (REJECTCALLS) await call.reject();
  try {
    await client.sendMessage(
      call.from,
      `[${call.fromMe ? "Outgoing" : "Incoming"}] Phone call from ${
        call.from
      }, type ${call.isGroup ? "group" : ""} ${
        call.isVideo ? "video" : "audio"
      } call. ${REJECTCALLS ? "This call was automatically declined." : ""}`
    );
  } catch (error) {
    console.log("Error trying to response message.");
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.initialize();
