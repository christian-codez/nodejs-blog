const { encrypt } = require("../../helpers/encrypt")

describe('ENCRYPTION FUNCTION:', () => {
    it('should not return the same password passed to it', async() => {
        const password = "1234";
        const hashedPassword = await encrypt(password);
        expect(hashedPassword).not.toBe(password);
    });

    it('should not return undefined password', async() => {
        const password = "1234";
        const hashedPassword = await encrypt(password);

        expect(hashedPassword).not.toBeUndefined();
    });
});