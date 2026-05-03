const { SolapiMessageService } = require("solapi");

const messageService = new SolapiMessageService(
    "NCS2LDAKE53KL5PR",
    "L5PTRYV4A0KSSMYVFVOC3VFUYRHQFWZG"
);

async function sendSMS(to, message) {
    try {
        const result = await messageService.send({
            to,
            from: "01045171684",
            text: message
        });

        return { success: true, result };

    } catch (e) {
        return { success: false, error: e.message };
    }
}

module.exports = { sendSMS };